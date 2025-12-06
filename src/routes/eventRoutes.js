const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware');

// PUBLIC - User vào xem lịch
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// ADMIN ONLY 
router.post('/', authenticateUser, adminOnly, eventController.createEvent);
router.put('/:id', authenticateUser, adminOnly, eventController.updateEvent);
router.delete('/:id', authenticateUser, adminOnly, eventController.deleteEvent);

module.exports = router;