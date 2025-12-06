const eventModel = require('../models/eventModel');

// [PUBLIC] Lấy danh sách sự kiện
const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.findAll();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server khi lấy danh sách sự kiện." });
    }
};

// [PUBLIC] Xem chi tiết sự kiện
const getEventById = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Sự kiện không tồn tại." });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

// [ADMIN] Tạo sự kiện (POST)
const createEvent = async (req, res) => {
    try {
        const { title, event_date, location } = req.body;
        // Kiểm tra dữ liệu bắt buộc
        if (!title || !event_date || !location) {
            return res.status(400).json({ message: "Thiếu thông tin (Tên, Ngày, Địa điểm)." });
        }
        
        const newId = await eventModel.createEvent(req.body);
        res.status(201).json({ message: "Đăng lịch thi đấu thành công!", eventId: newId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server." });
    }
};

// [ADMIN] Sửa sự kiện (PUT)
const updateEvent = async (req, res) => {
    try {
        const affectedRows = await eventModel.updateEvent(req.params.id, req.body);
        if (affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy sự kiện để sửa." });
        res.status(200).json({ message: "Cập nhật lịch thi đấu thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

// [ADMIN] Xóa sự kiện (DELETE)
const deleteEvent = async (req, res) => {
    try {
        const affectedRows = await eventModel.deleteEvent(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy sự kiện để xóa." });
        res.status(200).json({ message: "Xóa sự kiện thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server." });
    }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };