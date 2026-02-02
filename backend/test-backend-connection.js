/**
 * Test Backend Database Connection
 * Verifies that the backend can connect to PostgreSQL using the new config
 */

require('dotenv').config();
const database = require('./config/database');

async function testBackendConnection() {
    console.log('\n🔍 Testing Backend Database Connection...\n');

    try {
        // Connect to database
        console.log('1. Connecting to database...');
        await database.connect();
        console.log('✅ Connection successful!\n');

        // Test query - Get admin user
        console.log('2. Testing query - Fetching admin user...');
        const admin = await database.get(
            'SELECT id, email, user_type, first_name, last_name FROM users WHERE user_type = $1 LIMIT 1',
            ['admin']
        );

        if (admin) {
            console.log('✅ Query successful!');
            console.log(`   Admin: ${admin.email} (${admin.first_name} ${admin.last_name})\n`);
        } else {
            console.log('⚠️  No admin user found\n');
        }

        // Test count query
        console.log('3. Testing count queries...');
        const userCount = await database.get('SELECT COUNT(*) as count FROM users');
        const donorCount = await database.get('SELECT COUNT(*) as count FROM donors');
        const studentCount = await database.get('SELECT COUNT(*) as count FROM students');

        console.log(`✅ Query successful!`);
        console.log(`   Users: ${userCount.count}`);
        console.log(`   Donors: ${donorCount.count}`);
        console.log(`   Students: ${studentCount.count}\n`);

        // Test all() method
        console.log('4. Testing all() method - Fetching all users...');
        const allUsers = await database.all('SELECT id, email, user_type FROM users');
        console.log(`✅ Query successful! Found ${allUsers.length} users\n`);

        console.log('=' .repeat(60));
        console.log('✅ ALL BACKEND TESTS PASSED!');
        console.log('=' .repeat(60));
        console.log('\n🎉 Your backend is ready to use PostgreSQL!\n');
        console.log('Next steps:');
        console.log('  1. Start the backend: npm start');
        console.log('  2. Test API endpoints');
        console.log('  3. Update Azure App Service environment variables\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Backend Test Failed:', error.message);
        console.error('\nDetails:', error);
        console.log('\nTroubleshooting:');
        console.log('  1. Check backend/.env file exists with correct credentials');
        console.log('  2. Verify DATABASE_URL is correct');
        console.log('  3. Ensure pg package is installed: npm install pg');
        console.log('  4. Check Azure PostgreSQL firewall allows your IP\n');
        process.exit(1);
    }
}

testBackendConnection();
