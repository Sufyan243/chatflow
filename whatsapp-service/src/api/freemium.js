// Backend API Routes for Freemium Features
// File: backend/src/routes/freemiumFeatures.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { body, param, query } = require('express-validator');

// Middleware for all routes
router.use(authenticateToken);

// ============================================
// AUTO REPLIES ROUTES
// ============================================

// GET /api/freemium/auto-replies - Get all auto replies for user
router.get('/auto-replies', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT id, trigger_text, response_text, is_exact_match, priority, is_active, created_at
            FROM auto_replies 
            WHERE user_id = $1 
            ORDER BY priority ASC, created_at DESC
        `, [req.user.id]);

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/auto-replies - Create new auto reply
router.post('/auto-replies', [
    body('trigger_text').notEmpty().isLength({ min: 1, max: 500 }),
    body('response_text').notEmpty().isLength({ min: 1, max: 2000 }),
    body('is_exact_match').optional().isBoolean(),
    body('priority').optional().isInt({ min: 1, max: 100 })
], validateRequest, async (req, res) => {
    try {
        const { trigger_text, response_text, is_exact_match = false, priority = 1 } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO auto_replies (user_id, trigger_text, response_text, is_exact_match, priority)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, trigger_text, response_text, is_exact_match, priority, created_at
        `, [req.user.id, trigger_text, response_text, is_exact_match, priority]);

        res.status(201).json({
            success: true,
            message: 'Auto reply created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/freemium/auto-replies/:id - Update auto reply
router.put('/auto-replies/:id', [
    param('id').isInt(),
    body('trigger_text').optional().isLength({ min: 1, max: 500 }),
    body('response_text').optional().isLength({ min: 1, max: 2000 }),
    body('is_exact_match').optional().isBoolean(),
    body('priority').optional().isInt({ min: 1, max: 100 }),
    body('is_active').optional().isBoolean()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Build dynamic update query
        const setClause = Object.keys(updates).map((key, index) => `${key} = ${index + 3}`).join(', ');
        const values = [req.user.id, id, ...Object.values(updates)];
        
        const { rows } = await req.db.query(`
            UPDATE auto_replies 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND id = $2
            RETURNING *
        `, values);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Auto reply not found' });
        }

        res.json({
            success: true,
            message: 'Auto reply updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/freemium/auto-replies/:id - Delete auto reply
router.delete('/auto-replies/:id', [
    param('id').isInt()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { rowCount } = await req.db.query(`
            DELETE FROM auto_replies 
            WHERE user_id = $1 AND id = $2
        `, [req.user.id, id]);

        if (rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Auto reply not found' });
        }

        res.json({
            success: true,
            message: 'Auto reply deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// WORKING HOURS ROUTES
// ============================================

// GET /api/freemium/working-hours - Get working hours settings
router.get('/working-hours', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT working_start, working_end, timezone, is_24_7, created_at, updated_at
            FROM working_hours 
            WHERE user_id = $1
        `, [req.user.id]);

        const workingHours = rows.length > 0 ? rows[0] : {
            working_start: '09:00:00',
            working_end: '18:00:00',
            timezone: 'Asia/Karachi',
            is_24_7: false
        };

        res.json({
            success: true,
            data: workingHours
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/working-hours - Set working hours
router.post('/working-hours', [
    body('working_start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('working_end').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('timezone').optional().isLength({ min: 1, max: 50 }),
    body('is_24_7').optional().isBoolean()
], validateRequest, async (req, res) => {
    try {
        const { working_start, working_end, timezone = 'Asia/Karachi', is_24_7 = false } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO working_hours (user_id, working_start, working_end, timezone, is_24_7)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                working_start = $2, 
                working_end = $3, 
                timezone = $4, 
                is_24_7 = $5,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [req.user.id, working_start, working_end, timezone, is_24_7]);

        res.json({
            success: true,
            message: 'Working hours updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/freemium/off-hours-reply - Get off hours reply message
router.get('/off-hours-reply', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT response_text, is_active, created_at, updated_at
            FROM off_hours_replies 
            WHERE user_id = $1
        `, [req.user.id]);

        const offHoursReply = rows.length > 0 ? rows[0] : {
            response_text: "Thank you for your message! 🌙\n\nWe're currently offline but will get back to you during our working hours.\n\nFor urgent matters, please call us directly.",
            is_active: true
        };

        res.json({
            success: true,
            data: offHoursReply
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/off-hours-reply - Set off hours reply
router.post('/off-hours-reply', [
    body('response_text').notEmpty().isLength({ min: 1, max: 2000 }),
    body('is_active').optional().isBoolean()
], validateRequest, async (req, res) => {
    try {
        const { response_text, is_active = true } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO off_hours_replies (user_id, response_text, is_active)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                response_text = $2, 
                is_active = $3,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [req.user.id, response_text, is_active]);

        res.json({
            success: true,
            message: 'Off hours reply updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PRODUCTS/CATALOG ROUTES
// ============================================

// GET /api/freemium/products - Get all products
router.get('/products', async (req, res) => {
    try {
        const { category, is_active = true } = req.query;
        
        let query = `
            SELECT id, name, description, price, category, image_url, is_active, sort_order, created_at
            FROM products 
            WHERE user_id = $1
        `;
        let params = [req.user.id];
        let paramCount = 1;

        if (category) {
            paramCount++;
            query += ` AND category = ${paramCount}`;
            params.push(category);
        }

        if (is_active !== undefined) {
            paramCount++;
            query += ` AND is_active = ${paramCount}`;
            params.push(is_active === 'true');
        }

        query += ` ORDER BY category, sort_order, name`;

        const { rows } = await req.db.query(query, params);

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/products - Create new product
router.post('/products', [
    body('name').notEmpty().isLength({ min: 1, max: 255 }),
    body('description').optional().isLength({ max: 1000 }),
    body('price').optional().isDecimal(),
    body('category').optional().isLength({ max: 100 }),
    body('image_url').optional().isURL(),
    body('sort_order').optional().isInt()
], validateRequest, async (req, res) => {
    try {
        const { name, description, price, category = 'General', image_url, sort_order = 0 } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO products (user_id, name, description, price, category, image_url, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [req.user.id, name, description, price, category, image_url, sort_order]);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/freemium/products/:id - Update product
router.put('/products/:id', [
    param('id').isInt(),
    body('name').optional().isLength({ min: 1, max: 255 }),
    body('description').optional().isLength({ max: 1000 }),
    body('price').optional().isDecimal(),
    body('category').optional().isLength({ max: 100 }),
    body('image_url').optional().isURL(),
    body('sort_order').optional().isInt(),
    body('is_active').optional().isBoolean()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const setClause = Object.keys(updates).map((key, index) => `${key} = ${index + 3}`).join(', ');
        const values = [req.user.id, id, ...Object.values(updates)];
        
        const { rows } = await req.db.query(`
            UPDATE products 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND id = $2
            RETURNING *
        `, values);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/freemium/products/:id - Delete product
router.delete('/products/:id', [
    param('id').isInt()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { rowCount } = await req.db.query(`
            DELETE FROM products 
            WHERE user_id = $1 AND id = $2
        `, [req.user.id, id]);

        if (rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/freemium/product-categories - Get unique categories
router.get('/product-categories', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT DISTINCT category, COUNT(*) as product_count
            FROM products 
            WHERE user_id = $1 AND is_active = true
            GROUP BY category
            ORDER BY category
        `, [req.user.id]);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// FAQs ROUTES
// ============================================

// GET /api/freemium/faqs - Get all FAQs
router.get('/faqs', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT id, question, answer, keywords, is_active, priority, created_at
            FROM faqs 
            WHERE user_id = $1 
            ORDER BY priority ASC, created_at DESC
        `, [req.user.id]);

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/faqs - Create new FAQ
router.post('/faqs', [
    body('question').notEmpty().isLength({ min: 1, max: 500 }),
    body('answer').notEmpty().isLength({ min: 1, max: 2000 }),
    body('keywords').notEmpty().isLength({ min: 1, max: 500 }),
    body('priority').optional().isInt({ min: 1, max: 100 })
], validateRequest, async (req, res) => {
    try {
        const { question, answer, keywords, priority = 1 } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO faqs (user_id, question, answer, keywords, priority)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [req.user.id, question, answer, keywords, priority]);

        res.status(201).json({
            success: true,
            message: 'FAQ created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/freemium/faqs/:id - Update FAQ
router.put('/faqs/:id', [
    param('id').isInt(),
    body('question').optional().isLength({ min: 1, max: 500 }),
    body('answer').optional().isLength({ min: 1, max: 2000 }),
    body('keywords').optional().isLength({ min: 1, max: 500 }),
    body('priority').optional().isInt({ min: 1, max: 100 }),
    body('is_active').optional().isBoolean()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const setClause = Object.keys(updates).map((key, index) => `${key} = ${index + 3}`).join(', ');
        const values = [req.user.id, id, ...Object.values(updates)];
        
        const { rows } = await req.db.query(`
            UPDATE faqs 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND id = $2
            RETURNING *
        `, values);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'FAQ not found' });
        }

        res.json({
            success: true,
            message: 'FAQ updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/freemium/faqs/:id - Delete FAQ
router.delete('/faqs/:id', [
    param('id').isInt()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { rowCount } = await req.db.query(`
            DELETE FROM faqs 
            WHERE user_id = $1 AND id = $2
        `, [req.user.id, id]);

        if (rowCount === 0) {
            return res.status(404).json({ success: false, error: 'FAQ not found' });
        }

        res.json({
            success: true,
            message: 'FAQ deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// QUICK BUTTONS ROUTES
// ============================================

// GET /api/freemium/quick-buttons - Get all quick buttons
router.get('/quick-buttons', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT id, button_text, response_text, description, button_type, priority, is_active, created_at
            FROM quick_buttons 
            WHERE user_id = $1 
            ORDER BY priority ASC, created_at DESC
        `, [req.user.id]);

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/quick-buttons - Create new quick button
router.post('/quick-buttons', [
    body('button_text').notEmpty().isLength({ min: 1, max: 100 }),
    body('response_text').notEmpty().isLength({ min: 1, max: 2000 }),
    body('description').optional().isLength({ max: 255 }),
    body('button_type').optional().isIn(['text', 'url', 'phone']),
    body('priority').optional().isInt({ min: 1, max: 100 })
], validateRequest, async (req, res) => {
    try {
        const { button_text, response_text, description = '', button_type = 'text', priority = 1 } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO quick_buttons (user_id, button_text, response_text, description, button_type, priority)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [req.user.id, button_text, response_text, description, button_type, priority]);

        res.status(201).json({
            success: true,
            message: 'Quick button created successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/freemium/quick-buttons/:id - Update quick button
router.put('/quick-buttons/:id', [
    param('id').isInt(),
    body('button_text').optional().isLength({ min: 1, max: 100 }),
    body('response_text').optional().isLength({ min: 1, max: 2000 }),
    body('description').optional().isLength({ max: 255 }),
    body('button_type').optional().isIn(['text', 'url', 'phone']),
    body('priority').optional().isInt({ min: 1, max: 100 }),
    body('is_active').optional().isBoolean()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const setClause = Object.keys(updates).map((key, index) => `${key} = ${index + 3}`).join(', ');
        const values = [req.user.id, id, ...Object.values(updates)];
        
        const { rows } = await req.db.query(`
            UPDATE quick_buttons 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND id = $2
            RETURNING *
        `, values);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Quick button not found' });
        }

        res.json({
            success: true,
            message: 'Quick button updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/freemium/quick-buttons/:id - Delete quick button
router.delete('/quick-buttons/:id', [
    param('id').isInt()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { rowCount } = await req.db.query(`
            DELETE FROM quick_buttons 
            WHERE user_id = $1 AND id = $2
        `, [req.user.id, id]);

        if (rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Quick button not found' });
        }

        res.json({
            success: true,
            message: 'Quick button deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// GROUP SETTINGS ROUTES
// ============================================

// GET /api/freemium/group-settings - Get group settings
router.get('/group-settings', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT enable_private_dm, dm_message, monitored_groups, created_at, updated_at
            FROM group_settings 
            WHERE user_id = $1
        `, [req.user.id]);

        const groupSettings = rows.length > 0 ? rows[0] : {
            enable_private_dm: true,
            dm_message: "Hi! I saw your message in the group. I'd be happy to help you privately! What can I assist you with?",
            monitored_groups: []
        };

        res.json({
            success: true,
            data: groupSettings
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/group-settings - Update group settings
router.post('/group-settings', [
    body('enable_private_dm').optional().isBoolean(),
    body('dm_message').optional().isLength({ min: 1, max: 2000 }),
    body('monitored_groups').optional().isArray()
], validateRequest, async (req, res) => {
    try {
        const { enable_private_dm = true, dm_message, monitored_groups = [] } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO group_settings (user_id, enable_private_dm, dm_message, monitored_groups)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                enable_private_dm = $2, 
                dm_message = $3, 
                monitored_groups = $4,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [req.user.id, enable_private_dm, dm_message, JSON.stringify(monitored_groups)]);

        res.json({
            success: true,
            message: 'Group settings updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/freemium/group-triggers - Get group triggers
router.get('/group-triggers', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT keywords, created_at, updated_at
            FROM group_triggers 
            WHERE user_id = $1
        `, [req.user.id]);

        const groupTriggers = rows.length > 0 ? rows[0] : {
            keywords: 'price,cost,buy,purchase,order,delivery,available,stock'
        };

        res.json({
            success: true,
            data: groupTriggers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/group-triggers - Update group triggers
router.post('/group-triggers', [
    body('keywords').notEmpty().isLength({ min: 1, max: 1000 })
], validateRequest, async (req, res) => {
    try {
        const { keywords } = req.body;
        
        const { rows } = await req.db.query(`
            INSERT INTO group_triggers (user_id, keywords)
            VALUES ($1, $2)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                keywords = $2,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [req.user.id, keywords]);

        res.json({
            success: true,
            message: 'Group triggers updated successfully',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// BOT CONTROL ROUTES
// ============================================

// POST /api/freemium/bot/toggle - Toggle bot on/off
router.post('/bot/toggle', [
    body('enabled').isBoolean()
], validateRequest, async (req, res) => {
    try {
        const { enabled } = req.body;
        
        // Update database
        await req.db.query(`
            INSERT INTO user_settings (user_id, bot_enabled)
            VALUES ($1, $2)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                bot_enabled = $2,
                updated_at = CURRENT_TIMESTAMP
        `, [req.user.id, enabled]);

        // Update Redis cache for real-time bot control
        await req.redis.set(`bot_status:${req.user.id}`, enabled ? '1' : '0');

        res.json({
            success: true,
            message: `Bot ${enabled ? 'enabled' : 'disabled'} successfully`,
            data: { enabled }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/freemium/bot/status - Get bot status
router.get('/bot/status', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT bot_enabled, default_language, created_at, updated_at
            FROM user_settings 
            WHERE user_id = $1
        `, [req.user.id]);

        const status = rows.length > 0 ? rows[0] : {
            bot_enabled: true,
            default_language: 'en'
        };

        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ANALYTICS ROUTES
// ============================================

// GET /api/freemium/analytics - Get analytics data
router.get('/analytics', [
    query('days').optional().isInt({ min: 1, max: 365 })
], validateRequest, async (req, res) => {
    try {
        const days = req.query.days || 30;
        
        // Get interaction statistics
        const { rows: stats } = await req.db.query(`
            SELECT 
                COUNT(DISTINCT phone_number) as unique_contacts,
                COUNT(id) as total_interactions,
                COUNT(CASE WHEN interaction_type = 'auto_reply' THEN 1 END) as auto_replies,
                COUNT(CASE WHEN interaction_type = 'faq_response' THEN 1 END) as faq_responses,
                COUNT(CASE WHEN interaction_type = 'catalog_request' THEN 1 END) as catalog_requests,
                COUNT(CASE WHEN interaction_type = 'group_dm_sent' THEN 1 END) as group_dms_sent
            FROM interaction_logs 
            WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
        `, [req.user.id]);

        // Get daily breakdown
        const { rows: dailyStats } = await req.db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(id) as total_interactions,
                COUNT(DISTINCT phone_number) as unique_contacts
            FROM interaction_logs 
            WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `, [req.user.id]);

        // Get unhandled messages count
        const { rows: unhandled } = await req.db.query(`
            SELECT COUNT(*) as unhandled_count
            FROM unhandled_messages 
            WHERE user_id = $1 AND is_reviewed = false
        `, [req.user.id]);

        // Get top interaction types
        const { rows: topInteractions } = await req.db.query(`
            SELECT 
                interaction_type,
                COUNT(*) as count,
                ROUND((COUNT(*)::float / SUM(COUNT(*)) OVER()) * 100, 2) as percentage
            FROM interaction_logs 
            WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
            GROUP BY interaction_type
            ORDER BY count DESC
            LIMIT 10
        `, [req.user.id]);

        res.json({
            success: true,
            data: {
                summary: stats[0],
                daily_stats: dailyStats,
                unhandled_messages: parseInt(unhandled[0].unhandled_count),
                top_interactions: topInteractions,
                period_days: days
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/freemium/unhandled-messages - Get unhandled messages for review
router.get('/unhandled-messages', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
], validateRequest, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { rows } = await req.db.query(`
            SELECT id, phone_number, message_body, is_reviewed, created_at
            FROM unhandled_messages 
            WHERE user_id = $1 
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `, [req.user.id, limit, offset]);

        const { rows: countResult } = await req.db.query(`
            SELECT COUNT(*) as total
            FROM unhandled_messages 
            WHERE user_id = $1
        `, [req.user.id]);

        const total = parseInt(countResult[0].total);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: rows,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_items: total,
                items_per_page: limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/unhandled-messages/:id/review - Mark message as reviewed
router.post('/unhandled-messages/:id/review', [
    param('id').isInt()
], validateRequest, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { rowCount } = await req.db.query(`
            UPDATE unhandled_messages 
            SET is_reviewed = true 
            WHERE user_id = $1 AND id = $2
        `, [req.user.id, id]);

        if (rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        res.json({
            success: true,
            message: 'Message marked as reviewed'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// BULK OPERATIONS ROUTES
// ============================================

// POST /api/freemium/bulk/auto-replies - Bulk import auto replies
router.post('/bulk/auto-replies', [
    body('auto_replies').isArray({ min: 1 }),
    body('auto_replies.*.trigger_text').notEmpty().isLength({ min: 1, max: 500 }),
    body('auto_replies.*.response_text').notEmpty().isLength({ min: 1, max: 2000 }),
    body('auto_replies.*.is_exact_match').optional().isBoolean(),
    body('auto_replies.*.priority').optional().isInt({ min: 1, max: 100 })
], validateRequest, async (req, res) => {
    try {
        const { auto_replies } = req.body;
        const results = [];

        // Use transaction for bulk insert
        await req.db.query('BEGIN');

        for (const reply of auto_replies) {
            const { trigger_text, response_text, is_exact_match = false, priority = 1 } = reply;
            
            const { rows } = await req.db.query(`
                INSERT INTO auto_replies (user_id, trigger_text, response_text, is_exact_match, priority)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, trigger_text
            `, [req.user.id, trigger_text, response_text, is_exact_match, priority]);

            results.push(rows[0]);
        }

        await req.db.query('COMMIT');

        res.status(201).json({
            success: true,
            message: `${results.length} auto replies imported successfully`,
            data: results
        });
    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/freemium/bulk/products - Bulk import products
router.post('/bulk/products', [
    body('products').isArray({ min: 1 }),
    body('products.*.name').notEmpty().isLength({ min: 1, max: 255 }),
    body('products.*.description').optional().isLength({ max: 1000 }),
    body('products.*.price').optional().isDecimal(),
    body('products.*.category').optional().isLength({ max: 100 })
], validateRequest, async (req, res) => {
    try {
        const { products } = req.body;
        const results = [];

        await req.db.query('BEGIN');

        for (const product of products) {
            const { name, description, price, category = 'General', image_url, sort_order = 0 } = product;
            
            const { rows } = await req.db.query(`
                INSERT INTO products (user_id, name, description, price, category, image_url, sort_order)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, name, category
            `, [req.user.id, name, description, price, category, image_url, sort_order]);

            results.push(rows[0]);
        }

        await req.db.query('COMMIT');

        res.status(201).json({
            success: true,
            message: `${results.length} products imported successfully`,
            data: results
        });
    } catch (error) {
        await req.db.query('ROLLBACK');
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// EXPORT ROUTES
// ============================================

// GET /api/freemium/export/auto-replies - Export auto replies as JSON
router.get('/export/auto-replies', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT trigger_text, response_text, is_exact_match, priority, is_active
            FROM auto_replies 
            WHERE user_id = $1 
            ORDER BY priority ASC
        `, [req.user.id]);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=auto-replies-export.json');
        
        res.json({
            export_date: new Date().toISOString(),
            total_count: rows.length,
            auto_replies: rows
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/freemium/export/products - Export products as JSON
router.get('/export/products', async (req, res) => {
    try {
        const { rows } = await req.db.query(`
            SELECT name, description, price, category, image_url, is_active, sort_order
            FROM products 
            WHERE user_id = $1 
            ORDER BY category, sort_order, name
        `, [req.user.id]);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=products-export.json');
        
        res.json({
            export_date: new Date().toISOString(),
            total_count: rows.length,
            products: rows
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// TESTING ROUTES (for development)
// ============================================

// POST /api/freemium/test/message - Test message processing
router.post('/test/message', [
    body('message').notEmpty().isLength({ min: 1, max: 1000 }),
    body('phone_number').optional().isMobilePhone()
], validateRequest, async (req, res) => {
    try {
        const { message, phone_number = '+1234567890' } = req.body;
        const messageBody = message.toLowerCase().trim();
        
        // Simulate message processing logic
        const results = {
            processed_by: [],
            responses: []
        };

        // Test auto replies
        const { rows: autoReplies } = await req.db.query(`
            SELECT trigger_text, response_text, is_exact_match 
            FROM auto_replies 
            WHERE user_id = $1 AND is_active = true
        `, [req.user.id]);

        for (const reply of autoReplies) {
            const trigger = reply.trigger_text.toLowerCase();
            const isMatch = reply.is_exact_match 
                ? messageBody === trigger
                : messageBody.includes(trigger);

            if (isMatch) {
                results.processed_by.push('auto_reply');
                results.responses.push({
                    type: 'auto_reply',
                    trigger: reply.trigger_text,
                    response: reply.response_text
                });
                break;
            }
        }

        // Test FAQs if no auto reply matched
        if (results.processed_by.length === 0) {
            const { rows: faqs } = await req.db.query(`
                SELECT question, answer, keywords 
                FROM faqs 
                WHERE user_id = $1 AND is_active = true
            `, [req.user.id]);

            for (const faq of faqs) {
                const keywords = faq.keywords.split(',').map(k => k.trim().toLowerCase());
                const hasKeyword = keywords.some(keyword => messageBody.includes(keyword));
                
                if (hasKeyword) {
                    results.processed_by.push('faq');
                    results.responses.push({
                        type: 'faq',
                        question: faq.question,
                        response: faq.answer
                    });
                    break;
                }
            }
        }

        // Check catalog triggers
        const catalogTriggers = ['catalog', 'catalogue', 'products', 'menu', 'list'];
        if (catalogTriggers.some(trigger => messageBody.includes(trigger))) {
            results.processed_by.push('catalog');
            results.responses.push({
                type: 'catalog',
                response: 'Catalog would be displayed here'
            });
        }

        // If nothing matched
        if (results.processed_by.length === 0) {
            results.processed_by.push('unhandled');
            results.responses.push({
                type: 'unhandled',
                response: 'This message would be logged as unhandled'
            });
        }

        res.json({
            success: true,
            data: {
                input_message: message,
                phone_number: phone_number,
                ...results
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;