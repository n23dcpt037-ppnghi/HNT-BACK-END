const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel'); 

// [CẦN ĐĂNG NHẬP] Xem giỏ hàng hiện tại
const getCart = async (req, res) => {
    try {
        // Lấy userId TỪ MIDDLEWARE
        const userId = req.userId; 
        const cartItems = await cartModel.getCartByUserId(userId);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// [CẦN ĐĂNG NHẬP] Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        // Lấy userId TỪ MIDDLEWARE
        const userId = req.userId; 

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
        }

        // 1. KIỂM TRA TỒN KHO
        const product = await productModel.findById(productId);
        if (!product || product.stock < quantity) {
            return res.status(400).json({ message: "Sản phẩm không đủ tồn kho hoặc không tồn tại." });
        }
        
        // 2. Thêm vào DB
        await cartModel.addItemToCart(userId, productId, quantity);
        res.status(200).json({ message: "Thêm vào giỏ hàng thành công." });

    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// [CẦN ĐĂNG NHẬP] Cập nhật số lượng
const updateQuantity = async (req, res) => {
    try {
        const { productId, newQuantity } = req.body;
        const userId = req.userId;

        if (newQuantity <= 0) {
             // Nếu số lượng mới <= 0, xóa sản phẩm
             await cartModel.removeItemFromCart(userId, productId);
             return res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ." });
        }

        // 1. KIỂM TRA TỒN KHO (ví dụ đơn giản)
        const product = await productModel.findById(productId);
        if (!product || product.stock < newQuantity) {
            return res.status(400).json({ message: "Số lượng vượt quá tồn kho." });
        }

        await cartModel.setItemQuantity(userId, productId, newQuantity);
        res.status(200).json({ message: "Cập nhật số lượng thành công." });

    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// [CẦN ĐĂNG NHẬP] Xóa sản phẩm khỏi giỏ
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;
        
        const affectedRows = await cartModel.removeItemFromCart(userId, productId);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ." });
        }
        res.status(200).json({ message: "Xóa khỏi giỏ hàng thành công." });

    } catch (error) {
        console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// Đảm bảo bạn đã EXPORT tất cả các hàm!
module.exports = { 
    getCart, 
    addToCart, 
    updateQuantity,  // <--- Lỗi là do thiếu dòng này!
    removeFromCart 
};