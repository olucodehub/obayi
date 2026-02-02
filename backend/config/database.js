/**
 * PostgreSQL Database Configuration
 * Azure PostgreSQL Flexible Server connection
 */

const { Pool } = require('pg');

// Get connection details from environment variables
const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Azure
  },
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return error after 10 seconds if unable to connect
  query_timeout: 30000, // Query timeout: 30 seconds
  statement_timeout: 30000 // Statement timeout: 30 seconds
});

// PostgreSQL DatabaseWrapper class to match SQLite interface
class DatabaseWrapper {
    constructor() {
        this.pool = pool;
    }

    async connect() {
        try {
            // Test connection
            const client = await this.pool.connect();
            console.log('✅ Connected to PostgreSQL database');
            client.release();
            return this.pool;
        } catch (error) {
            console.error('❌ Error connecting to PostgreSQL:', error.message);
            throw error;
        }
    }

    getDb() {
        return this.pool;
    }

    async close() {
        await this.pool.end();
        console.log('PostgreSQL connection pool closed');
    }

    // PostgreSQL query methods matching SQLite interface
    async run(sql, params = []) {
        try {
            const result = await this.pool.query(sql, params);
            return {
                id: result.rows[0]?.id || null,
                changes: result.rowCount
            };
        } catch (error) {
            console.error('SQL Error:', error.message);
            throw error;
        }
    }

    async get(sql, params = []) {
        try {
            const result = await this.pool.query(sql, params);
            return result.rows[0] || null;
        } catch (error) {
            console.error('SQL Error:', error.message);
            throw error;
        }
    }

    async all(sql, params = []) {
        try {
            const result = await this.pool.query(sql, params);
            return result.rows;
        } catch (error) {
            console.error('SQL Error:', error.message);
            throw error;
        }
    }
}

const database = new DatabaseWrapper();

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing PostgreSQL connection pool...');
    await database.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Closing PostgreSQL connection pool...');
    await database.close();
    process.exit(0);
});

module.exports = database;