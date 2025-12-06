const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware'); // Import Middleware

// 1. ROUTES CÔNG KHAI (PUBLIC - READ)
router.get('/', productController.getAllProducts); // GET /api/products
router.get('/:id', productController.getProductById); // GET /api/products/1

// 2. ROUTES DÀNH CHO ADMIN (CREATE, UPDATE, DELETE)
// Thứ tự: Middleware Xác thực -> Middleware Phân quyền (AdminOnly) -> Controller
router.post('/', authenticateUser, adminOnly, productController.createProduct); // POST /api/products
router.put('/:id', authenticateUser, adminOnly, productController.updateProduct); // PUT /api/products/:id
router.delete('/:id', authenticateUser, adminOnly, productController.deleteProduct); // DELETE /api/products/:id

module.exports = router;