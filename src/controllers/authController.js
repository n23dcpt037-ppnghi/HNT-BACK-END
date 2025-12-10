const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const db = require('../config/db');

// HAM REGISTER (Giu nguyen)
const register = async (req, res) => {
    try {
        const { email, password, full_name, phone, address } = req.body;
        
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await userModel.createUser({ 
            email, 
            password: hashedPassword, 
            full_name, 
            phone, 
            address 
        });
        res.status(201).json({ message: 'Đăng ký thành công', userId });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: 'Lỗi Server nội bộ.' });
    }
};

// HAM LOGIN (Giu nguyen)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Sai email hoặc mật khẩu.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai email hoặc mật khẩu.' });
        }
        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({ token, userId: user.user_id, role: user.role });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: 'Lỗi Server nội bộ.' });
    }
};

// HAM MOI: GOOGLE LOGIN
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body; 
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await userModel.findByEmail(email);

        if (!user) {
            const randomPassword = await bcrypt.hash(email + Date.now(), 10);
            const userId = await userModel.createUser({
                email: email,
                password: randomPassword,
                full_name: name,
            });
            user = await userModel.findById(userId);
        }

        const appToken = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ 
            token: appToken, 
            userId: user.user_id, 
            role: user.role 
        });
    } catch (error) {
        console.error("Lỗi Google Login:", error);
        res.status(500).json({ message: "Xác thực Google thất bại." });
    }
};

const getProfile = async (req, res) => {
    try {
        // Lấy userId từ Middleware đã giải mã (dùng req.userId cho chắc chắn)
        const userId = req.userId || (req.user && req.user.userId);
        
        console.log('--- GET PROFILE ---');
        console.log('User ID requesting:', userId);
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Không xác định được người dùng (Token lỗi)' 
            });
        }
        
        // Truy vấn DB
        const [users] = await db.execute(
            'SELECT user_id, email, full_name, phone, address, gender, date_of_birth, role FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy người dùng trong cơ sở dữ liệu' 
            });
        }

        // Trả về kết quả (Bỏ password)
        const user = users[0];
        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Lỗi getProfile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server: ' + error.message 
        });
    }
};

// HÀM UPDATE PROFILE - SỬA THÀNH CONST
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { full_name, phone, address, gender, date_of_birth } = req.body;
        
        // Validation
        if (!full_name?.trim() || !phone?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Họ tên và số điện thoại là bắt buộc' 
            });
        }
        
        // XỬ LÝ DATE: Nếu empty string thì chuyển thành null
        const processedDateOfBirth = (date_of_birth === '' || !date_of_birth) 
            ? null 
            : date_of_birth;
        
        console.log('Processed date_of_birth:', processedDateOfBirth);
        
        const [result] = await db.query(
            `UPDATE users 
             SET full_name = ?, phone = ?, address = ?, 
                 gender = ?, date_of_birth = ?
             WHERE user_id = ?`,
            [full_name, phone, address, gender, processedDateOfBirth, userId]
        );
        
        if (result.affectedRows > 0) {
            res.json({ 
                success: true, 
                message: 'Cập nhật thành công' 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Cập nhật thất bại' 
            });
        }
        
    } catch (error) {
        console.error('Lỗi updateProfile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server' 
        });
    }
};

// DAM BAO EXPORT DAY DU
module.exports = { 
    register, 
    login,
    googleLogin,
    getProfile,      
    updateProfile 
};