const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

async function setupDatabase() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'myproperty_dev'
  });

  try {
    // Read schema file
    const schemaSQL = await fs.readFile(
      path.join(__dirname, '../models/schema.sql'),
      'utf8'
    );

    // Read init file
    const initSQL = await fs.readFile(
      path.join(__dirname, '../models/init.sql'),
      'utf8'
    );

    // Execute schema
    await pool.query(schemaSQL);
    console.log('Schema created successfully');

    // Hash passwords for sample data
    const hashedPassword = await bcrypt.hash('password123', 10);
    const initSQLWithHash = initSQL.replace(/\$2b\$10\$YourHashedPasswordHere/g, hashedPassword);

    // Execute init script
    await pool.query(initSQLWithHash);
    console.log('Sample data inserted successfully');

  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = setupDatabase;
