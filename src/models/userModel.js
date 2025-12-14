const db = require('../config/db');

// Tìm người dùng bằng email (dùng cho Đăng nhập)
const findByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

// Tạo người dùng mới (dùng cho Đăng ký)
const createUser = async (data) => {
    const [result] = await db.query(
        'INSERT INTO users (email, password, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
        [data.email, data.password, data.full_name, data.phone, data.address, data.role || 'user']
    );
    return result.insertId;
};

// Tìm người dùng bằng ID
const findById = async (id) => {
    const [rows] = await db.query('SELECT user_id, email, full_name, role FROM users WHERE user_id = ?', [id]);
    return rows[0];
};

module.exports = { findByEmail, createUser, findById };