const db = require('../config/db');

// READ: Lấy tất cả Tuyển thủ
const findAll = async () => {
    try {
        const [rows] = await db.query('SELECT athlete_id, full_name, achievements, image_url FROM athletes');
        return rows;
    } catch (error) {
        throw error;
    }
};

// READ: Lấy chi tiết Tuyển thủ theo ID
const findById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM athletes WHERE athlete_id = ?', [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// CREATE: Thêm Tuyển thủ mới (Admin)
const createAthlete = async (data) => {
    try {
        const [result] = await db.query(
            'INSERT INTO athletes (full_name, description, achievements, image_url) VALUES (?, ?, ?, ?)',
            [data.full_name, data.description, data.achievements, data.image_url]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// DELETE: Xóa Tuyển thủ (Admin)
const deleteAthlete = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM athletes WHERE athlete_id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

const updateAthlete = async (id, data) => {
    try {
        // 1. Lấy thông tin cũ trước
        const [rows] = await db.query('SELECT * FROM athletes WHERE athlete_id = ?', [id]);
        if (rows.length === 0) return 0;
        const oldData = rows[0];

        // 2. Gộp dữ liệu mới và cũ (Nếu data mới không có thì dùng cái cũ)
        const full_name = data.full_name || oldData.full_name;
        const description = data.description || oldData.description;
        const achievements = data.achievements || oldData.achievements;
        const image_url = data.image_url || oldData.image_url;

        // 3. Thực hiện Update
        const [result] = await db.query(
            'UPDATE athletes SET full_name = ?, description = ?, achievements = ?, image_url = ? WHERE athlete_id = ?',
            [full_name, description, achievements, image_url, id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAll,
    findById,
    createAthlete,
    updateAthlete,
    deleteAthlete,
};