/**
 * Test Environment Variables
 * Verifies .env file is being loaded correctly
 */

require('dotenv').config();

console.log('\n🔍 Environment Variables Check:\n');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set (hidden for security)' : '❌ Not set');
console.log('DB_HOST:', process.env.DB_HOST || '❌ Not set');
console.log('DB_PORT:', process.env.DB_PORT || '❌ Not set');
console.log('DB_NAME:', process.env.DB_NAME || '❌ Not set');
console.log('DB_USER:', process.env.DB_USER || '❌ Not set');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ Set (hidden)' : '❌ Not set');
console.log('DB_SSL:', process.env.DB_SSL || '❌ Not set');
console.log('\nJWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('\nConnection String Preview:');
if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
    console.log(maskedUrl);
} else {
    console.log('Not configured via DATABASE_URL');
}
console.log('\n');
