const { validationResult } = require('express-validator');
const pool = require('../config/database');

const createMessage = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Validation chain starting...');
    
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array());
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Validation passed, extracting data...');
    const { property_id, name, email, message } = req.body;
    console.log('Extracted data:', { property_id, name, email, message });
    const sender_id = req.user.id;
    
    // Verify email matches authenticated user
    if (email !== req.user.email) {
      return res.status(400).json({ message: 'Email must match authenticated user' });
    }

    // Get property details to find the owner
    const property = await pool.query(
      'SELECT owner_id FROM properties WHERE id = $1',
      [property_id]
    );

    if (property.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const receiver_id = property.rows[0].owner_id;

    // Prevent sending message to yourself
    if (sender_id === receiver_id) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const newMessage = await pool.query(
      `INSERT INTO contact_messages 
      (property_id, sender_id, receiver_id, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [property_id, sender_id, receiver_id, message]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      contactMessage: newMessage.rows[0]
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get messages where user is either sender or receiver
    const messages = await pool.query(
      `SELECT 
        cm.*,
        p.title as property_title,
        sender.full_name as sender_name,
        receiver.full_name as receiver_name
      FROM contact_messages cm
      JOIN properties p ON cm.property_id = p.id
      JOIN users sender ON cm.sender_id = sender.id
      JOIN users receiver ON cm.receiver_id = receiver.id
      WHERE cm.sender_id = $1 OR cm.receiver_id = $1
      ORDER BY cm.created_at DESC`,
      [userId]
    );

    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};

const getMessagesByProperty = async (req, res) => {
  try {
    const { property_id } = req.params;
    const userId = req.user.id;

    // Verify user has access to these messages (owner or participant)
    const property = await pool.query(
      'SELECT owner_id FROM properties WHERE id = $1',
      [property_id]
    );

    if (property.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const messages = await pool.query(
      `SELECT 
        cm.*,
        sender.full_name as sender_name,
        receiver.full_name as receiver_name
      FROM contact_messages cm
      JOIN users sender ON cm.sender_id = sender.id
      JOIN users receiver ON cm.receiver_id = receiver.id
      WHERE cm.property_id = $1
      AND (cm.sender_id = $2 OR cm.receiver_id = $2)
      ORDER BY cm.created_at ASC`,
      [property_id, userId]
    );

    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching property messages:', error);
    res.status(500).json({ message: 'Server error while fetching property messages' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessagesByProperty
};
