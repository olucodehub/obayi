/**
 * Password Hash Generator for Admin Accounts
 * Uses bcrypt with 10 salt rounds (matching application settings)
 *
 * Usage:
 * node generate-password.js YourSecurePassword123!
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('\n❌ Error: Password is required');
  console.log('\nUsage:');
  console.log('  node generate-password.js <password>\n');
  console.log('Example:');
  console.log('  node generate-password.js MySecurePassword123!\n');
  process.exit(1);
}

// Validate password strength
const hasUpperCase = /[A-Z]/.test(password);
const hasLowerCase = /[a-z]/.test(password);
const hasNumber = /[0-9]/.test(password);
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
const isLongEnough = password.length >= 8;

console.log('\n🔐 Password Strength Check:');
console.log(`  Length (min 8):     ${isLongEnough ? '✅' : '❌'} (${password.length} characters)`);
console.log(`  Uppercase letter:   ${hasUpperCase ? '✅' : '❌'}`);
console.log(`  Lowercase letter:   ${hasLowerCase ? '✅' : '❌'}`);
console.log(`  Number:             ${hasNumber ? '✅' : '❌'}`);
console.log(`  Special character:  ${hasSpecialChar ? '✅' : '❌'}`);

const isStrong = isLongEnough && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

if (!isStrong) {
  console.log('\n⚠️  Warning: Password does not meet strength requirements');
  console.log('   Recommended: At least 8 characters with uppercase, lowercase, number, and special character\n');
}

console.log('\n⏳ Generating bcrypt hash...\n');

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    process.exit(1);
  }

  console.log('📋 Generated Hash:');
  console.log('─'.repeat(80));
  console.log(hash);
  console.log('─'.repeat(80));
  console.log('\n📝 SQL Example:');
  console.log('─'.repeat(80));
  console.log(`INSERT INTO users (email, password_hash, user_type, first_name, last_name)`);
  console.log(`VALUES (`);
  console.log(`  'admin@obayi.co',`);
  console.log(`  '${hash}',`);
  console.log(`  'admin',`);
  console.log(`  'Admin',`);
  console.log(`  'User'`);
  console.log(`);`);
  console.log('─'.repeat(80));
  console.log('\n✅ Done! Copy the hash above for your database.\n');
});
