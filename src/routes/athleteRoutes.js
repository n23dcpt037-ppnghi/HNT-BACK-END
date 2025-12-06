const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware'); // Import Middleware

// 1. ROUTES CÔNG KHAI (PUBLIC - READ)
router.get('/', athleteController.getAllAthletes); // GET /api/athletes (Xem danh sách)
router.get('/:id', athleteController.getAthleteById); // GET /api/athletes/1 (Xem chi tiết)

// 2. ROUTES DÀNH CHO ADMIN (CREATE, UPDATE, DELETE)
// Thứ tự: Middleware Xác thực -> Middleware Phân quyền (AdminOnly) -> Controller
router.post('/', authenticateUser, adminOnly, athleteController.createAthlete); // POST /api/athletes
router.put('/:id', authenticateUser, adminOnly, athleteController.updateAthlete); // PUT /api/athletes/:id
router.delete('/:id', authenticateUser, adminOnly, athleteController.deleteAthlete); // DELETE /api/athletes/:id

module.exports = router;