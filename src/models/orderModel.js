const db = require('../config/db');
const cartModel = require('./cartModel'); // Cần gọi Model Giỏ hàng
const productModel = require('./productModel'); // Cần gọi Model Sản phẩm

/**
 * Hàm tạo đơn hàng hoàn chỉnh (bao gồm Order, OrderDetails và trừ tồn kho)
 * Dùng TRANSACTION để đảm bảo tính toàn vẹn CSDL.
 */
const createOrder = async (userId, cartItems, shippingData, totalAmount) => {
    // 1. Bắt đầu Transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 2. TRỪ TỒN KHO VÀ CHUẨN BỊ CHI TIẾT ĐƠN HÀNG
        const orderDetailsData = [];
        
        for (const item of cartItems) {
            // Trừ tồn kho
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?',
                [item.quantity, item.product_id, item.quantity]
            );

            // Kiểm tra xem có dòng nào bị ảnh hưởng không (trừ tồn kho thành công không)
            // (Thực tế nên kiểm tra số lượng tồn kho trước khi trừ)

            orderDetailsData.push([
                item.product_id, 
                item.quantity, 
                item.price_vnd // Ghi lại giá tại thời điểm đặt hàng
            ]);
        }

        // 3. TẠO BẢN GHI ĐƠN HÀNG CHÍNH (Bảng orders)
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, order_date, total_amount, shipping_name, shipping_address, shipping_phone) 
             VALUES (?, CURDATE(), ?, ?, ?, ?)`,
            [
                userId, 
                totalAmount, 
                shippingData.shipping_name, 
                shippingData.shipping_address, 
                shippingData.shipping_phone
            ]
        );
        const orderId = orderResult.insertId;

        // 4. TẠO BẢN GHI CHI TIẾT ĐƠN HÀNG (Bảng order_details)
        const orderDetailsValues = orderDetailsData.map(detail => [orderId, ...detail]);
        
        // Thêm order_id vào mảng chi tiết
        await connection.query(
            'INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES ?',
            [orderDetailsValues]
        );
        
        // 5. XÓA GIỎ HÀNG SAU KHI ĐẶT THÀNH CÔNG
        await cartModel.clearCartByUserId(userId);

        // 6. Kết thúc Transaction
        await connection.commit();
        return orderId;

    } catch (error) {
        // Hoàn tác (Rollback) nếu có bất kỳ lỗi nào xảy ra
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
        throw new Error("ORDER_NOT_FOUND"); // Không tìm thấy đơn hàng của user này
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

module.exports = { 
    createOrder,
    updateShippingInfo 
};

