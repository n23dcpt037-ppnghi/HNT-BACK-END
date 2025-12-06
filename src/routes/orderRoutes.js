const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route này bắt buộc phải ĐĂNG NHẬP để biết ai đang đặt hàng
router.post('/', authenticateUser, orderController.placeOrder); // POST /api/orders

// src/routes/orderRoutes.js
// ... (code cũ) ...

// Route đặt hàng
router.post('/', authenticateUser, orderController.placeOrder);

// ROUTE MOI: Cập nhật thông tin giao hàng
// PUT /api/orders/:id/shipping
router.put('/:id/shipping', authenticateUser, orderController.updateShipping);

module.exports = router;