const express = require('express');
const { check } = require('express-validator');
const contactController = require('../controllers/contact.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Send a message about a property
router.post(
  '/',
  auth,
  [
    check('property_id', 'Property ID is required').notEmpty().isUUID(4),
    check('name', 'Name is required').notEmpty().trim(),
    check('email', 'Valid email is required').notEmpty().isEmail(),
    check('message', 'Message is required').notEmpty().trim()
  ],
  contactController.createMessage
);

// Get all messages for the authenticated user
router.get('/', auth, contactController.getMessages);

// Get messages for a specific property (only for participants)
router.get(
  '/property/:property_id',
  auth,
  contactController.getMessagesByProperty
);

module.exports = router;
