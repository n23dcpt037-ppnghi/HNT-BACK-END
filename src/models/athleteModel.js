const db = require('../config/db');

// READ: Lấy tất cả Tuyển thủ
const findAll = async () => {
    try {
        const [rows] = await db.query('SELECT athlete_id, full_name, nickname, position, specialty, age, achievements, image_url, detail_link FROM athletes');
        return rows;
    } catch (error) {
        throw error;
    }
};

// READ: Lấy chi tiết Tuyển thủ theo ID
const findById = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                a.*,
                GROUP_CONCAT(DISTINCT CONCAT(aa.award_type, '|', aa.award_name, '|', aa.competition_name, '|', aa.year) SEPARATOR ';;') as awards
            FROM athletes a
            LEFT JOIN athlete_awards aa ON a.athlete_id = aa.athlete_id
            WHERE a.athlete_id = ?
            GROUP BY a.athlete_id`, 
            [id]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Thêm hàm lấy lịch sử thi đấu
const getCompetitionHistory = async (athleteId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM athlete_competitions 
             WHERE athlete_id = ? 
             ORDER BY competition_date DESC`,
            [athleteId]
        );
        return rows;
    } catch (error) {
        // Nếu bảng chưa tồn tại, trả về mảng rỗng
        console.warn('Bảng competition_history chưa tồn tại');
        return [];
    }
};

// CREATE: Thêm Tuyển thủ mới (Admin)
const createAthlete = async (data) => {
    try {
        const [result] = await db.query(
            `INSERT INTO athletes 
            (full_name, nickname, position, specialty, age, achievements, image_url, detail_link) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.full_name, 
                data.nickname, 
                data.position, 
                data.specialty, 
                data.age, 
                data.achievements, 
                data.image_url, 
                data.detail_link
            ]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// UPDATE: Cập nhật Tuyển thủ (Admin)
const updateAthlete = async (id, data) => {
    try {
        // 1. Lấy thông tin cũ trước
        const [rows] = await db.query('SELECT * FROM athletes WHERE athlete_id = ?', [id]);
        if (rows.length === 0) return 0;
        const oldData = rows[0];

        // 2. Gộp dữ liệu mới và cũ (Nếu data mới không có thì dùng cái cũ)
        const full_name = data.full_name || oldData.full_name;
        const nickname = data.nickname || oldData.nickname;
        const position = data.position || oldData.position;
        const specialty = data.specialty || oldData.specialty;
        const age = data.age || oldData.age;
        const achievements = data.achievements || oldData.achievements;
        const image_url = data.image_url || oldData.image_url;
        const detail_link = data.detail_link || oldData.detail_link;

        // 3. Thực hiện Update
        const [result] = await db.query(
            `UPDATE athletes 
            SET full_name = ?, nickname = ?, position = ?, specialty = ?, age = ?, 
                achievements = ?, image_url = ?, detail_link = ? 
            WHERE athlete_id = ?`,
            [full_name, nickname, position, specialty, age, achievements, image_url, detail_link, id]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

// DELETE: Xóa Tuyển thủ (Admin)
const deleteAthlete = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM athletes WHERE athlete_id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

const getAwardsByAthleteId = async (athleteId) => {
    try {
        const [rows] = await db.query(
            'SELECT award_type, award_name, competition_name, year FROM athlete_awards WHERE athlete_id = ? ORDER BY year DESC',
            [athleteId]
        );
        return rows;
    } catch (error) {
        console.warn('Không thể lấy giải thưởng:', error.message);
        return [];
    }
};

module.exports = {
    findAll,
    findById,
    createAthlete,
    updateAthlete,
    deleteAthlete,
    getAwardsByAthleteId 
};
