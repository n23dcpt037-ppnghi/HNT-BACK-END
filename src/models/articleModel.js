const db = require('../config/db');

// Lấy danh sách bài báo (Mới nhất lên đầu)
const findAll = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM articles ORDER BY published_at DESC');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Xem chi tiết bài báo
const findById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM articles WHERE article_id = ?', [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Tạo bài báo mới
const createArticle = async (data) => {
    try {
        
        const [result] = await db.query(
            'INSERT INTO articles (title, summary, content, image_url, author, views) VALUES (?, ?, ?, ?, ?, ?)',
            [data.title, data.summary, data.content, data.image_url, data.author, data.views || 0]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Cập nhật bài báo (Logic thông minh - Fix lỗi views)
const updateArticle = async (id, data) => {
    try {
        // 1. Lấy dữ liệu cũ
        const [rows] = await db.query('SELECT * FROM articles WHERE article_id = ?', [id]);
        
        // Nếu không tìm thấy bài báo
        if (rows.length === 0) return 0;
        
        const oldData = rows[0];

        // 2. Gộp dữ liệu (Giữ cũ nếu mới không có)
        const title = data.title !== undefined ? data.title : oldData.title;
        const summary = data.summary !== undefined ? data.summary : oldData.summary;
        const content = data.content !== undefined ? data.content : oldData.content;
        const image_url = data.image_url !== undefined ? data.image_url : oldData.image_url;
        const author = data.author !== undefined ? data.author : oldData.author;
        
        // Xử lý riêng cho số (views) để tránh lỗi với số 0
        const views = data.views !== undefined ? data.views : oldData.views;

        // 3. Thực hiện Update
        const [result] = await db.query(
            'UPDATE articles SET title = ?, summary = ?, content = ?, image_url = ?, author = ?, views = ? WHERE article_id = ?',
            [title, summary, content, image_url, author, views, id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// Xóa bài báo
const deleteArticle = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM articles WHERE article_id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

module.exports = { findAll, findById, createArticle, updateArticle, deleteArticle };