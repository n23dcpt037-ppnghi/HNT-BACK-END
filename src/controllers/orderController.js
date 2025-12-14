const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const { sendOrderConfirmation } = require('../config/emailService'); 
const db = require('../config/db');
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { shipping_name, shipping_address, shipping_phone } = req.body;

        // 1. LẤY GIỎ HÀNG VÀ TÍNH TỔNG TIỀN
        const cartItems = await cartModel.getCartByUserId(userId);
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng rỗng." });
        }

        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.price_vnd * item.quantity;
        });

        // 2. TẠO ĐƠN HÀNG TRONG TRANSACTION (gọi Model)
        const orderId = await orderModel.createOrder(userId, cartItems, {
            shipping_name, shipping_address, shipping_phone
        }, totalAmount);

        // 3. GỬI EMAIL XÁC NHẬN (Tích hợp Hệ sinh thái)
        try {
            const user = await userModel.findById(userId); // Lấy email người dùng
            
            await sendOrderConfirmation(user.email, { 
                orderId, 
                totalAmount, 
                shippingName: shipping_name, 
                shippingAddress: shipping_address 
            });
            
             res.status(201).json({ 
                message: "Đặt hàng thành công. Vui lòng kiểm tra email xác nhận.", 
                orderId 
            });

        } catch (emailError) {
            // Nếu GỬI EMAIL THẤT BẠI (nhưng đặt hàng VẪN THÀNH CÔNG)
            console.error("Lỗi gửi email (Nghiêm trọng):", emailError.message);
             res.status(201).json({ 
                message: "Đặt hàng thành công (nhưng gửi email thất bại).", 
                orderId,
                emailError: "Kiểm tra lại cấu hình EMAIL_USER/EMAIL_PASS trong .env"
            });
        }

    } catch (error) {
        console.error("Lỗi đặt hàng (Transaction):", error);
        res.status(500).json({ message: "Đặt hàng thất bại. Vui lòng kiểm tra tồn kho hoặc thử lại sau." });
    }
};

// Xử lý yêu cầu cập nhật
const updateShipping = async (req, res) => {
    try {
        const userId = req.userId; 
        const orderId = req.params.id; 
        const { shipping_name, shipping_address, shipping_phone } = req.body;

        if (!shipping_name || !shipping_address || !shipping_phone) {
            return res.status(400).json({ message: "Thiếu thông tin giao hàng." });
        }

        await orderModel.updateShippingInfo(orderId, userId, {
            shipping_name, shipping_address, shipping_phone
        });

        res.status(200).json({ message: "Cập nhật thông tin giao hàng thành công!" });

    } catch (error) {
        console.error("Lỗi cập nhật đơn hàng:", error.message);
        
        if (error.message === "ORDER_NOT_FOUND") {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
        }
        if (error.message === "CANNOT_UPDATE_SHIPPED") {
            return res.status(400).json({ message: "Không thể thay đổi thông tin khi đơn hàng đang vận chuyển hoặc đã hoàn tất." });
        }

        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await orderModel.getOrdersByUserId(userId);
        
        res.status(200).json({
            success: true,
            orders: orders
        });
        
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi server khi lấy đơn hàng" 
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.userId; 
        const userRole = req.userRole || 'user'; 

        console.log(`[DEBUG] Lấy đơn hàng ${orderId} cho user ${userId} (role: ${userRole})`);

        // 1. Lấy thông tin đơn hàng
        const sqlOrder = `
            SELECT o.*, u.full_name as user_name, u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.user_id
            WHERE o.order_id = ?
        `;
        
        const [orders] = await db.execute(sqlOrder, [orderId]);

        if (orders.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy đơn hàng." 
            });
        }

        const order = orders[0];

        // 2. Kiểm tra quyền: Admin xem được tất cả, user chỉ xem của mình
        if (userRole !== 'admin' && order.user_id !== userId) {
            console.log(`[AUTH] User ${userId} không có quyền xem đơn ${orderId}`);
            return res.status(403).json({ 
                success: false,
                message: "Bạn không có quyền xem đơn hàng này." 
            });
        }

        // 3. Lấy sản phẩm trong đơn (DÙNG BẢNG order_details)
        const sqlItems = `
            SELECT 
                od.order_detail_id,
                od.product_id,
                od.quantity,
                od.unit_price,
                p.product_name,
                p.image_url,
                p.category
            FROM order_details od
            JOIN products p ON od.product_id = p.product_id
            WHERE od.order_id = ?
        `;
        
        const [items] = await db.execute(sqlItems, [orderId]);
        console.log(`[DEBUG] Tìm thấy ${items.length} sản phẩm trong order_details`);

        // 4. Format response
        const response = {
            success: true,
            order: {
                order_id: order.order_id,
                user_id: order.user_id,
                user_name: order.user_name,
                order_date: order.order_date,
                total_amount: order.total_amount,
                status: order.status,
                shipping_name: order.shipping_name,
                shipping_address: order.shipping_address,
                shipping_phone: order.shipping_phone,
                items: items.map(item => ({
                    order_detail_id: item.order_detail_id,
                    product_id: item.product_id,
                    product_name: item.product_name,
                    image_url: item.image_url,
                    category: item.category,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                    subtotal: item.unit_price * item.quantity
                }))
            }
        };

        console.log(`[DEBUG] Response: order ID ${response.order.order_id}, ${response.order.items.length} items`);
        res.status(200).json(response);

    } catch (error) {
        console.error("[ERROR] Lỗi lấy chi tiết đơn hàng:", error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi Server khi lấy chi tiết đơn hàng.",
            error: error.message 
        });
    }
};

module.exports = { 
    placeOrder,
    updateShipping,
    getUserOrders,
    getOrderById 
};

