const db = require('../config/db');

// Lấy tất cả sự kiện
const findAll = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM events');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy sự kiện theo ID
const findById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM events WHERE event_id = ?', [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Tạo sự kiện mới
const createEvent = async (data) => {
    try {
        const [result] = await db.query(
            'INSERT INTO events (title, description, event_date, location, image_url) VALUES (?, ?, ?, ?, ?)',
            [data.title, data.description, data.event_date, data.location, data.image_url]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Cập nhật sự kiện
const updateEvent = async (id, data) => {
    try {
        // Lấy dữ liệu cũ để merge
        const [rows] = await db.query('SELECT * FROM events WHERE event_id = ?', [id]);
        if (rows.length === 0) return 0;
        const oldData = rows[0];

        const title = data.title || oldData.title;
        const description = data.description || oldData.description;
        const event_date = data.event_date || oldData.event_date;
        const location = data.location || oldData.location;
        const image_url = data.image_url || oldData.image_url;

        const [result] = await db.query(
            'UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, image_url = ? WHERE event_id = ?',
            [title, description, event_date, location, image_url, id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// Xóa sự kiện
const deleteEvent = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM events WHERE event_id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAll,
    findById,
    createEvent,
    updateEvent,
    deleteEvent
};