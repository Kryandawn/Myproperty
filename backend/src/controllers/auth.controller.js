const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, full_name, phone } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate role
    const validRoles = ['landlord', 'agent', 'renter', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, role, full_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, full_name',
      [email, hashedPassword, role, full_name, phone]
    );

    // Generate JWT
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
        full_name: newUser.rows[0].full_name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    console.error('=== LOGIN ATTEMPT ===');
    console.error('Request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.error('Attempting login for email:', email);

    // Check if user exists
    console.error('Querying database for user...');
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    console.error('Database query result:', {
      found: user.rows.length > 0,
      userDetails: user.rows[0] ? {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
        passwordHashLength: user.rows[0].password_hash?.length
      } : null
    });

    if (user.rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    console.log('Stored password hash:', user.rows[0].password_hash);
    console.log('Attempting to verify password...');
    try {
      const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
      console.log('Password verification result:', isValidPassword);
      if (!isValidPassword) {
        console.log('Password verification failed');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during password comparison:', error);
      return res.status(500).json({ message: 'Error verifying credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
        full_name: user.rows[0].full_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  register,
  login
};
