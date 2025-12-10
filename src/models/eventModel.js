const db = require('../config/db');

// Lấy tất cả sự kiện (sắp xếp theo thời gian)
const findAll = async () => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM events ORDER BY event_date DESC, event_time DESC'
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy sự kiện sắp diễn ra (từ ngày hiện tại trở đi)
const findUpcoming = async () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const currentTime = new Date().toTimeString().split(' ')[0]; // HH:MM:SS
        
        const [rows] = await db.query(
            `SELECT * FROM events 
             WHERE CONCAT(event_date, ' ', event_time) >= CONCAT(?, ' ', ?)
             OR (event_date = ? AND event_time >= ?)
             ORDER BY event_date ASC, event_time ASC`,
            [currentDate, currentTime, currentDate, currentTime]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy sự kiện đã diễn ra
const findPast = async () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().split(' ')[0];
        
        const [rows] = await db.query(
            `SELECT * FROM events 
             WHERE CONCAT(event_date, ' ', event_time) < CONCAT(?, ' ', ?)
             OR (event_date = ? AND event_time < ?)
             ORDER BY event_date DESC, event_time DESC`,
            [currentDate, currentTime, currentDate, currentTime]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// Lấy sự kiện theo ID
const findById = async (id) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM events WHERE event_id = ?', 
            [id]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Tạo sự kiện mới
const createEvent = async (data) => {
    try {
        const [result] = await db.query(
            `INSERT INTO events 
             (title, description, event_date, event_time, location, image_url, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [
                data.title, 
                data.description, 
                data.event_date, 
                data.event_time || '00:00:00', 
                data.location, 
                data.image_url
            ]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Cập nhật sự kiện
const updateEvent = async (id, data) => {
    try {
        const [rows] = await db.query('SELECT * FROM events WHERE event_id = ?', [id]);
        if (rows.length === 0) return 0;
        const oldData = rows[0];

        const title = data.title || oldData.title;
        const description = data.description || oldData.description;
        const event_date = data.event_date || oldData.event_date;
        const event_time = data.event_time || oldData.event_time;
        const location = data.location || oldData.location;
        const image_url = data.image_url || oldData.image_url;

        const [result] = await db.query(
            `UPDATE events SET 
             title = ?, description = ?, event_date = ?, event_time = ?, 
             location = ?, image_url = ?, updated_at = NOW() 
             WHERE event_id = ?`,
            [title, description, event_date, event_time, location, image_url, id]
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
    findUpcoming,
    findPast,
    createEvent,
    updateEvent,
    deleteEvent
};