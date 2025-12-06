const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
            { expiresIn: '1h' }
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

// DAM BAO EXPORT DAY DU
module.exports = { 
    register, 
    login,
    googleLogin
};