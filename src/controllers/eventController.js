const eventModel = require('../models/eventModel');


// [PUBLIC] Lấy tất cả sự kiện
const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.findAll();
        
        // Format dữ liệu trả về - QUAN TRỌNG: đảm bảo event_date là string YYYY-MM-DD
        const formattedEvents = events.map(event => {
            // Đảm bảo event_date là string đúng format
            let formattedDate = event.event_date;
            
            // Nếu event_date là Date object, chuyển thành string YYYY-MM-DD
            if (event.event_date instanceof Date) {
                formattedDate = formatDateToYYYYMMDD(event.event_date);
            }
            // Nếu là string có chứa T (ISO string), lấy phần YYYY-MM-DD
            else if (typeof event.event_date === 'string' && event.event_date.includes('T')) {
                formattedDate = event.event_date.split('T')[0];
            }
            // Nếu là timestamp (số), chuyển thành YYYY-MM-DD
            else if (typeof event.event_date === 'number' || /^\d+$/.test(event.event_date)) {
                const dateObj = new Date(parseInt(event.event_date));
                formattedDate = formatDateToYYYYMMDD(dateObj);
            }
            
            return {
                event_id: event.event_id,
                title: event.title,
                description: event.description,
                event_date: formattedDate, // QUAN TRỌNG: string YYYY-MM-DD
                event_time: event.event_time || '00:00:00',
                location: event.location,
                image_url: event.image_url,
                created_at: event.created_at,
                updated_at: event.updated_at
            };
        });
        
        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sự kiện:", error);
        res.status(500).json({ 
            message: "Lỗi server khi lấy danh sách sự kiện",
            error: error.message 
        });
    }
};

// [PUBLIC] Lấy sự kiện sắp diễn ra
const getUpcomingEvents = async (req, res) => {
    try {
        const events = await eventModel.findUpcoming();
        
        const formattedEvents = events.map(event => ({
            ...event,
            event_date: ensureDateFormat(event.event_date),
            display_time: formatEventTimeForDisplay(event.event_date, event.event_time)
        }));
        
        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sự kiện sắp diễn ra:", error);
        res.status(500).json({ 
            message: "Lỗi server khi lấy sự kiện sắp diễn ra",
            error: error.message 
        });
    }
};

// [PUBLIC] Lấy sự kiện đã diễn ra
const getPastEvents = async (req, res) => {
    try {
        const events = await eventModel.findPast();
        
        const formattedEvents = events.map(event => ({
            ...event,
            event_date: ensureDateFormat(event.event_date),
            display_time: formatEventTimeForDisplay(event.event_date, event.event_time)
        }));
        
        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sự kiện đã diễn ra:", error);
        res.status(500).json({ 
            message: "Lỗi server khi lấy sự kiện đã diễn ra",
            error: error.message 
        });
    }
};

// [PUBLIC] Xem chi tiết sự kiện
const getEventById = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ 
                message: "ID sự kiện không hợp lệ" 
            });
        }
        
        const event = await eventModel.findById(id);
        
        if (!event) {
            return res.status(404).json({ 
                message: "Sự kiện không tồn tại" 
            });
        }
        
        // Đảm bảo event_date là string YYYY-MM-DD
        event.event_date = ensureDateFormat(event.event_date);

        event.display_date = formatDateForDisplay(event.event_date);
        event.display_time = formatTimeForDisplay(event.event_time);
        
        res.status(200).json(event);
    } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết sự kiện:", error);
        res.status(500).json({ 
            message: "Lỗi server khi lấy chi tiết sự kiện",
            error: error.message 
        });
    }
};

// [ADMIN] Tạo sự kiện mới
const createEvent = async (req, res) => {
    try {
        const { title, event_date, location, description, event_time } = req.body;
        
        if (!title || !event_date || !location) {
            return res.status(400).json({ 
                message: "Vui lòng cung cấp tiêu đề, ngày và địa điểm" 
            });
        }

        let image_url = null;
        if (req.file) {
    image_url = `http://localhost:3000/uploads/events/${req.file.filename}`;
}

        const eventData = {
            title,
            description: description || '',
            event_date: ensureDateFormat(event_date),
            event_time: event_time || '00:00:00',
            location,
            image_url
        };
        
        const newEventId = await eventModel.createEvent(eventData);
        
        res.status(201).json({ 
            message: "Tạo sự kiện thành công!", 
            event_id: newEventId,
            data: {
                ...eventData,
                event_id: newEventId
            }
        });
    } catch (error) {
        console.error("❌ Lỗi khi tạo sự kiện:", error);
        res.status(500).json({ 
            message: "Lỗi server khi tạo sự kiện",
            error: error.message 
        });
    }
};

