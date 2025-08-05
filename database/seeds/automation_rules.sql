-- Sample Automation Rules for ChatFlow Pro
-- These rules demonstrate common automation scenarios

-- 1. Welcome Message Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Welcome Message',
    'Send a welcome message to new contacts',
    'welcome',
    '{}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "👋 Welcome! Thank you for contacting us. How can we help you today?",
                "messageType": "text"
            }
        },
        {
            "type": "add_tag",
            "data": {
                "tag": "new_contact"
            }
        }
    ]',
    true,
    1,
    NOW(),
    NOW()
);

-- 2. Price Inquiry Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Price Inquiry Response',
    'Respond to price and cost inquiries',
    'keyword',
    '{"keywords": ["price", "cost", "how much", "pricing", "rates"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "💰 Our pricing starts at $99/month for basic plans. Would you like to see our full price list?",
                "messageType": "text"
            }
        },
        {
            "type": "add_tag",
            "data": {
                "tag": "price_inquiry"
            }
        }
    ]',
    true,
    2,
    NOW(),
    NOW()
);

-- 3. Business Hours Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Business Hours Response',
    'Inform about business hours when asked',
    'keyword',
    '{"keywords": ["hours", "open", "closed", "business hours", "working hours"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "🕒 Our business hours are Monday-Friday 9 AM to 6 PM. We\'ll get back to you during business hours!",
                "messageType": "text"
            }
        }
    ]',
    true,
    3,
    NOW(),
    NOW()
);

-- 4. Contact Information Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Contact Information',
    'Provide contact information when requested',
    'keyword',
    '{"keywords": ["contact", "phone", "email", "reach", "call"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "📞 You can reach us at:\n📧 Email: info@company.com\n📱 Phone: +1-555-123-4567\n🌐 Website: www.company.com",
                "messageType": "text"
            }
        }
    ]',
    true,
    4,
    NOW(),
    NOW()
);

-- 5. Follow-up Rule (Event-based)
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Follow-up Message',
    'Send follow-up message after 24 hours of no response',
    'event',
    '{"events": ["no_response_24h"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "Hi! We noticed you haven\'t responded. Is there anything we can help you with?",
                "messageType": "text"
            }
        }
    ]',
    true,
    5,
    NOW(),
    NOW()
);

-- 6. Product Inquiry Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Product Information',
    'Provide product information and catalog',
    'keyword',
    '{"keywords": ["product", "catalog", "services", "what do you offer"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "📋 Here\'s what we offer:\n\n✅ Product A - $99\n✅ Product B - $199\n✅ Product C - $299\n\nWould you like more details about any specific product?",
                "messageType": "text"
            }
        },
        {
            "type": "add_tag",
            "data": {
                "tag": "product_inquiry"
            }
        }
    ]',
    true,
    6,
    NOW(),
    NOW()
);

-- 7. Appointment Scheduling Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Appointment Scheduling',
    'Help with appointment scheduling',
    'keyword',
    '{"keywords": ["appointment", "schedule", "booking", "meeting", "consultation"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "📅 To schedule an appointment, please provide:\n\n1. Your preferred date\n2. Preferred time\n3. Type of consultation\n\nWe\'ll get back to you with available slots!",
                "messageType": "text"
            }
        },
        {
            "type": "add_tag",
            "data": {
                "tag": "appointment_request"
            }
        }
    ]',
    true,
    7,
    NOW(),
    NOW()
);

-- 8. Support Request Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Support Request',
    'Handle support and help requests',
    'keyword',
    '{"keywords": ["help", "support", "issue", "problem", "trouble"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "🆘 We\'re here to help! Please describe your issue and we\'ll assist you as soon as possible.",
                "messageType": "text"
            }
        },
        {
            "type": "add_tag",
            "data": {
                "tag": "support_request"
            }
        }
    ]',
    true,
    8,
    NOW(),
    NOW()
);

-- 9. Thank You Response Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Thank You Response',
    'Respond to thank you messages',
    'keyword',
    '{"keywords": ["thank", "thanks", "appreciate", "grateful"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "🙏 You\'re welcome! We\'re happy to help. Is there anything else you need?",
                "messageType": "text"
            }
        }
    ]',
    true,
    9,
    NOW(),
    NOW()
);

-- 10. Goodbye Response Rule
INSERT INTO automation_rules (
    id,
    user_id,
    name,
    description,
    trigger_type,
    trigger_conditions,
    actions,
    is_active,
    priority,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Goodbye Response',
    'Respond to goodbye messages',
    'keyword',
    '{"keywords": ["bye", "goodbye", "see you", "take care"]}',
    '[
        {
            "type": "send_message",
            "data": {
                "content": "👋 Take care! Feel free to reach out anytime. Have a great day!",
                "messageType": "text"
            }
        }
    ]',
    true,
    10,
    NOW(),
    NOW()
); 