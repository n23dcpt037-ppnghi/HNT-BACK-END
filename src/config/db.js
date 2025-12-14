const mysql = require('mysql2/promise'); 
require('dotenv').config(); 
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('[MySQL] Đã kết nối CSDL thành công!');
        connection.release(); 
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

module.exports = pool;