// [ADMIN] Cập nhật sự kiện
const updateEvent = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ 
                message: "ID sự kiện không hợp lệ" 
            });
        }
        
        const existingEvent = await eventModel.findById(id);
        if (!existingEvent) {
            return res.status(404).json({ 
                message: "Không tìm thấy sự kiện để cập nhật" 
            });
        }

        const updateData = { ...req.body };
 
        if (req.file) {
            updateData.image_url = `http://localhost:3000/uploads/events/${req.file.filename}`;
        }

        if (updateData.event_date) {
            updateData.event_date = ensureDateFormat(updateData.event_date);
        }
        
        const affectedRows = await eventModel.updateEvent(id, updateData);
        
        res.status(200).json({ 
            message: "Cập nhật sự kiện thành công!",
            affected_rows: affectedRows,
            event_id: id
        });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật sự kiện:", error);
        res.status(500).json({ 
            message: "Lỗi server khi cập nhật sự kiện",
            error: error.message 
        });
    }
};

// [ADMIN] Xóa sự kiện
const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ 
                message: "ID sự kiện không hợp lệ" 
            });
        }
        
        const existingEvent = await eventModel.findById(id);
        if (!existingEvent) {
            return res.status(404).json({ 
                message: "Không tìm thấy sự kiện để xóa" 
            });
        }
        
        const affectedRows = await eventModel.deleteEvent(id);
        
        res.status(200).json({ 
            message: "Xóa sự kiện thành công!",
            affected_rows: affectedRows,
            event_id: id
        });
    } catch (error) {
        console.error("❌ Lỗi khi xóa sự kiện:", error);
        res.status(500).json({ 
            message: "Lỗi server khi xóa sự kiện",
            error: error.message 
        });
    }
};

// --- HÀM HỖ TRỢ ---

function ensureDateFormat(dateInput) {
    if (!dateInput) return null;
    
    try {
        // Nếu đã là string YYYY-MM-DD
        if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
            return dateInput;
        }
        
        // Nếu là Date object
        if (dateInput instanceof Date) {
            return formatDateToYYYYMMDD(dateInput);
        }
        
        // Nếu là string có chứa T (ISO)
        if (typeof dateInput === 'string' && dateInput.includes('T')) {
            return dateInput.split('T')[0];
        }
        
        // Nếu là timestamp (số)
        if (typeof dateInput === 'number' || /^\d+$/.test(dateInput)) {
            const dateObj = new Date(parseInt(dateInput));
            return formatDateToYYYYMMDD(dateObj);
        }
        
        // Nếu là string DD/MM/YYYY
        if (typeof dateInput === 'string' && dateInput.includes('/')) {
            const [day, month, year] = dateInput.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        // Fallback: trả về như cũ
        return dateInput;
        
    } catch (error) {
        console.error('Error ensuring date format:', dateInput, error);
        return dateInput;
    }
}

// Chuyển Date object thành YYYY-MM-DD
function formatDateToYYYYMMDD(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format ngày hiển thị: DD/MM/YYYY
function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    
    try {
        // Nếu là YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        }
        
        return dateStr;
    } catch (error) {
        return dateStr;
    }
}

// Format giờ hiển thị: HH:MM
function formatTimeForDisplay(timeStr) {
    if (!timeStr || timeStr === '00:00:00') return '';
    
    try {
        // Lấy giờ:phút
        const [hours, minutes] = timeStr.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
    } catch (error) {
        return timeStr;
    }
}

// Format thời gian đầy đủ cho hiển thị
function formatEventTimeForDisplay(eventDate, eventTime = '00:00:00') {
    const dateStr = formatDateForDisplay(eventDate);
    const timeStr = formatTimeForDisplay(eventTime);
    
    if (timeStr) {
        return `${dateStr} - ${timeStr}`;
    }
    return dateStr;
}

module.exports = {
    getAllEvents,
    getUpcomingEvents,
    getPastEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};