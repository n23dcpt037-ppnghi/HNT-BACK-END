const db = require('../config/db');
const cartModel = require('./cartModel'); 
const productModel = require('./productModel'); 

const createOrder = async (userId, cartItems, shippingData, totalAmount) => {
    // 1. Bắt đầu Transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 2. TRỪ TỒN KHO VÀ CHUẨN BỊ CHI TIẾT ĐƠN HÀNG
        const orderDetailsData = [];
        let subtotal = 0;
        
        for (const item of cartItems) {
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?',
                [item.quantity, item.product_id, item.quantity]
            );

            // Tính tiền sản phẩm
            const itemTotal = item.price_vnd * item.quantity;
            subtotal += itemTotal;

            orderDetailsData.push([
                item.product_id, 
                item.quantity, 
                item.price_vnd 
            ]);
        }

        // 3. TÍNH TỔNG TIỀN (sản phẩm + ship 30k)
        const shippingFee = 30000;
        const finalTotal = subtotal + shippingFee;

        // 4. TẠO BẢN GHI ĐƠN HÀNG CHÍNH (Bảng orders)
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, order_date, total_amount, shipping_name, shipping_address, shipping_phone) 
             VALUES (?, CURDATE(), ?, ?, ?, ?)`,
            [
                userId, 
                finalTotal, 
                shippingData.shipping_name, 
                shippingData.shipping_address, 
                shippingData.shipping_phone
            ]
        );
        const orderId = orderResult.insertId;

        // 5. TẠO BẢN GHI CHI TIẾT ĐƠN HÀNG (Bảng order_details)
        const orderDetailsValues = orderDetailsData.map(detail => [orderId, ...detail]);
        
        await connection.query(
            'INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES ?',
            [orderDetailsValues]
        );
        
        // 6. XÓA GIỎ HÀNG SAU KHI ĐẶT THÀNH CÔNG
        await cartModel.clearCartByUserId(userId);

        // 7. Kết thúc Transaction
        await connection.commit();
        return orderId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Cập nhật thông tin giao hàng
const updateShippingInfo = async (orderId, userId, newInfo) => {
    // 1. Kiểm tra trạng thái hiện tại của đơn hàng
    const [rows] = await db.query(
        'SELECT status FROM orders WHERE order_id = ? AND user_id = ?', 
        [orderId, userId]
    );

    if (rows.length === 0) {
        throw new Error("ORDER_NOT_FOUND"); 
    }

    const currentStatus = rows[0].status;

    // 2. Chỉ cho phép sửa nếu chưa vận chuyển
    if (currentStatus === 'shipped' || currentStatus === 'completed' || currentStatus === 'cancelled') {
        throw new Error("CANNOT_UPDATE_SHIPPED");
    }

    // 3. Thực hiện cập nhật
    const [result] = await db.query(
        'UPDATE orders SET shipping_name = ?, shipping_address = ?, shipping_phone = ? WHERE order_id = ?',
        [newInfo.shipping_name, newInfo.shipping_address, newInfo.shipping_phone, orderId]
    );

    return result.affectedRows;
};

const getOrdersByUserId = async (userId) => {
    try {
        const [orders] = await db.query(`
            SELECT 
                o.order_id as id,
                o.order_id,
                o.total_amount,
                o.status,
                o.shipping_name,
                o.shipping_address,
                o.shipping_phone,
                o.order_date,
                -- Tính toán chi tiết
                (SELECT COALESCE(SUM(od.quantity * od.unit_price), 0) 
                 FROM order_details od 
                 WHERE od.order_id = o.order_id) as subtotal,
                30000 as shipping_fee, -- Cố định 30k
                -- Đếm số sản phẩm
                (SELECT COUNT(*) FROM order_details od WHERE od.order_id = o.order_id) as item_count,
                -- Lấy tên sản phẩm đầu tiên
                (SELECT p.product_name 
                 FROM order_details od 
                 JOIN products p ON od.product_id = p.product_id 
                 WHERE od.order_id = o.order_id 
                 LIMIT 1) as first_product_name
            FROM orders o 
            WHERE o.user_id = ?
            ORDER BY o.order_date DESC
        `, [userId]);
        
        return orders.map(order => ({
            ...order,
            order_code: `#ORDER${order.order_id.toString().padStart(6, '0')}`,
            item_count: order.item_count || 0,
            preview_product: order.first_product_name || 'Sản phẩm',
            total_amount: order.total_amount || (order.subtotal + 30000)
        }));
    } catch (error) {
        console.error("Lỗi getOrdersByUserId:", error);
        throw error;
    }
};

const getOrderById = async (orderId, userId) => {
    try {
        const [orders] = await db.query(`
            SELECT 
                o.order_id,
                o.user_id,
                o.order_date,
                o.total_amount,
                o.status,
                o.shipping_name,
                o.shipping_address,
                o.shipping_phone,
                -- Lấy thông tin user
                u.full_name as user_name,
                u.email as user_email,
                u.phone as user_phone,
                -- Tính toán lại (đề phòng lỗi)
                o.total_amount as total_amount_original
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.user_id
            WHERE o.order_id = ? AND o.user_id = ?
        `, [orderId, userId]);
        
        if (orders.length === 0) {
            return null;
        }
        
        const order = orders[0];

        const [orderItems] = await db.query(`
            SELECT 
                od.order_detail_id,
                od.order_id,
                od.product_id,
                od.quantity,
                od.unit_price,
                od.quantity * od.unit_price as item_total,
                -- Lấy thông tin sản phẩm
                p.product_name,
                p.category,
                p.description,
                p.image_url
            FROM order_details od
            LEFT JOIN products p ON od.product_id = p.product_id
            WHERE od.order_id = ?
            ORDER BY od.order_detail_id ASC
        `, [orderId]);
        
        // Tính tổng tiền sản phẩm
        const subtotal = orderItems.reduce((sum, item) => {
            return sum + (item.quantity * item.unit_price);
        }, 0);
        
        // Cước ship mặc định: 30,000 VND
        const shippingFee = 30000;
        
        // Tính tổng tiền cuối cùng
        const finalTotal = subtotal + shippingFee;
        
        // Gán items thật vào order
        order.items = orderItems.map(item => ({
            product_id: item.product_id,
            product_name: item.product_name || 'Sản phẩm',
            product_image: item.image_url,
            category: item.category,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.item_total
        }));
        
        // Thêm thông tin phí ship và tính toán
        order.subtotal = subtotal;
        order.shipping_fee = shippingFee;
        order.final_total = finalTotal;
        
        // Đảm bảo total_amount là đúng
        order.total_amount = finalTotal;
        
        return order;
        
    } catch (error) {
        console.error("Lỗi getOrderById:", error);
        throw error;
    }
};

module.exports = { 
    createOrder,
    updateShippingInfo,
    getOrdersByUserId,
    getOrderById 
};

