const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Read init.sql
const initSQL = fs.readFileSync(path.join(__dirname, '..', 'models', 'init.sql'), 'utf8');

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
    
    // Execute the SQL
    await pool.query(initSQL);
    
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
    throw err; // Re-throw to handle it in the calling function
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedDatabase().catch(err => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
