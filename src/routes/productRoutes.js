const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware'); // Import Middleware
const mysql = require('mysql2');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Phgngi431863028',
    database: process.env.DB_NAME || 'swimming_club_shop'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../sp_home/images'); 
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Đặt tên file tránh trùng: Time + Random + Đuôi file gốc
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 1. ROUTES CÔNG KHAI (PUBLIC - READ)
router.get('/', productController.getAllProducts); // GET /api/products
router.get('/:id', productController.getProductById); // GET /api/products/1

// 2. ROUTES DÀNH CHO ADMIN (CREATE, UPDATE, DELETE)
// Thứ tự: Middleware Xác thực -> Middleware Phân quyền (AdminOnly) -> Controller
router.post('/', 
    authenticateUser, 
    adminOnly, 
    upload.single('image'),  
    productController.createProduct
);

router.put('/:id', 
    authenticateUser, 
    adminOnly, 
    upload.single('image'),  
    productController.updateProduct
); // PUT /api/products/:id


router.get('/', (req, res) => {
    // ORDER BY event_date DESC: Ngày gần nhất lên đầu
    const sql = "SELECT * FROM products ORDER BY product_id DESC"; 
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        res.json(results);
    });
});

 // DELETE /api/products/:id
router.delete('/:id', authenticateUser, adminOnly, (req, res) => {
    const sql = "DELETE FROM products WHERE product_id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi xóa" });
        res.json({ message: "Đã xóa thành công" });
    });
});

module.exports = router;