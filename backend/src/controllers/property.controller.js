const { validationResult } = require('express-validator');
const pool = require('../config/database');

const createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      price,
      address,
      bedrooms,
      bathrooms,
      area_sqft,
      property_type
    } = req.body;

    // Only landlords and agents can create properties
    if (!['landlord', 'agent'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized to create property listings' });
    }

    const newProperty = await pool.query(
      `INSERT INTO properties 
      (title, description, price, address, bedrooms, bathrooms, area_sqft, property_type, owner_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [title, description, price, address, bedrooms, bathrooms, area_sqft, property_type, req.user.id, 'pending']
    );

    res.status(201).json({
      message: 'Property created successfully and pending approval',
      property: newProperty.rows[0]
    });
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ message: 'Server error while creating property' });
  }
};

const getProperties = async (req, res) => {
  try {
    const { status, property_type } = req.query;
    let query = 'SELECT p.*, u.full_name as owner_name, u.email as owner_email FROM properties p JOIN users u ON p.owner_id = u.id';
    const queryParams = [];
    
    // Build query conditions
    const conditions = [];
    if (status) {
      conditions.push(`p.status = $${queryParams.length + 1}`);
      queryParams.push(status);
    } else if (req.user.role !== 'admin') {
      // Non-admin users can only see approved properties
      conditions.push(`p.status = 'approved'`);
    }
    
    if (property_type) {
      conditions.push(`p.property_type = $${queryParams.length + 1}`);
      queryParams.push(property_type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const properties = await pool.query(query, queryParams);
    res.json(properties.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error while fetching properties' });
  }
};

const updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can approve properties' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedProperty = await pool.query(
      'UPDATE properties SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (updatedProperty.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({
      message: `Property ${status} successfully`,
      property: updatedProperty.rows[0]
    });
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ message: 'Server error while updating property status' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await pool.query(
      `SELECT p.*, u.full_name as owner_name, u.email as owner_email 
       FROM properties p 
       JOIN users u ON p.owner_id = u.id 
       WHERE p.id = $1`,
      [id]
    );

    if (property.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Only return non-approved properties to admin or the owner
    if (property.rows[0].status !== 'approved' && 
        req.user.role !== 'admin' && 
        property.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(property.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Server error while fetching property' });
  }
};

module.exports = {
  createProperty,
  getProperties,
  updatePropertyStatus,
  getPropertyById
};
