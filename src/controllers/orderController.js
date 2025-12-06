const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const { sendOrderConfirmation } = require('../config/emailService'); // Tích hợp Email

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
        const userId = req.userId; // Lấy từ token
        const orderId = req.params.id; // Lấy từ URL
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

module.exports = { 
    placeOrder,
    updateShipping // <-- Nhớ thêm dòng này
};
