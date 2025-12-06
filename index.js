const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import thư viện CORS
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Cấu hình CORS (QUAN TRỌNG CHO FRONTEND)
app.use(cors());

// 2. Cấu hình Body Parser (Để đọc JSON từ Postman/Frontend)
app.use(bodyParser.json());

// 3. Import các Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const athleteRoutes = require('./src/routes/athleteRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const articleRoutes = require('./src/routes/articleRoutes');

// 4. Import Middleware xác thực (Dùng cho các route cần bảo vệ)
const { authenticateUser } = require('./src/middleware/authMiddleware');


// ==========================================
// ĐỊNH NGHĨA CÁC TUYẾN ĐƯỜNG (ROUTES)
// ==========================================

// Route Bảo mật (Đăng nhập, Đăng ký, Google Login)
app.use('/api/auth', authRoutes);

// Route Sản phẩm (Xem, Thêm, Sửa, Xóa)
app.use('/api/products', productRoutes);

// Route Tuyển thủ (Xem, Thêm, Sửa, Xóa)
app.use('/api/athletes', athleteRoutes);

// Route Giỏ hàng (Cần đăng nhập -> dùng authenticateUser)
app.use('/api/cart', authenticateUser, cartRoutes); 

// Route Đơn hàng (Cần đăng nhập -> dùng authenticateUser)

app.use('/api/orders', orderRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/articles', articleRoutes);

// ==========================================
// KHỞI CHẠY SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`[MySQL] Đang chờ kết nối...`);
});