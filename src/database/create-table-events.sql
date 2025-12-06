USE swimming_club_shop;

-- Tạo bảng Sự kiện (Events)
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,       -- Tên giải đấu/Sự kiện
    description TEXT,                  -- Mô tả chi tiết
    event_date DATETIME NOT NULL,      -- Ngày giờ diễn ra
    location VARCHAR(255) NOT NULL,    -- Địa điểm tổ chức
    image_url TEXT,                    -- Ảnh poster
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

