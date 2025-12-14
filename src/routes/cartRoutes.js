const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../middleware/authMiddleware'); 

router.use(authenticateUser);

// [CẦN ĐĂNG NHẬP] Xem giỏ hàng
router.get('/', cartController.getCart); 

// [CẦN ĐĂNG NHẬP] Thêm sản phẩm
router.post('/add', cartController.addToCart); 

// [CẦN ĐĂNG NHẬP] Cập nhật số lượng (Dòng 14 gây lỗi)
router.put('/update', cartController.updateQuantity); 

// [CẦN ĐĂNG NHẬP] Xóa sản phẩm
router.delete('/remove', cartController.removeFromCart); 

module.exports = router;