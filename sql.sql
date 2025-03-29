CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token_forgot VARCHAR(255) DEFAULT NULL,
    role ENUM(1, 2) DEFAULT 2,
    refresh_token_google TEXT,
    access_token_google TEXT,
    google_email varchar(255) DEFAULT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE recurring_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    frequency ENUM('none', 'daily', 'weekly', 'monthly') NOT NULL,
    count INT DEFAULT NULL,
    until DATETIME DEFAULT NULL 
);

DROP TABLE event;
CREATE TABLE event (
    user_id INT,
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
    instance_id varchar(255) DEFAULT NULL,
    last_resource_id varchar(255) DEFAULT NULL,
    UNIQUE KEY unique_last_resource_id (last_resource_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE event_attendees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    response_status ENUM('needsAction', 'declined', 'tentative', 'accepted') DEFAULT 'needsAction',
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);