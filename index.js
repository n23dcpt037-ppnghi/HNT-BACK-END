require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const mysql = require('mysql2'); 

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',      
    password: process.env.DB_PASSWORD || 'Phgngi431863028',  
    database: process.env.DB_NAME || 'swimming_club_shop' 
});

const { authenticateUser } = require('./src/middleware/authMiddleware');
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads/articles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

db.connect(err => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err);
    } else {
        console.log('✅ Đã kết nối MySQL thành công!');
    }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
 
app.use('/sp_home', express.static(path.join(__dirname, 'sp_home')));
app.use('/tuyenthu', express.static(path.join(__dirname, 'tuyenthu')));
app.use('/sk', express.static(path.join(__dirname, 'sk')));
app.use('/sp_home/images', express.static(path.join(__dirname, '../sp_home/images')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const athleteRoutes = require('./src/routes/athleteRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const articleRoutes = require('./src/routes/articleRoutes');


app.post('/api/auth/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    console.log(`🔑 Đang đổi mật khẩu cho email: ${email}`);

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Thiếu thông tin!" });
    }

    try {
        // 1. MÃ HÓA MẬT KHẨU
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 2. Lưu mật khẩu vào database
        const sql = "UPDATE users SET password = ? WHERE email = ?";

        db.query(sql, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error("❌ Lỗi SQL:", err);
                return res.status(500).json({ message: "Lỗi server: " + err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Email không tồn tại!" });
            }

            console.log("✅ Đổi mật khẩu thành công!");
            res.json({ message: "Cập nhật mật khẩu thành công!" });
        });

    } catch (error) {
        console.error("Lỗi mã hóa:", error);
        res.status(500).json({ message: "Lỗi server khi mã hóa mật khẩu" });
    }
});

// API: Lấy thống kê cho Dashboard Admin
app.get('/api/dashboard/stats', (req, res) => {
    const queries = {
        athletes: "SELECT COUNT(*) AS count FROM athletes",
        products: "SELECT COUNT(*) AS count FROM products",
        orders:   "SELECT COUNT(*) AS count FROM orders",
        events:   "SELECT COUNT(*) AS count FROM events", 
        articles: "SELECT COUNT(*) AS count FROM articles" 
    };

    const stats = {};
    let completed = 0;
    const keys = Object.keys(queries);

    // Hàm chạy từng query
    keys.forEach(key => {
        db.query(queries[key], (err, result) => {
            if (err) {
                console.error(`Lỗi đếm ${key}:`, err.message);
                stats[key] = 0;
            } else {
                stats[key] = result[0].count;
            }
            
            completed++;
            if (completed === keys.length) {
                res.json(stats);
            }
        });
    });
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/cart', authenticateUser, cartRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/articles', articleRoutes);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});