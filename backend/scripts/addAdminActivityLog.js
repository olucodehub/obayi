/**
 * Add Admin Activity Log Table
 * Creates the admin_activity_log table and indexes
 */

require('dotenv').config();
const database = require('../config/database');

async function addAdminActivityLog() {
    console.log('\n🔄 Creating admin_activity_log table...\n');

    try {
        // Create table
        console.log('1. Creating admin_activity_log table...');
        await database.run(`
            CREATE TABLE IF NOT EXISTS admin_activity_log (
                id SERIAL PRIMARY KEY,
                admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                action VARCHAR(100) NOT NULL,
                entity_type VARCHAR(50),
                entity_id INTEGER,
                details TEXT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Table created\n');

        // Create indexes
        console.log('2. Creating indexes...');
        await database.run(`
            CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_log(admin_id)
        `);
        await database.run(`
            CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at DESC)
        `);
        await database.run(`
            CREATE INDEX IF NOT EXISTS idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id)
        `);
        await database.run(`
            CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_log(action)
        `);
        console.log('✓ Indexes created\n');

        console.log('✅ Admin activity log table created successfully!\n');
        await database.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to create admin activity log table');
        console.error(error);
        await database.close();
        process.exit(1);
    }
}

addAdminActivityLog();
