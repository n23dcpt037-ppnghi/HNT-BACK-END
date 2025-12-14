const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log('--- AUTH DEBUG ---');
        console.log('Header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Không tìm thấy token!' });
        }

        const token = authHeader.split(' ')[1];

        if (!process.env.JWT_SECRET) {
            console.error('❌ LỖI NGHIÊM TRỌNG: Chưa cấu hình JWT_SECRET trong file .env');
            return res.status(500).json({ success: false, message: 'Lỗi cấu hình server.' });
        }

   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        req.userId = decoded.userId;
        req.userRole = decoded.role; 

        console.log('✅ Xác thực thành công cho User ID:', decoded.userId, 'Role:', decoded.role);
        next();

    } catch (error) {
        console.error('❌ Lỗi Verify Token:', error.message);
        return res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn hoặc lỗi.' });
    }
};

const authorizeAdmin = (req, res, next) => {
    
    const userRole = req.userRole || (req.user && req.user.role);
    
    console.log('🔐 Check admin role:', { userRole, reqUser: req.user });
    
    if (userRole === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'Truy cập bị từ chối. Yêu cầu quyền Admin.',
            debug: { userRole, userId: req.userId }
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'Truy cập bị từ chối (Admin only).' });
    }
};

module.exports = { authenticateUser, authorizeAdmin, adminOnly };