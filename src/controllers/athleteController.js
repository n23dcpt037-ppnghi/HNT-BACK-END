const athleteModel = require('../models/athleteModel');

// [PUBLIC] READ: Lấy danh sách tất cả tuyển thủ
const getAllAthletes = async (req, res) => {
    try {
        const athletes = await athleteModel.findAll();
        res.status(200).json(athletes);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tuyển thủ:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ khi lấy danh sách tuyển thủ." });
    }
};

// [PUBLIC] READ: Lấy chi tiết tuyển thủ
const getAthleteById = async (req, res) => {
    try {
        const id = req.params.id;
        const athlete = await athleteModel.findById(id);
        
        if (!athlete) {
            return res.status(404).json({ message: "Không tìm thấy tuyển thủ." });
        }

        res.status(200).json(athlete);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết tuyển thủ:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ khi lấy chi tiết tuyển thủ." });
    }
};

// ------------------------------------------------------------------
// [ADMIN ONLY] CREATE: Thêm tuyển thủ mới
const createAthlete = async (req, res) => {
    try {
        const data = req.body; 

        if (!data.full_name) {
            return res.status(400).json({ message: "Thiếu tên đầy đủ của tuyển thủ." });
        }

        const newAthleteId = await athleteModel.createAthlete(data);
        res.status(201).json({ message: "Thêm tuyển thủ thành công.", athlete_id: newAthleteId });

    } catch (error) {
        console.error("Lỗi khi tạo tuyển thủ:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// [ADMIN ONLY] UPDATE: Cập nhật thông tin tuyển thủ
const updateAthlete = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        
        const affectedRows = await athleteModel.updateAthlete(id, data);
        
        if (affectedRows === 0) {
            // Kiểm tra nếu ID không tồn tại hoặc không có dữ liệu để cập nhật
            const existingAthlete = await athleteModel.findById(id);
            if (!existingAthlete) {
                 return res.status(404).json({ message: "Không tìm thấy tuyển thủ để cập nhật." });
            }
            return res.status(200).json({ message: "Không có thay đổi nào được áp dụng." });
        }

        res.status(200).json({ message: "Cập nhật tuyển thủ thành công." });

    } catch (error) {
        console.error("Lỗi khi cập nhật tuyển thủ:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

// [ADMIN ONLY] DELETE: Xóa tuyển thủ
const deleteAthlete = async (req, res) => {
    try {
        const id = req.params.id;
        
        const affectedRows = await athleteModel.deleteAthlete(id);
        
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy tuyển thủ để xóa." });
        }

        res.status(200).json({ message: "Xóa tuyển thủ thành công." });

    } catch (error) {
        console.error("Lỗi khi xóa tuyển thủ:", error);
        res.status(500).json({ message: "Lỗi Server nội bộ." });
    }
};

module.exports = {
    getAllAthletes,
    getAthleteById,
    createAthlete,
    updateAthlete,
    deleteAthlete
};