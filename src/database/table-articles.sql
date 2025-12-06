USE swimming_club_shop;

CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,        -- Tiêu đề bài báo
    summary TEXT,                       -- Tóm tắt ngắn gọn
    content LONGTEXT NOT NULL,          -- Nội dung chi tiết (có thể chứa HTML)
    image_url TEXT,                     -- Ảnh bìa bài báo
    author VARCHAR(100),                -- Tên tác giả (hoặc link tới user_id)
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày đăng
    views INT DEFAULT 0                 -- Số lượt xem (tùy chọn)
);