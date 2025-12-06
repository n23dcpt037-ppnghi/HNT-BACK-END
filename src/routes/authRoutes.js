const express = require('express');
const router = express.Router(); 
const authController = require('../controllers/authController');

// Route dang ky
router.post('/register', authController.register);

// Route dang nhap
router.post('/login', authController.login);

// ROUTE GOOGLE
router.post('/google', authController.googleLogin);

module.exports = router;