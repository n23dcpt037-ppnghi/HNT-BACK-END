const athleteModel = require('../models/athleteModel');

// Hàm format date
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('vi-VN');
    } catch (e) {
        return dateString;
    }
}

// Hàm tạo dữ liệu lịch sử thi đấu mẫu
function getSampleCompetitionHistory(athleteId) {
    const histories = {
        1: [
            { time: "10/2025", competition: "Vô địch Quốc gia", event: "100m Tự do", result: "Hạng 1", achievement: "49.80s (Tốt nhất mùa giải)" },
            { time: "08/2025", competition: "Cúp CLB Toàn quốc", event: "4x100m Tiếp sức", result: "Hạng 3", achievement: "Tham gia Lượt 2" },
            { time: "05/2025", competition: "SEA Games 33", event: "50m Tự do", result: "Hạng 4", achievement: "22.55s" }
        ],
        2: [
            { time: "10/2025", competition: "Vô địch Quốc gia", event: "100m Ngửa", result: "Hạng 1", achievement: "1:00.25s (Kỷ lục QG)" },
            { time: "08/2025", competition: "Cúp CLB Toàn quốc", event: "200m Ngửa", result: "Hạng 2", achievement: "2:10.50s" },
            { time: "05/2025", competition: "SEA Games 33", event: "100m Ngửa", result: "Hạng 3", achievement: "1:01.00s" }
        ],
        3: [
            { time: "07/2024", competition: "Vô địch Đông Nam Á", event: "400m Bơi Sải", result: "Hạng 3", achievement: "3:55.20s" },
            { time: "05/2023", competition: "SEA Games 32", event: "400m Bơi Sải", result: "Hạng 1", achievement: "3:52.10s" },
            { time: "07/2021", competition: "Olympic Tokyo", event: "200m Bơi Sải", result: "Vòng loại", achievement: "1:48.50s" }
        ]
    };
    
    return histories[athleteId] || [];
}

// Hàm tạo giải thưởng mẫu
function getSampleAwards(athleteId) {
    const awards = {
        1: [
            { type: 'gold', name: 'Huy chương Vàng SEA Games 31', competition: 'SEA Games 2022', year: 2022 },
            { type: 'silver', name: 'Huy chương Bạc Vô địch Châu Á', competition: 'Asian Championships 2023', year: 2023 },
            { type: 'record', name: 'Kỷ lục Câu lạc bộ 50m Tự do', competition: 'Giải Vô địch Quốc gia', year: 2024 },
            { type: 'gold', name: 'Huy chương Vàng Cúp Quốc tế Hà Nội', competition: 'Hanoi International Cup', year: 2023 }
        ],
        2: [
            { type: 'gold', name: 'Huy chương Vàng Vô địch Quốc gia 100m Ngửa', competition: 'National Championship 2025', year: 2025 },
            { type: 'record', name: 'Kỷ lục Quốc gia 100m Ngửa', competition: 'Vô địch Quốc gia 2025', year: 2025 },
            { type: 'silver', name: 'Huy chương Bạc SEA Games 31 200m Ngửa', competition: 'SEA Games 2022', year: 2022 },
            { type: 'bronze', name: 'Huy chương Đồng SEA Games 33 100m Ngửa', competition: 'SEA Games 2025', year: 2025 }
        ],
        3: [
            { type: 'gold', name: 'Huy chương Vàng SEA Games 32 400m Bơi Sải', competition: 'SEA Games 2023', year: 2023 },
            { type: 'bronze', name: 'Huy chương Đồng Vô địch Đông Nam Á', competition: 'Southeast Asian Championship 2024', year: 2024 },
            { type: 'other', name: 'Tham dự Olympic Tokyo 2020', competition: 'Thế vận hội 2021', year: 2021 },
            { type: 'gold', name: 'Huy chương Vàng Giải Mở rộng Toàn quốc', competition: 'National Open Tournament', year: 2024 }
        ]
    };
    
    return awards[athleteId] || [
        { type: 'other', name: 'Đang cập nhật giải thưởng', competition: 'N/A', year: new Date().getFullYear() }
    ];
}

// [PUBLIC] Lấy danh sách tất cả tuyển thủ
const getAllAthletes = async (req, res) => {
    try {
        console.log("📥 Yêu cầu danh sách tuyển thủ");
        const athletes = await athleteModel.findAll();
        
        console.log(`✅ Tìm thấy ${athletes.length} tuyển thủ`);

        const formattedAthletes = athletes.map(athlete => ({
            athlete_id: athlete.athlete_id,
            full_name: athlete.full_name || 'Chưa có tên',
            nickname: athlete.nickname || '',
            position: athlete.position || '',
            specialty: athlete.specialty || '',
            age: athlete.age || null,
            achievements: athlete.achievements || 'Chưa có thông tin',
            image_url: athlete.image_url || '',
            detail_link: athlete.detail_link || `chitiet_tt${athlete.athlete_id}.html`,
            description: athlete.description || ''
        }));
        
        res.status(200).json(formattedAthletes);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách tuyển thủ:", error);
        res.status(500).json({ 
            message: "Lỗi server khi lấy danh sách tuyển thủ",
            error: error.message 
        });
    }
};

