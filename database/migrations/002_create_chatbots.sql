-- Create chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    flow JSONB NOT NULL DEFAULT '{"nodes": [], "edges": []}',
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    whatsapp_number VARCHAR(20),
    whatsapp_session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbots_is_active ON chatbots(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbots_whatsapp_number ON chatbots(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_chatbots_created_at ON chatbots(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_chatbots_updated_at 
    BEFORE UPDATE ON chatbots 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 