// ChatFlow WhatsApp Service - Core Freemium Features Implementation
// File: whatsapp-service/src/features/freemiumFeatures.js

const { Client, LocalAuth, MessageMedia, Buttons, List } = require('whatsapp-web.js');
const cron = require('node-cron');
const Redis = require('redis');

class FreemiumFeatures {
    constructor(whatsappClient, database, redisClient) {
        this.client = whatsappClient;
        this.db = database;
        this.redis = redisClient;
        this.botStatus = new Map(); // userId -> boolean (enabled/disabled)
        this.workingHours = new Map(); // userId -> {start, end, timezone}
        this.setupMessageHandler();
    }

    setupMessageHandler() {
        this.client.on('message', async (msg) => {
            try {
                const contact = await msg.getContact();
                const chat = await msg.getChat();
                
                // Get user/organization ID from phone number
                const userId = await this.getUserIdFromPhone(contact.number);
                if (!userId) return;

                // Check if bot is enabled for this user
                if (!this.isBotEnabled(userId)) return;
                
                // Don't respond to own messages
                if (msg.fromMe) return;

                await this.processMessage(msg, userId, contact, chat);
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });
    }

    // FEATURE 1: Message-Based Auto Replies
    async processMessage(msg, userId, contact, chat) {
        const messageBody = msg.body.toLowerCase().trim();
        
        // Priority handling order
        if (chat.isGroup) {
            await this.handleGroupMessage(msg, userId, contact, messageBody);
            return;
        }

        // Check working hours first
        if (!await this.isWithinWorkingHours(userId)) {
            await this.handleOffHoursMessage(msg, userId, messageBody);
            return;
        }

        // Process features in priority order
        if (await this.processAutoReply(msg, userId, messageBody)) return;
        if (await this.processFAQs(msg, userId, messageBody)) return;
        if (await this.processQuickButtons(msg, userId, messageBody)) return;
        if (await this.processCatalogRequest(msg, userId, messageBody)) return;
        
        // Log unhandled message for analytics
        await this.logUnhandledMessage(userId, messageBody);
    }

    async processAutoReply(msg, userId, messageBody) {
        try {
            const autoReplies = await this.db.query(`
                SELECT trigger_text, response_text, is_exact_match 
                FROM auto_replies 
                WHERE user_id = $1 AND is_active = true
                ORDER BY priority ASC
            `, [userId]);

            for (const reply of autoReplies.rows) {
                const trigger = reply.trigger_text.toLowerCase();
                const isMatch = reply.is_exact_match 
                    ? messageBody === trigger
                    : messageBody.includes(trigger);

                if (isMatch) {
                    await msg.reply(reply.response_text);
                    await this.logInteraction(userId, 'auto_reply', trigger);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error processing auto reply:', error);
            return false;
        }
    }

    // FEATURE 2: Working Hours Mode
    async isWithinWorkingHours(userId) {
        try {
            const settings = await this.db.query(`
                SELECT working_start, working_end, timezone, is_24_7 
                FROM working_hours 
                WHERE user_id = $1
            `, [userId]);

            if (!settings.rows.length || settings.rows[0].is_24_7) {
                return true;
            }

            const { working_start, working_end, timezone } = settings.rows[0];
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-US', {
                hour12: false,
                timeZone: timezone || 'UTC',
                hour: '2-digit',
                minute: '2-digit'
            });

            return currentTime >= working_start && currentTime <= working_end;
        } catch (error) {
            console.error('Error checking working hours:', error);
            return true; // Default to always on if error
        }
    }

    async handleOffHoursMessage(msg, userId, messageBody) {
        try {
            // Check if there's a specific off-hours auto reply
            const offHoursReply = await this.db.query(`
                SELECT response_text FROM off_hours_replies 
                WHERE user_id = $1 AND is_active = true
            `, [userId]);

            let responseText = "Thank you for your message! 🌙\n\nWe're currently offline but will get back to you during our working hours.\n\nFor urgent matters, please call us directly.";
            
            if (offHoursReply.rows.length > 0) {
                responseText = offHoursReply.rows[0].response_text;
            }

            await msg.reply(responseText);
            await this.logInteraction(userId, 'off_hours_reply', messageBody);
        } catch (error) {
            console.error('Error handling off-hours message:', error);
        }
    }

    // One-click bot pause functionality
    async toggleBotStatus(userId, enabled) {
        this.botStatus.set(userId, enabled);
        await this.redis.set(`bot_status:${userId}`, enabled ? '1' : '0');
        
        // Update database
        await this.db.query(`
            UPDATE user_settings 
            SET bot_enabled = $1 
            WHERE user_id = $2
        `, [enabled, userId]);
    }

    isBotEnabled(userId) {
        return this.botStatus.get(userId) !== false; // Default to enabled
    }

    // FEATURE 3: Product Catalogue via WhatsApp
    async processCatalogRequest(msg, userId, messageBody) {
        const catalogTriggers = ['catalog', 'catalogue', 'products', 'menu', 'list', 'items'];
        
        if (!catalogTriggers.some(trigger => messageBody.includes(trigger))) {
            return false;
        }

        try {
            const catalog = await this.db.query(`
                SELECT name, description, price, image_url, category 
                FROM products 
                WHERE user_id = $1 AND is_active = true 
                ORDER BY category, name
            `, [userId]);

            if (catalog.rows.length === 0) {
                await msg.reply("Sorry, our catalog is currently being updated. Please check back later!");
                return true;
            }

            // Group products by category
            const categorizedProducts = {};
            catalog.rows.forEach(product => {
                if (!categorizedProducts[product.category]) {
                    categorizedProducts[product.category] = [];
                }
                categorizedProducts[product.category].push(product);
            });

            // Create catalog message
            let catalogMessage = "🛍️ *Our Product Catalog*\n\n";
            
            for (const [category, products] of Object.entries(categorizedProducts)) {
                catalogMessage += `*${category.toUpperCase()}*\n`;
                catalogMessage += "━━━━━━━━━━━━━━━━━━━━\n";
                
                products.forEach((product, index) => {
                    catalogMessage += `${index + 1}. *${product.name}*\n`;
                    if (product.description) {
                        catalogMessage += `   ${product.description}\n`;
                    }
                    catalogMessage += `   💰 Rs. ${product.price}\n\n`;
                });
            }

            catalogMessage += "To order or get more info, reply with the product name or number!";

            // Send with image if available
            const firstProductWithImage = catalog.rows.find(p => p.image_url);
            if (firstProductWithImage && firstProductWithImage.image_url) {
                const media = await MessageMedia.fromUrl(firstProductWithImage.image_url);
                await msg.reply(media, { caption: catalogMessage });
            } else {
                await msg.reply(catalogMessage);
            }

            await this.logInteraction(userId, 'catalog_request', messageBody);
            return true;
        } catch (error) {
            console.error('Error processing catalog request:', error);
            await msg.reply("Sorry, there was an error loading our catalog. Please try again later.");
            return true;
        }
    }

    // FEATURE 4: Instant FAQs
    async processFAQs(msg, userId, messageBody) {
        try {
            const faqs = await this.db.query(`
                SELECT question, answer, keywords 
                FROM faqs 
                WHERE user_id = $1 AND is_active = true
            `, [userId]);

            for (const faq of faqs.rows) {
                const keywords = faq.keywords.split(',').map(k => k.trim().toLowerCase());
                const questionWords = faq.question.toLowerCase().split(' ');
                
                // Check if message contains FAQ keywords or question words
                const hasKeyword = keywords.some(keyword => messageBody.includes(keyword));
                const hasQuestionWord = questionWords.some(word => messageBody.includes(word));
                
                if (hasKeyword || hasQuestionWord) {
                    const response = `❓ *${faq.question}*\n\n${faq.answer}`;
                    await msg.reply(response);
                    await this.logInteraction(userId, 'faq_response', faq.question);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error processing FAQs:', error);
            return false;
        }
    }

    // FEATURE 5: Quick Text Buttons
    async processQuickButtons(msg, userId, messageBody) {
        try {
            const buttons = await this.db.query(`
                SELECT button_text, response_text, button_type 
                FROM quick_buttons 
                WHERE user_id = $1 AND is_active = true
            `, [userId]);

            for (const button of buttons.rows) {
                if (messageBody.includes(button.button_text.toLowerCase())) {
                    await msg.reply(button.response_text);
                    await this.logInteraction(userId, 'quick_button', button.button_text);
                    return true;
                }
            }

            // Show available quick buttons if user asks
            if (messageBody.includes('options') || messageBody.includes('help') || messageBody.includes('menu')) {
                await this.showQuickButtons(msg, userId);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error processing quick buttons:', error);
            return false;
        }
    }

    async showQuickButtons(msg, userId) {
        try {
            const buttons = await this.db.query(`
                SELECT button_text, description 
                FROM quick_buttons 
                WHERE user_id = $1 AND is_active = true 
                ORDER BY priority ASC
            `, [userId]);

            if (buttons.rows.length === 0) return;

            let buttonMessage = "🔘 *Quick Options Available:*\n\n";
            buttons.rows.forEach((button, index) => {
                buttonMessage += `${index + 1}. *${button.button_text}*\n`;
                if (button.description) {
                    buttonMessage += `   ${button.description}\n`;
                }
                buttonMessage += "\n";
            });

            buttonMessage += "Just type any of these options to get quick responses!";
            await msg.reply(buttonMessage);
        } catch (error) {
            console.error('Error showing quick buttons:', error);
        }
    }

    // FEATURE 6: Personalized Responses for Group Users
    async handleGroupMessage(msg, userId, contact, messageBody) {
        try {
            const groupSettings = await this.db.query(`
                SELECT enable_private_dm, dm_message, monitored_groups 
                FROM group_settings 
                WHERE user_id = $1
            `, [userId]);

            if (!groupSettings.rows.length || !groupSettings.rows[0].enable_private_dm) {
                return;
            }

            const chat = await msg.getChat();
            const monitoredGroups = groupSettings.rows[0].monitored_groups || [];
            
            // Check if this group is monitored
            if (monitoredGroups.length > 0 && !monitoredGroups.includes(chat.id._serialized)) {
                return;
            }

            // Check if message contains business-related keywords
            const businessKeywords = await this.db.query(`
                SELECT keywords FROM group_triggers WHERE user_id = $1
            `, [userId]);

            if (businessKeywords.rows.length > 0) {
                const keywords = businessKeywords.rows[0].keywords.split(',').map(k => k.trim().toLowerCase());
                const hasBusinessKeyword = keywords.some(keyword => messageBody.includes(keyword));
                
                if (hasBusinessKeyword) {
                    // Send private DM
                    const dmMessage = groupSettings.rows[0].dm_message || 
                        `Hi ${contact.pushname || contact.name || 'there'}! 👋\n\nI saw your message in the group. I'd be happy to help you privately!\n\nWhat can I assist you with?`;
                    
                    await this.client.sendMessage(contact.id._serialized, dmMessage);
                    await this.logInteraction(userId, 'group_dm_sent', chat.name);
                }
            }
        } catch (error) {
            console.error('Error handling group message:', error);
        }
    }

    // Utility Methods
    async getUserIdFromPhone(phoneNumber) {
        try {
            const result = await this.db.query(`
                SELECT user_id FROM user_phone_mapping 
                WHERE phone_number = $1
            `, [phoneNumber]);
            
            return result.rows.length > 0 ? result.rows[0].user_id : null;
        } catch (error) {
            console.error('Error getting user ID from phone:', error);
            return null;
        }
    }

    async logInteraction(userId, interactionType, details) {
        try {
            await this.db.query(`
                INSERT INTO interaction_logs (user_id, interaction_type, details, created_at)
                VALUES ($1, $2, $3, NOW())
            `, [userId, interactionType, details]);
        } catch (error) {
            console.error('Error logging interaction:', error);
        }
    }

    async logUnhandledMessage(userId, messageBody) {
        try {
            await this.db.query(`
                INSERT INTO unhandled_messages (user_id, message_body, created_at)
                VALUES ($1, $2, NOW())
            `, [userId, messageBody]);
        } catch (error) {
            console.error('Error logging unhandled message:', error);
        }
    }

    // Admin Methods for Managing Features
    async createAutoReply(userId, triggerText, responseText, isExactMatch = false, priority = 1) {
        return await this.db.query(`
            INSERT INTO auto_replies (user_id, trigger_text, response_text, is_exact_match, priority, is_active)
            VALUES ($1, $2, $3, $4, $5, true)
            RETURNING id
        `, [userId, triggerText, responseText, isExactMatch, priority]);
    }

    async createFAQ(userId, question, answer, keywords) {
        return await this.db.query(`
            INSERT INTO faqs (user_id, question, answer, keywords, is_active)
            VALUES ($1, $2, $3, $4, true)
            RETURNING id
        `, [userId, question, answer, keywords]);
    }

    async createQuickButton(userId, buttonText, responseText, description = '', priority = 1) {
        return await this.db.query(`
            INSERT INTO quick_buttons (user_id, button_text, response_text, description, priority, is_active)
            VALUES ($1, $2, $3, $4, $5, true)
            RETURNING id
        `, [userId, buttonText, responseText, description, priority]);
    }

    async setWorkingHours(userId, startTime, endTime, timezone = 'UTC', is24_7 = false) {
        return await this.db.query(`
            INSERT INTO working_hours (user_id, working_start, working_end, timezone, is_24_7)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                working_start = $2, 
                working_end = $3, 
                timezone = $4, 
                is_24_7 = $5
        `, [userId, startTime, endTime, timezone, is24_7]);
    }
}

module.exports = FreemiumFeatures;