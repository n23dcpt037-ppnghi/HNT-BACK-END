const db = require('../config/db');

// READ: Lấy chi tiết Giỏ hàng của người dùng
const getCartByUserId = async (userId) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                ci.product_id, ci.quantity, p.product_name, p.price_vnd, p.stock
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.user_id = ?`, 
            [userId]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// ADD/UPDATE: Thêm/Cập nhật số lượng sản phẩm vào Giỏ hàng
const addItemToCart = async (userId, productId, quantity) => {
    try {
        const [result] = await db.query(
            `INSERT INTO cart_items (user_id, product_id, quantity) 
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [userId, productId, quantity]
        );
        return result;
    } catch (error) {
        throw error;
    }
};

// REMOVE: Xóa sản phẩm khỏi Giỏ hàng
const removeItemFromCart = async (userId, productId) => {
    try {
        const [result] = await db.query(
            'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// SET QUANTITY: Cập nhật số lượng mới
const setItemQuantity = async (userId, productId, newQuantity) => {
    try {
        const [result] = await db.query(
            'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [newQuantity, userId, productId]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// DELETE: Xóa toàn bộ Giỏ hàng
const clearCartByUserId = async (userId) => {
    try {
        const [result] = await db.query(
            'DELETE FROM cart_items WHERE user_id = ?',
            [userId]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCartByUserId,
    addItemToCart,
    removeItemFromCart,
    setItemQuantity,
    clearCartByUserId,
};