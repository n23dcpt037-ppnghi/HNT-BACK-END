const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/authMiddleware');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Phgngi431863028',
    database: process.env.DB_NAME || 'swimming_club_shop'
});

// Route này bắt buộc phải ĐĂNG NHẬP để biết ai đang đặt hàng
router.post('/', authenticateUser, orderController.placeOrder); // POST /api/orders

// ROUTE MOI: Cập nhật thông tin giao hàng
// PUT /api/orders/:id/shipping
router.put('/:id/shipping', authenticateUser, orderController.updateShipping);
router.get('/my-orders', authenticateUser, orderController.getUserOrders);
router.get('/:id', authenticateUser, orderController.getOrderById);

router.get('/', (req, res) => {
    const sql = `
        SELECT 
            o.order_id, 
            o.shipping_name, 
            o.shipping_phone, 
            o.shipping_address, 
            o.total_amount, 
            o.status,
            u.full_name AS user_name
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        ORDER BY o.order_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi lấy đơn hàng:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.json(results);
    });
});

router.put('/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    
    const sql = "UPDATE orders SET status = ? WHERE order_id = ?";
    
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi update" });
        res.json({ message: "Cập nhật thành công" });
    });
});

module.exports = router;