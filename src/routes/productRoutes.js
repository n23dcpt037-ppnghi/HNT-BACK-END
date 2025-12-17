const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads/products/');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, name + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// ========== ROUTES ==========

// 1. PUBLIC ROUTES (Không cần auth)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// 2. ADMIN ROUTES (Cần auth)
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
);

router.delete('/:id', 
    authenticateUser, 
    adminOnly,
    productController.deleteProduct
);

module.exports = router;