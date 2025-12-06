const db = require('../config/db');

// READ: Lấy tất cả Sản phẩm có tồn kho > 0
const findAll = async () => {
    try {
        const [rows] = await db.query('SELECT product_id, product_name, price_vnd, stock, image_url, category FROM products WHERE stock > 0');
        return rows;
    } catch (error) {
        throw error;
    }
};

// READ: Lấy chi tiết Sản phẩm theo ID
const findById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE product_id = ?', [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// CREATE: Thêm Sản phẩm mới (Admin)
const createProduct = async (data) => {
    try {
        const [result] = await db.query(
            'INSERT INTO products (product_name, category, description, price_vnd, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [data.product_name, data.category, data.description, data.price_vnd, data.stock, data.image_url]
        );
        return result.insertId; 
    } catch (error) {
        throw error;
    }
};

// UPDATE: Cập nhật thông tin Sản phẩm (Admin)
const updateProduct = async (id, data) => {
    try {
        const [result] = await db.query(
            'UPDATE products SET product_name = ?, category = ?, description = ?, price_vnd = ?, stock = ?, image_url = ? WHERE product_id = ?',
            [data.product_name, data.category, data.description, data.price_vnd, data.stock, data.image_url, id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// DELETE: Xóa Sản phẩm (Admin)
const deleteProduct = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAll,
    findById,
    createProduct,
    updateProduct,
    deleteProduct,
    // Hàm updateStock sẽ do Người A sử dụng khi tạo đơn hàng
};