/**
 * PostgreSQL Database Configuration
 * Azure PostgreSQL Flexible Server connection
 */

const { Pool } = require('pg');

// Get connection details from environment variables
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'obayi_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false // Required for Azure
  } : false,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if unable to connect
};

// Alternative: Use connection string if provided
if (process.env.DATABASE_URL) {
  const connectionString = process.env.DATABASE_URL;
  module.exports = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  module.exports = new Pool(connectionConfig);
}

// Test connection on startup
module.exports.query('SELECT NOW()')
  .then(() => {
    console.log('✅ PostgreSQL connection established successfully');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  });

// Handle pool errors
module.exports.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing PostgreSQL connection pool...');
  await module.exports.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing PostgreSQL connection pool...');
  await module.exports.end();
  process.exit(0);
});
