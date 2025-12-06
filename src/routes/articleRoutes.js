const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware');

// Public: Ai cũng xem được
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// Admin Only: Chỉ Admin được đăng/sửa/xóa
router.post('/', authenticateUser, adminOnly, articleController.createArticle);
router.put('/:id', authenticateUser, adminOnly, articleController.updateArticle);
router.delete('/:id', authenticateUser, adminOnly, articleController.deleteArticle);

module.exports = router;