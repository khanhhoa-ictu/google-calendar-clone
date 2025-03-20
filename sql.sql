CREATE TABLE recurring_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    frequency ENUM('none', 'daily', 'weekly', 'monthly') NOT NULL,
    count INT DEFAULT NULL,
    until DATETIME DEFAULT NULL 
);

CREATE TABLE event (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    start_time DATETIME,
    end_time DATETIME,
    recurring_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced TINYINT(1) DEFAULT 0,
    google_event_id VARCHAR(255) DEFAULT NULL,
    google_email VARCHAR(255) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
