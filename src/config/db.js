const mysql = require('mysql2/promise'); // Sử dụng mysql2/promise để dùng async/await
require('dotenv').config(); // Tải các biến từ file .env

// Tạo một "Pool" (bể chứa) kết nối CSDL
// Pool giúp quản lý nhiều kết nối cùng lúc, tốt cho hiệu năng server
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection()
    .then(connection => {
        console.log('[MySQL] Đã kết nối CSDL thành công!');
        connection.release(); // Trả kết nối về lại cho pool
    })
    .catch(err => {
        console.error('[MySQL] Lỗi kết nối CSDL:', err.message);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Lỗi: Tên CSDL (DB_NAME) trong file .env không tồn tại.');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
             console.error('Lỗi: Sai DB_USER hoặc DB_PASSWORD trong file .env.');
        } else {
             console.error('Code lỗi:', err.code);
        }
    });

// Xuất (export) pool này ra để các file Model có thể sử dụng (db.query)
module.exports = pool;


