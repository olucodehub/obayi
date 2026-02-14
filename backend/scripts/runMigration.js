/**
 * Migration Runner
 * Runs database migrations for PostgreSQL
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const database = require('../config/database');

async function runMigration(migrationFile) {
    console.log(`\n🔄 Running migration: ${migrationFile}\n`);

    try {
        // Read migration file
        const migrationPath = path.join(__dirname, '../migrations', migrationFile);
        const sql = fs.readFileSync(migrationPath, 'utf8');

        // Execute the entire SQL as one transaction
        console.log(`Executing migration SQL...`);

        // Remove comments and split into statements
        const cleanSql = sql
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n');

        // Execute the entire migration
        await database.run(cleanSql);
        console.log('✓ Success\n');

        console.log(`✅ Migration completed: ${migrationFile}\n`);
        await database.close();
        process.exit(0);
    } catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`);
        console.error(error);
        await database.close();
        process.exit(1);
    }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
    console.error('Usage: node runMigration.js <migration-file>');
    console.error('Example: node runMigration.js add_admin_activity_log.sql');
    process.exit(1);
}

runMigration(migrationFile);
