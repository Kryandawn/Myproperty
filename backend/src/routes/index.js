const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const propertyRoutes = require('./property.routes');
const userRoutes = require('./user.routes');
const contactRoutes = require('./contact.routes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/users', userRoutes);
router.use('/contact', contactRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
