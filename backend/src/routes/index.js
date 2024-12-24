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

module.exports = router;