// [PUBLIC] Lấy chi tiết tuyển thủ theo ID
const getAthleteById = async (req, res) => {
    try {
        const id = req.params.id;
        
        console.log(`📥 Yêu cầu chi tiết tuyển thủ ID: ${id}`);
        
        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ 
                message: "ID tuyển thủ không hợp lệ" 
            });
        }
        
        const athlete = await athleteModel.findById(id);
        
        if (!athlete) {
            console.log(`❌ Không tìm thấy tuyển thủ ID: ${id}`);
            return res.status(404).json({ 
                message: "Không tìm thấy tuyển thủ" 
            });
        }

        console.log(`✅ Tìm thấy tuyển thủ: ${athlete.full_name}`);
        let awards = [];
        try {
            if (athleteModel.getAwardsByAthleteId) {
                awards = await athleteModel.getAwardsByAthleteId(id);
            }
        } catch (awardError) {
            console.log('⚠️ Không thể lấy giải thưởng từ DB:', awardError.message);
        }

        if (!awards || awards.length === 0) {
            awards = getSampleAwards(id);
        }

        awards = awards.map(award => ({
            type: award.award_type || award.type || 'other',
            name: award.award_name || award.name || 'Không có tên',
            competition: award.competition_name || award.competition || 'Không có thông tin',
            year: award.year || new Date().getFullYear()
        }));

        // Format dữ liệu
        const formattedAthlete = {
            athlete_id: athlete.athlete_id,
            full_name: athlete.full_name || 'Chưa có tên',
            nickname: athlete.nickname || '',
            position: athlete.position || '',
            specialty: athlete.specialty || '',
            age: athlete.age || null,
            date_of_birth: formatDate(athlete.date_of_birth) || '',
            hometown: athlete.hometown || '',
            height_cm: athlete.height_cm || null,
            weight_kg: athlete.weight_kg || null,
            achievements: athlete.achievements || 'Chưa có thông tin',
            image_url: athlete.image_url || '',
            description: athlete.description || '',
            awards: awards,
            competition_history: getSampleCompetitionHistory(id),
            contract_start: formatDate(athlete.contract_start) || '',
            contract_end: formatDate(athlete.contract_end) || ''
        };
        
        console.log(`📊 Gửi dữ liệu tuyển thủ với ${awards.length} giải thưởng`);
        
        res.status(200).json(formattedAthlete);
    } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết tuyển thủ:", error);
        res.status(500).json({ 
            message: "Lỗi server khi lấy chi tiết tuyển thủ",
            error: error.message 
        });
    }
};

// [ADMIN] Thêm tuyển thủ mới
const createAthlete = async (req, res) => {
    try {
        const data = req.body;

        // Validation
        if (!data.full_name) {
            return res.status(400).json({ 
                message: "Tên tuyển thủ là bắt buộc" 
            });
        }

        const newAthleteId = await athleteModel.createAthlete(data);
        
        res.status(201).json({ 
            message: "Thêm tuyển thủ thành công", 
            athlete_id: newAthleteId,
            data: {
                ...data,
                athlete_id: newAthleteId
            }
        });

    } catch (error) {
        console.error("❌ Lỗi khi tạo tuyển thủ:", error);
        res.status(500).json({ 
            message: "Lỗi server khi tạo tuyển thủ",
            error: error.message 
        });
    }
};

// [ADMIN] Cập nhật thông tin tuyển thủ
const updateAthlete = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ 
                message: "ID tuyển thủ không hợp lệ" 
            });
        }

        // Kiểm tra tuyển thủ tồn tại
        const existingAthlete = await athleteModel.findById(id);
        if (!existingAthlete) {
            return res.status(404).json({ 
                message: "Không tìm thấy tuyển thủ để cập nhật" 
            });
        }

        const affectedRows = await athleteModel.updateAthlete(id, data);
        
        res.status(200).json({ 
            message: "Cập nhật tuyển thủ thành công",
            affected_rows: affectedRows,
            athlete_id: id
        });

    } catch (error) {
        console.error("❌ Lỗi khi cập nhật tuyển thủ:", error);
        res.status(500).json({ 
            message: "Lỗi server khi cập nhật tuyển thủ",
            error: error.message 
        });
    }
};

// [ADMIN] Xóa tuyển thủ
const deleteAthlete = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ 
                message: "ID tuyển thủ không hợp lệ" 
            });
        }

        // Kiểm tra tuyển thủ tồn tại
        const existingAthlete = await athleteModel.findById(id);
        if (!existingAthlete) {
            return res.status(404).json({ 
                message: "Không tìm thấy tuyển thủ để xóa" 
            });
        }

        const affectedRows = await athleteModel.deleteAthlete(id);
        
        res.status(200).json({ 
            message: "Xóa tuyển thủ thành công",
            affected_rows: affectedRows,
            athlete_id: id
        });

    } catch (error) {
        console.error("❌ Lỗi khi xóa tuyển thủ:", error);
        res.status(500).json({ 
            message: "Lỗi server khi xóa tuyển thủ",
            error: error.message 
        });
    }
};

module.exports = {
    getAllAthletes,
    getAthleteById,
    createAthlete,
    updateAthlete,
    deleteAthlete
};