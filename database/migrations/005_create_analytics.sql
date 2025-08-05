-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric VARCHAR(50) NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_chatbot_id ON analytics(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON analytics(metric);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_chatbot_date ON analytics(chatbot_id, date);

-- Create unique constraint for user/chatbot/date/metric combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_unique ON analytics(user_id, chatbot_id, date, metric);

-- Create updated_at trigger
CREATE TRIGGER update_analytics_updated_at 
    BEFORE UPDATE ON analytics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create analytics views for common queries
CREATE OR REPLACE VIEW daily_message_stats AS
SELECT 
    user_id,
    chatbot_id,
    DATE(created_at) as date,
    COUNT(*) as total_messages,
    COUNT(CASE WHEN direction = 'incoming' THEN 1 END) as incoming_messages,
    COUNT(CASE WHEN direction = 'outgoing' THEN 1 END) as outgoing_messages,
    COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages
FROM messages 
WHERE deleted_at IS NULL
GROUP BY user_id, chatbot_id, DATE(created_at);

CREATE OR REPLACE VIEW daily_contact_stats AS
SELECT 
    user_id,
    chatbot_id,
    DATE(created_at) as date,
    COUNT(*) as new_contacts,
    COUNT(CASE WHEN last_message_at >= created_at THEN 1 END) as active_contacts
FROM contacts 
WHERE deleted_at IS NULL
GROUP BY user_id, chatbot_id, DATE(created_at); 