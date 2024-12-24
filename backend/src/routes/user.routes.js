const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', (req, res, next) => {
  auth(req, res, async () => {
    try {
      // User data is already attached by auth middleware
      const user = {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role,
        phone: req.user.phone
      };
      res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Update user profile
router.patch('/profile', (req, res, next) => {
  auth(req, res, async () => {
    try {
      const { full_name, phone } = req.body;
      const query = `
        UPDATE users 
        SET full_name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3 
        RETURNING id, email, full_name, role, phone
      `;
      const values = [full_name, phone, req.user.id];
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Get user's properties (for landlords/agents)
router.get('/properties', (req, res, next) => {
  auth(req, res, async () => {
    try {
      if (!['landlord', 'agent'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const query = `
        SELECT p.*, array_agg(pi.image_url) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        WHERE p.owner_id = $1
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query, [req.user.id]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user properties:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Get user's contact messages
router.get('/messages', (req, res, next) => {
  auth(req, res, async () => {
    try {
      const query = `
        SELECT cm.*, p.title as property_title, 
               u1.full_name as sender_name, u2.full_name as receiver_name
        FROM contact_messages cm
        JOIN properties p ON cm.property_id = p.id
        JOIN users u1 ON cm.sender_id = u1.id
        JOIN users u2 ON cm.receiver_id = u2.id
        WHERE cm.sender_id = $1 OR cm.receiver_id = $1
        ORDER BY cm.created_at DESC
      `;
      const result = await pool.query(query, [req.user.id]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user messages:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

module.exports = router;
