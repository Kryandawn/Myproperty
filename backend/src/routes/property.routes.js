const express = require('express');
const { check } = require('express-validator');
const propertyController = require('../controllers/property.controller');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Create property (protected, only landlords and agents)
router.post(
  '/',
  auth,
  checkRole(['landlord', 'agent']),
  [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('price', 'Price must be a positive number').isFloat({ min: 0 }),
    check('address', 'Address is required').notEmpty(),
    check('bedrooms', 'Number of bedrooms must be a positive integer').isInt({ min: 0 }),
    check('bathrooms', 'Number of bathrooms must be a positive integer').isInt({ min: 0 }),
    check('area_sqft', 'Area must be a positive number').isFloat({ min: 0 }),
    check('property_type', 'Property type is required').notEmpty()
  ],
  propertyController.createProperty
);

// Get all properties (public)
router.get('/', auth, propertyController.getProperties);

// Get property by ID (public)
router.get('/:id', auth, propertyController.getPropertyById);

// Update property status (protected, admin only)
router.patch(
  '/:id/status',
  auth,
  checkRole(['admin']),
  [
    check('status', 'Status must be either approved or rejected').isIn(['approved', 'rejected'])
  ],
  propertyController.updatePropertyStatus
);

module.exports = router;
