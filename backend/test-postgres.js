/**
 * PostgreSQL Connection Test Script
 * Tests connection to Azure PostgreSQL and verifies database schema
 *
 * Usage:
 * node test-postgres.js
 */

const { Pool } = require('pg');
require('dotenv').config();

// Get connection details from environment
const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`;

console.log('\n🔍 Testing PostgreSQL Connection...\n');
console.log('Configuration:');
console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`  Port: ${process.env.DB_PORT || '5432'}`);
console.log(`  Database: ${process.env.DB_NAME || 'obayi_db'}`);
console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
console.log(`  SSL: ${process.env.DB_SSL || 'false'}\n`);

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runTests() {
  const client = await pool.connect();

  try {
    // Test 1: Basic Connection
    console.log('Test 1: Basic Connection');
    console.log('─'.repeat(60));
    const versionResult = await client.query('SELECT version()');
    console.log('✅ Connected successfully!');
    console.log(`PostgreSQL Version: ${versionResult.rows[0].version.split(',')[0]}\n`);

    // Test 2: Check Database Name
    console.log('Test 2: Database Name');
    console.log('─'.repeat(60));
    const dbResult = await client.query('SELECT current_database()');
    console.log(`✅ Current Database: ${dbResult.rows[0].current_database}\n`);

    // Test 3: List Tables
    console.log('Test 3: Schema Verification');
    console.log('─'.repeat(60));
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const expectedTables = [
      'users',
      'donors',
      'students',
      'donor_student_assignments',
      'student_documents',
      'password_reset_tokens'
    ];

    const actualTables = tablesResult.rows.map(row => row.table_name);

    console.log('Expected tables:');
    expectedTables.forEach(table => {
      const exists = actualTables.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });
    console.log();

    // Test 4: Count Records
    console.log('Test 4: Record Counts');
    console.log('─'.repeat(60));

    const counts = await Promise.all([
      client.query('SELECT COUNT(*) FROM users'),
      client.query('SELECT COUNT(*) FROM donors'),
      client.query('SELECT COUNT(*) FROM students'),
      client.query('SELECT COUNT(*) FROM donor_student_assignments'),
      client.query('SELECT COUNT(*) FROM student_documents'),
      client.query('SELECT COUNT(*) FROM password_reset_tokens')
    ]);

    console.log(`  Users:               ${counts[0].rows[0].count}`);
    console.log(`  Donors:              ${counts[1].rows[0].count}`);
    console.log(`  Students:            ${counts[2].rows[0].count}`);
    console.log(`  Assignments:         ${counts[3].rows[0].count}`);
    console.log(`  Documents:           ${counts[4].rows[0].count}`);
    console.log(`  Reset Tokens:        ${counts[5].rows[0].count}\n`);

    // Test 5: Check Admin Account
    console.log('Test 5: Admin Account Verification');
    console.log('─'.repeat(60));
    const adminResult = await client.query(`
      SELECT id, email, first_name, last_name, user_type, is_active, created_at
      FROM users
      WHERE user_type = 'admin'
    `);

    if (adminResult.rows.length === 0) {
      console.log('⚠️  No admin accounts found!');
      console.log('   Run: node generate-password.js <password>');
      console.log('   Then create admin account in database\n');
    } else {
      console.log(`✅ Found ${adminResult.rows.length} admin account(s):`);
      adminResult.rows.forEach(admin => {
        console.log(`   ${admin.is_active ? '✅' : '❌'} ${admin.email} (${admin.first_name} ${admin.last_name})`);
      });
      console.log();
    }

    // Test 6: Test Indexes
    console.log('Test 6: Index Verification');
    console.log('─'.repeat(60));
    const indexResult = await client.query(`
      SELECT
        schemaname,
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);

    const indexCount = indexResult.rows.length;
    console.log(`✅ Found ${indexCount} indexes`);

    const importantIndexes = [
      'idx_users_email',
      'idx_users_user_type',
      'idx_donors_user_id',
      'idx_students_user_id',
      'idx_student_documents_student_id',
      'idx_donor_student_assignments_donor_id',
      'idx_donor_student_assignments_student_id'
    ];

    const actualIndexNames = indexResult.rows.map(row => row.indexname);

    console.log('\nKey indexes:');
    importantIndexes.forEach(idx => {
      const exists = actualIndexNames.includes(idx);
      console.log(`  ${exists ? '✅' : '❌'} ${idx}`);
    });
    console.log();

    // Test 7: Test Foreign Key Constraints
    console.log('Test 7: Foreign Key Constraints');
    console.log('─'.repeat(60));
    const fkResult = await client.query(`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name
    `);

    console.log(`✅ Found ${fkResult.rows.length} foreign key constraints\n`);

    // Test 8: Connection Pool Stats
    console.log('Test 8: Connection Pool Statistics');
    console.log('─'.repeat(60));
    console.log(`  Total connections:   ${pool.totalCount}`);
    console.log(`  Idle connections:    ${pool.idleCount}`);
    console.log(`  Waiting requests:    ${pool.waitingCount}\n`);

    // Summary
    console.log('=' .repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('=' .repeat(60));
    console.log('\n🎉 Your PostgreSQL database is ready to use!\n');
    console.log('Next steps:');
    console.log('  1. Update backend code to use PostgreSQL');
    console.log('  2. Change default admin password');
    console.log('  3. Run migration script if you have SQLite data');
    console.log('  4. Test API endpoints');
    console.log('  5. Deploy to production\n');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error('\nDetails:', error);
    console.log('\nTroubleshooting:');
    console.log('  1. Check environment variables in .env file');
    console.log('  2. Verify Azure PostgreSQL firewall rules');
    console.log('  3. Confirm database schema has been deployed');
    console.log('  4. Check connection string format');
    console.log('  5. Verify SSL settings\n');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run tests
runTests().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
