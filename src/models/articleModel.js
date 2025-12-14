const db = require('../config/db');

// Lấy danh sách bài báo (Mới nhất lên đầu)
const findAll = async () => {
    try {
        const [rows] = await db.query(`
            SELECT 
                article_id,
                article_code,
                title, 
                author, 
                category,
                summary, 
                content, 
                image_url, 
                file_url,
                DATE(published_at) as published_at,
                views,
                created_at,
                updated_at
            FROM articles 
            ORDER BY published_at DESC
        `);
        return rows;
    } catch (error) {
        console.error('❌ Lỗi findAll articles:', error);
        throw error;
    }
};

// Xem chi tiết bài báo
const findById = async (id) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                article_id,
                article_code,
                title, 
                author, 
                category,
                summary, 
                content, 
                image_url, 
                file_url,
                DATE(published_at) as published_at,
                views,
                created_at,
                updated_at
            FROM articles 
            WHERE article_id = ?
        `, [id]);
        return rows[0];
    } catch (error) {
        console.error('❌ Lỗi findById articles:', error);
        throw error;
    }
};

// Tìm bài báo theo mã
const findByCode = async (article_code) => {
    try {
        const [rows] = await db.query('SELECT * FROM articles WHERE article_code = ?', [article_code]);
        return rows[0];
    } catch (error) {
        console.error('❌ Lỗi findByCode articles:', error);
        throw error;
    }
};

// Tạo bài báo mới 
const createArticle = async (data) => {
    try {
        console.log('💾 Dữ liệu lưu vào DB:', data);
        
        const [result] = await db.query(
            `INSERT INTO articles 
             (article_code, title, author, category, summary, content, 
              image_url, file_url, published_at, views) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.article_code || `TT${Date.now()}`,
                data.title,
                data.author,
                data.category,
                data.summary || '',
                data.content,
                data.image_url || null,
                data.file_url || null,
                data.published_at || new Date(),
                data.views || 0
            ]
        );
        return result.insertId;
    } catch (error) {
        console.error('❌ Lỗi createArticle:', error);
        throw error;
    }
};

// Cập nhật bài báo 
const updateArticle = async (id, data) => {
    try {
        // 1. Lấy dữ liệu cũ
        const [rows] = await db.query('SELECT * FROM articles WHERE article_id = ?', [id]);
        
        if (rows.length === 0) return 0;
        
        const oldData = rows[0];

        // 2. Gộp dữ liệu 
        const updateFields = {
            title: data.title !== undefined ? data.title : oldData.title,
            author: data.author !== undefined ? data.author : oldData.author,
            category: data.category !== undefined ? data.category : oldData.category,
            summary: data.summary !== undefined ? data.summary : oldData.summary,
            content: data.content !== undefined ? data.content : oldData.content,
            image_url: data.image_url !== undefined ? data.image_url : oldData.image_url,
            file_url: data.file_url !== undefined ? data.file_url : oldData.file_url,
            published_at: data.published_at !== undefined ? data.published_at : oldData.published_at,
            views: data.views !== undefined ? data.views : oldData.views
        };

        // 3. Thực hiện Update
        const [result] = await db.query(
            `UPDATE articles 
             SET title = ?, author = ?, category = ?, summary = ?, content = ?,
                 image_url = ?, file_url = ?, published_at = ?, views = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE article_id = ?`,
            [
                updateFields.title,
                updateFields.author,
                updateFields.category,
                updateFields.summary,
                updateFields.content,
                updateFields.image_url,
                updateFields.file_url,
                updateFields.published_at,
                updateFields.views,
                id
            ]
        );
        
        console.log('✅ Cập nhật thành công, affectedRows:', result.affectedRows);
        return result.affectedRows;
    } catch (error) {
        console.error('❌ Lỗi updateArticle:', error);
        throw error;
    }
};

// Xóa bài báo
const deleteArticle = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM articles WHERE article_id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error('❌ Lỗi deleteArticle:', error);
        throw error;
    }
};

// Tăng lượt xem
const incrementViews = async (id) => {
    try {
        const [result] = await db.query(
            'UPDATE articles SET views = views + 1 WHERE article_id = ?',
            [id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('❌ Lỗi incrementViews:', error);
        throw error;
    }
};

module.exports = { 
    findAll, 
    findById, 
    findByCode,
    createArticle, 
    updateArticle, 
    deleteArticle,
    incrementViews 
};