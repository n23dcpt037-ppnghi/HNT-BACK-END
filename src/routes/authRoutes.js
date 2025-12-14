const express = require('express');
const router = express.Router(); 
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route dang ky
router.post('/register', authController.register);

// Route dang nhap
router.post('/login', authController.login);

// ROUTE GOOGLE
router.post('/google', authController.googleLogin);

router.get('/profile', authenticateUser, authController.getProfile);     
router.put('/profile', authenticateUser, authController.updateProfile);   

module.exports = router;