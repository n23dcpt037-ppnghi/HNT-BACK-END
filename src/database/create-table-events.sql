USE swimming_club_shop;

CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,      
    description TEXT,                  
    event_date DATETIME NOT NULL,      
    location VARCHAR(255) NOT NULL,    
    image_url TEXT,                    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

