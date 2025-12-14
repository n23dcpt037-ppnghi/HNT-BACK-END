const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const articleController = require('../controllers/articleController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../../uploads/articles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Lưu file vào thư mục uploads/articles
        const uploadPath = path.join(__dirname, '../../uploads/articles');
        require('fs').mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedDocTypes = ['application/pdf', 'application/msword', 
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (file.fieldname === 'image' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'content_file' && allowedDocTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    }
});

// Public
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// Admin Only: Chỉ Admin được đăng/sửa/xóa
router.post('/', 
    authenticateUser, 
    adminOnly,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'content_file', maxCount: 1 }
    ]),
    articleController.createArticle
);

router.put('/:id', 
    authenticateUser, 
    adminOnly,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'content_file', maxCount: 1 }
    ]),
    articleController.updateArticle
);

router.delete('/:id', authenticateUser, adminOnly, articleController.deleteArticle);
router.get('/popular', articleController.getPopularArticles);
module.exports = router;