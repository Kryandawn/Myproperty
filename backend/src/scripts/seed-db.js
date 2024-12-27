const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Read init.sql
const initSQL = fs.readFileSync(path.join(__dirname, '..', 'models', 'init.sql'), 'utf8');

/**
 * Cleans up existing data from all tables
 */
async function cleanupDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Disable foreign key checks temporarily
    await client.query('SET CONSTRAINTS ALL DEFERRED');
    
    // Delete data from all tables in reverse order of dependencies
    await client.query('DELETE FROM contact_messages');
    await client.query('DELETE FROM property_images');
    await client.query('DELETE FROM properties');
    await client.query('DELETE FROM users');
    
    await client.query('COMMIT');
    console.log('Database cleaned successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error cleaning database:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Seeds the database with initial data
 * This includes:
 * - User roles (admin, landlord, agent, renter)
 * - Sample properties with different statuses
 * - Property images
 * - Contact messages
 */
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clean existing data first
    await cleanupDatabase();
    
    // Execute the SQL
    await pool.query(initSQL);
    
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
    throw err;
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedDatabase().catch(err => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
