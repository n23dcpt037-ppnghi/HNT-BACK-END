// src/config/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

const sendOrderConfirmation = async (recipientEmail, orderDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `[CLB Bơi Lội HNT] Xác nhận Đơn hàng #${orderDetails.orderId}`,
        html: `<p>Xin chào ${orderDetails.shippingName},</p>
               <p>Đơn hàng #${orderDetails.orderId} của bạn đã được tiếp nhận thành công.</p>
               <p>Tổng tiền: ${orderDetails.totalAmount} VND</p>
               <p>Địa chỉ giao hàng: ${orderDetails.shippingAddress}</p>
               <p>Cảm ơn bạn đã mua hàng!</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email xác nhận đã gửi đến: ${recipientEmail}`);
        return true;
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        throw new Error('Lỗi gửi email: ' + error.message);
    }
};

module.exports = { sendOrderConfirmation };