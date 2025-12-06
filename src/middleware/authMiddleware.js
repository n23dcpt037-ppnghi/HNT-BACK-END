const jwt = require('jsonwebtoken');

// Middleware Xác thực người dùng (Kiểm tra token)
const authenticateUser = (req, res, next) => {
    // Lấy token từ header Authorization (ví dụ: "Bearer eyJ...")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Truy cập bị từ chối. Không có token.' });
    }

    try {
        // GIẢI MÃ TOKEN (sử dụng JWT_SECRET trong .env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // GẮN userId VÀ role VÀO REQUEST (RẤT QUAN TRỌNG CHO LOGIC GIỎ HÀNG)
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next(); // Cho phép request đi tiếp
    } catch (error) {
        // Nếu token hết hạn hoặc không hợp lệ
        res.status(401).json({ message: 'Token không hợp lệ.' });
    }
};

// Middleware Phân quyền (Kiểm tra vai trò Admin)
const adminOnly = (req, res, next) => {
    // Phải chạy sau authenticateUser
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Truy cập bị từ chối. Chỉ dành cho Admin.' });
    }
    next();
};

module.exports = { authenticateUser, adminOnly };