-- Database Schema for ChatFlow Freemium Features
-- File: database/migrations/add_freemium_features.sql

-- Auto Replies Table
CREATE TABLE auto_replies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trigger_text VARCHAR(500) NOT NULL,
    response_text TEXT NOT NULL,
    is_exact_match BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_auto_replies_user_active (user_id, is_active),
    INDEX idx_auto_replies_trigger (trigger_text)
);

-- Working Hours Table
CREATE TABLE working_hours (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    working_start TIME NOT NULL DEFAULT '09:00:00',
    working_end TIME NOT NULL DEFAULT '18:00:00',
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_24_7 BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Off Hours Replies Table
CREATE TABLE off_hours_replies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products/Catalog Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(100),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_products_user_active (user_id, is_active),
    INDEX idx_products_category (category)
);

-- FAQs Table
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT, -- Comma-separated keywords
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_faqs_user_active (user_id, is_active),
    FULLTEXT INDEX idx_faqs_keywords (keywords)
);

-- Quick Buttons Table
CREATE TABLE quick_buttons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    button_text VARCHAR(100) NOT NULL,
    response_text TEXT NOT NULL,
    description VARCHAR(255),
    button_type VARCHAR(50) DEFAULT 'text', -- text, url, phone
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_quick_buttons_user_active (user_id, is_active)
);

-- Group Settings Table
CREATE TABLE group_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    enable_private_dm BOOLEAN DEFAULT true,
    dm_message TEXT,
    monitored_groups JSON, -- Array of group IDs to monitor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Triggers Table
CREATE TABLE group_triggers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    keywords TEXT NOT NULL, -- Comma-separated keywords that trigger DM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Phone Mapping Table (for multi-tenant support)
CREATE TABLE user_phone_mapping (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_phone (phone_number),
    INDEX idx_phone_user (phone_number, user_id)
);

-- User Settings Table (extending existing or creating new)
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bot_enabled BOOLEAN DEFAULT true,
    default_language VARCHAR(10) DEFAULT 'en',
    webhook_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interaction Logs Table (for analytics)
CREATE TABLE interaction_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    interaction_type VARCHAR(50) NOT NULL, -- auto_reply, faq_response, catalog_request, etc.
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_interaction_logs_user_date (user_id, created_at),
    INDEX idx_interaction_logs_type (interaction_type)
);

-- Unhandled Messages Table (for improving bot responses)
CREATE TABLE unhandled_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    message_body TEXT NOT NULL,
    is_reviewed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_unhandled_user_reviewed (user_id, is_reviewed),
    INDEX idx_unhandled_created (created_at)
);

-- Analytics Views for Dashboard
CREATE VIEW user_analytics AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT il.phone_number) as unique_contacts,
    COUNT(il.id) as total_interactions,
    COUNT(CASE WHEN il.interaction_type = 'auto_reply' THEN 1 END) as auto_replies_sent,
    COUNT(CASE WHEN il.interaction_type = 'faq_response' THEN 1 END) as faq_responses_sent,
    COUNT(CASE WHEN il.interaction_type = 'catalog_request' THEN 1 END) as catalog_requests,
    COUNT(um.id) as unhandled_messages,
    DATE(il.created_at) as date
FROM users u
LEFT JOIN interaction_logs il ON u.id = il.user_id
LEFT JOIN unhandled_messages um ON u.id = um.user_id AND um.is_reviewed = false
WHERE il.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY u.id, u.email, DATE(il.created_at);

-- Indexes for performance
CREATE INDEX idx_interaction_logs_user_type_date ON interaction_logs(user_id, interaction_type, created_at);
CREATE INDEX idx_products_user_category_active ON products(user_id, category, is_active);
CREATE INDEX idx_auto_replies_user_priority ON auto_replies(user_id, priority, is_active);

-- Sample Data Inserts (for testing)
INSERT INTO auto_replies (user_id, trigger_text, response_text, priority) VALUES
(1, 'price of product a', 'Product A costs Rs. 500 and is available in black and red colors.', 1),
(1, 'hello', 'Hello! Welcome to our store. How can I help you today?', 2),
(1, 'thanks', 'You\'re welcome! Is there anything else I can help you with?', 3);

INSERT INTO faqs (user_id, question, answer, keywords) VALUES
(1, 'What are your opening hours?', 'We are open Monday to Saturday from 9 AM to 6 PM. Closed on Sundays.', 'hours,timing,open,close,time'),
(1, 'Do you provide delivery?', 'Yes, we provide free delivery within the city for orders above Rs. 1000.', 'delivery,shipping,courier'),
(1, 'What payment methods do you accept?', 'We accept cash, bank transfer, JazzCash, EasyPaisa, and credit cards.', 'payment,pay,method,cash,card');

INSERT INTO quick_buttons (user_id, button_text, response_text, description) VALUES
(1, 'Show latest stock', 'Here are our latest products in stock:\n\n📱 iPhone 15 - Rs. 280,000\n💻 MacBook Air - Rs. 350,000\n⌚ Apple Watch - Rs. 85,000\n\nFor more details, type "catalog"', 'View current inventory'),
(1, 'Discounts', '🎉 Current Offers:\n\n• 10% off on orders above Rs. 5,000\n• Buy 2 Get 1 Free on accessories\n• Special discount for bulk orders\n\nOffer valid till month end!', 'Check current promotions'),
(1, 'Opening Hours', 'We are open:\n📅 Monday - Saturday: 9:00 AM - 6:00 PM\n📅 Sunday: Closed\n\n📍 Location: Main Market, Karachi', 'Business hours and location');

INSERT INTO products (user_id, name, description, price, category) VALUES
(1, 'iPhone 15', 'Latest iPhone with advanced features', 280000.00, 'Smartphones'),
(1, 'Samsung Galaxy S24', 'Premium Android smartphone', 250000.00, 'Smartphones'),
(1, 'MacBook Air M3', 'Lightweight laptop for professionals', 350000.00, 'Laptops'),
(1, 'AirPods Pro', 'Wireless earbuds with noise cancellation', 65000.00, 'Accessories');

INSERT INTO user_settings (user_id, bot_enabled) VALUES (1, true);
INSERT INTO working_hours (user_id, working_start, working_end, timezone) VALUES 
(1, '09:00:00', '18:00:00', 'Asia/Karachi');