USE swimming_club_shop;

CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,    
    summary TEXT,                     
    content LONGTEXT NOT NULL,        
    image_url TEXT,                    
    author VARCHAR(100),               
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    views INT DEFAULT 0                 
);