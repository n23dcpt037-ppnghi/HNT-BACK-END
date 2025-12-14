const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// 1. CẤU HÌNH MULTER CHO UPLOAD ẢNH
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/events/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'));
    }
};

const uploadEventImage = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter
});

// 2. PUBLIC ROUTES - Người dùng xem sự kiện
router.get('/', eventController.getAllEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/past', eventController.getPastEvents);
router.get('/:id', eventController.getEventById);

// 3. ADMIN ROUTES - Quản lý sự kiện
router.post('/', authenticateUser, adminOnly, uploadEventImage.single('image'), eventController.createEvent);
router.put('/:id', authenticateUser, adminOnly, uploadEventImage.single('image'), eventController.updateEvent);
router.delete('/:id', authenticateUser, adminOnly, eventController.deleteEvent);

module.exports = router;