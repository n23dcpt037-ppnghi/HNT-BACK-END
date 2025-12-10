const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');
const { authenticateUser, adminOnly } = require('../middleware/authMiddleware'); // Import Middleware
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Phgngi431863028',
    database: process.env.DB_NAME || 'swimming_club_shop'
});

// ========== CẤU HÌNH UPLOAD ẢNH ==========
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tuyenthu/');
    },
    filename: function (req, file, cb) {
        // Tạo tên file unique: timestamp-random.extension
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// 1. ROUTES CÔNG KHAI (PUBLIC - READ)
router.get('/', athleteController.getAllAthletes); // GET /api/athletes (Xem danh sách)
router.get('/:id', athleteController.getAthleteById); // GET /api/athletes/1 (Xem chi tiết)

// 2. ROUTES DÀNH CHO ADMIN (CREATE, UPDATE, DELETE)
// Lấy danh sách tuyển thủ
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM athletes ORDER BY athlete_id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi lấy danh sách tuyển thủ:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM athletes WHERE athlete_id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi lấy thông tin tuyển thủ:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tuyển thủ' });
        }
        
        res.json(results[0]);
    });
});

// 3. POST create new athlete - THÊM UPLOAD ẢNH
router.post('/', authenticateUser, adminOnly, upload.single('image'), (req, res) => {
    try {
        console.log('Body:', req.body);
        console.log('File:', req.file);
        
        
        // Nhận dữ liệu từ form
        const data = req.body; // Không cần JSON.parse vì dùng FormData
        const imageUrl = req.file ? req.file.filename : null;
        
        // SQL INSERT với đầy đủ các cột
        const sql = `
            INSERT INTO athletes 
            (full_name, nickname, position, specialty, 
             date_of_birth, hometown, height_cm, weight_kg,
             contract_start, contract_end, achievements, 
             competition_history, description, image_url, age)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        if (!req.body.full_name) {
        console.log('ERROR: full_name is missing in req.body');
        console.log('Available keys:', Object.keys(req.body));
        return res.status(400).json({ 
            success: false, 
            message: 'Tên tuyển thủ là bắt buộc',
            receivedData: req.body 
        });
    }
        
        // Tính tuổi nếu có ngày sinh
        let age = null;
        if (data.date_of_birth) {
            const birthDate = new Date(data.date_of_birth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
        }
        
        const values = [
            data.full_name,
            data.nickname || null,
            data.position || null,
            data.specialty || null,
            data.date_of_birth || null,
            data.hometown || 'Hà Nội',
            data.height_cm || null,
            data.weight_kg || null,
            data.contract_start || null,
            data.contract_end || null,
            data.achievements || null,
            data.competition_history || null,
            data.description || null,
            imageUrl,
            age
        ];
        
        console.log('Values:', values);
        
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Lỗi thêm tuyển thủ:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Lỗi thêm tuyển thủ: ' + err.message 
                });
            }
            
            res.status(201).json({
                success: true,
                message: 'Thêm tuyển thủ thành công',
                athlete_id: result.insertId
            });
        });
        
    } catch (error) {
        console.error('Lỗi xử lý request:', error);
        res.status(400).json({ 
            success: false,
            message: 'Dữ liệu không hợp lệ: ' + error.message 
        });
    }
});

// 4. PUT update athlete - THÊM UPLOAD ẢNH
router.put('/:id', authenticateUser, adminOnly, upload.single('image'), (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        console.log(`Update athlete ${id}:`, data);
        console.log('File:', req.file);
        
        // Kiểm tra tuyển thủ có tồn tại không
        const checkSql = 'SELECT * FROM athletes WHERE athlete_id = ?';
        db.query(checkSql, [id], (checkErr, checkResults) => {
            if (checkErr) {
                console.error('Lỗi kiểm tra:', checkErr);
                return res.status(500).json({ message: 'Lỗi server' });
            }
            
            if (checkResults.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tuyển thủ' });
            }
            
            // Nếu có upload ảnh mới, dùng ảnh mới, không thì giữ ảnh cũ
            const imageUrl = req.file ? req.file.filename : checkResults[0].image_url;
            
            // Tính tuổi nếu có ngày sinh mới
            let age = checkResults[0].age;
            if (data.date_of_birth) {
                const birthDate = new Date(data.date_of_birth);
                const today = new Date();
                age = today.getFullYear() - birthDate.getFullYear();
            }
            
            const updateSql = `
                UPDATE athletes SET
                full_name = ?, nickname = ?, position = ?, specialty = ?,
                date_of_birth = ?, hometown = ?, height_cm = ?, weight_kg = ?,
                contract_start = ?, contract_end = ?, achievements = ?,
                competition_history = ?, description = ?, image_url = ?, age = ?
                WHERE athlete_id = ?
            `;
            
            const current = checkResults[0];
            const values = [
                data.full_name || current.full_name,
                data.nickname || current.nickname,
                data.position || current.position,
                data.specialty || current.specialty,
                data.date_of_birth || current.date_of_birth,
                data.hometown || current.hometown,
                data.height_cm || current.height_cm,
                data.weight_kg || current.weight_kg,
                data.contract_start || current.contract_start,
                data.contract_end || current.contract_end,
                data.achievements || current.achievements,
                data.competition_history || current.competition_history,
                data.description || current.description,
                imageUrl,
                age,
                id
            ];
            
            console.log('Update values:', values);
            
            db.query(updateSql, values, (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Lỗi cập nhật tuyển thủ:', updateErr);
                    return res.status(500).json({ 
                        success: false,
                        message: 'Lỗi cập nhật: ' + updateErr.message 
                    });
                }
                
                res.json({ 
                    success: true,
                    message: 'Cập nhật thành công',
                    affectedRows: updateResult.affectedRows 
                });
            });
        });
        
    } catch (error) {
        console.error('Lỗi xử lý request:', error);
        res.status(400).json({ 
            success: false,
            message: 'Dữ liệu không hợp lệ: ' + error.message 
        });
    }
});


// 5. API Xóa tuyển thủ
router.delete('/:id', authenticateUser, adminOnly, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM athletes WHERE athlete_id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi xóa tuyển thủ:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Lỗi server' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy tuyển thủ' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Xóa tuyển thủ thành công' 
        });
    });
});
module.exports = router;