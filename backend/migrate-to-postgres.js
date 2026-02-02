/**
 * Migration Script: SQLite to PostgreSQL
 * This script migrates data from SQLite to Azure PostgreSQL
 *
 * Prerequisites:
 * 1. Azure PostgreSQL server created and schema deployed
 * 2. npm install pg installed
 * 3. Environment variables configured
 *
 * Usage:
 * node migrate-to-postgres.js
 */

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// SQLite database path
const SQLITE_DB_PATH = path.join(__dirname, 'database.sqlite');

// PostgreSQL connection
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false
  }
});

// Open SQLite database
const sqliteDb = new sqlite3.Database(SQLITE_DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening SQLite database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

/**
 * Helper function to promisify SQLite queries
 */
function sqliteQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Migration statistics
 */
const stats = {
  users: 0,
  donors: 0,
  students: 0,
  assignments: 0,
  documents: 0,
  tokens: 0
};

/**
 * Migrate users table
 */
async function migrateUsers() {
  console.log('\n📋 Migrating users...');

  const users = await sqliteQuery('SELECT * FROM users ORDER BY id');

  if (users.length === 0) {
    console.log('⚠️  No users to migrate');
    return;
  }

  const pgClient = await pgPool.connect();

  try {
    await pgClient.query('BEGIN');

    for (const user of users) {
      await pgClient.query(
        `INSERT INTO users (id, email, password_hash, user_type, first_name, last_name, phone, created_at, updated_at, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         user_type = EXCLUDED.user_type,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         phone = EXCLUDED.phone`,
        [
          user.id,
          user.email,
          user.password_hash,
          user.user_type,
          user.first_name,
          user.last_name,
          user.phone,
          user.created_at,
          user.updated_at,
          user.is_active
        ]
      );
      stats.users++;
    }

    // Update sequence
    const maxId = Math.max(...users.map(u => u.id));
    await pgClient.query(`SELECT setval('users_id_seq', $1)`, [maxId]);

    await pgClient.query('COMMIT');
    console.log(`✅ Migrated ${stats.users} users`);
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error migrating users:', error.message);
    throw error;
  } finally {
    pgClient.release();
  }
}

/**
 * Migrate donors table
 */
async function migrateDonors() {
  console.log('\n📋 Migrating donors...');

  const donors = await sqliteQuery('SELECT * FROM donors ORDER BY id');

  if (donors.length === 0) {
    console.log('⚠️  No donors to migrate');
    return;
  }

  const pgClient = await pgPool.connect();

  try {
    await pgClient.query('BEGIN');

    for (const donor of donors) {
      await pgClient.query(
        `INSERT INTO donors (id, user_id, organization, address, city, country, donation_amount, donation_frequency, preferred_contact, bio, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
         user_id = EXCLUDED.user_id,
         organization = EXCLUDED.organization,
         address = EXCLUDED.address,
         city = EXCLUDED.city,
         country = EXCLUDED.country,
         donation_amount = EXCLUDED.donation_amount,
         donation_frequency = EXCLUDED.donation_frequency,
         preferred_contact = EXCLUDED.preferred_contact,
         bio = EXCLUDED.bio`,
        [
          donor.id,
          donor.user_id,
          donor.organization,
          donor.address,
          donor.city,
          donor.country,
          donor.donation_amount,
          donor.donation_frequency,
          donor.preferred_contact,
          donor.bio,
          donor.created_at,
          donor.updated_at
        ]
      );
      stats.donors++;
    }

    // Update sequence
    const maxId = Math.max(...donors.map(d => d.id));
    await pgClient.query(`SELECT setval('donors_id_seq', $1)`, [maxId]);

    await pgClient.query('COMMIT');
    console.log(`✅ Migrated ${stats.donors} donors`);
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error migrating donors:', error.message);
    throw error;
  } finally {
    pgClient.release();
  }
}

/**
 * Migrate students table
 */
async function migrateStudents() {
  console.log('\n📋 Migrating students...');

  const students = await sqliteQuery('SELECT * FROM students ORDER BY id');

  if (students.length === 0) {
    console.log('⚠️  No students to migrate');
    return;
  }

  const pgClient = await pgPool.connect();

  try {
    await pgClient.query('BEGIN');

    for (const student of students) {
      await pgClient.query(
        `INSERT INTO students (id, user_id, student_id, date_of_birth, gender, address, city, country, school_name, grade_level, field_of_study, profile_picture_url, emergency_contact_name, emergency_contact_phone, guardian_name, guardian_phone, guardian_email, bio, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         ON CONFLICT (student_id) DO UPDATE SET
         user_id = EXCLUDED.user_id,
         date_of_birth = EXCLUDED.date_of_birth,
         gender = EXCLUDED.gender,
         address = EXCLUDED.address,
         city = EXCLUDED.city,
         country = EXCLUDED.country,
         school_name = EXCLUDED.school_name,
         grade_level = EXCLUDED.grade_level,
         field_of_study = EXCLUDED.field_of_study,
         profile_picture_url = EXCLUDED.profile_picture_url,
         emergency_contact_name = EXCLUDED.emergency_contact_name,
         emergency_contact_phone = EXCLUDED.emergency_contact_phone,
         guardian_name = EXCLUDED.guardian_name,
         guardian_phone = EXCLUDED.guardian_phone,
         guardian_email = EXCLUDED.guardian_email,
         bio = EXCLUDED.bio`,
        [
          student.id,
          student.user_id,
          student.student_id,
          student.date_of_birth,
          student.gender,
          student.address,
          student.city,
          student.country,
          student.school_name,
          student.grade_level,
          student.field_of_study,
          student.profile_picture_url,
          student.emergency_contact_name,
          student.emergency_contact_phone,
          student.guardian_name,
          student.guardian_phone,
          student.guardian_email,
          student.bio,
          student.created_at,
          student.updated_at
        ]
      );
      stats.students++;
    }

    // Update sequence
    const maxId = Math.max(...students.map(s => s.id));
    await pgClient.query(`SELECT setval('students_id_seq', $1)`, [maxId]);

    await pgClient.query('COMMIT');
    console.log(`✅ Migrated ${stats.students} students`);
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error migrating students:', error.message);
    throw error;
  } finally {
    pgClient.release();
  }
}

/**
 * Migrate donor_student_assignments table
 */
async function migrateAssignments() {
  console.log('\n📋 Migrating assignments...');

  const assignments = await sqliteQuery('SELECT * FROM donor_student_assignments ORDER BY id');

  if (assignments.length === 0) {
    console.log('⚠️  No assignments to migrate');
    return;
  }

  const pgClient = await pgPool.connect();

  try {
    await pgClient.query('BEGIN');

    for (const assignment of assignments) {
      await pgClient.query(
        `INSERT INTO donor_student_assignments (id, donor_id, student_id, assigned_by_admin_id, assigned_at, is_active, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (donor_id, student_id) DO UPDATE SET
         assigned_by_admin_id = EXCLUDED.assigned_by_admin_id,
         assigned_at = EXCLUDED.assigned_at,
         is_active = EXCLUDED.is_active,
         notes = EXCLUDED.notes`,
        [
          assignment.id,
          assignment.donor_id,
          assignment.student_id,
          assignment.assigned_by_admin_id,
          assignment.assigned_at,
          assignment.is_active,
          assignment.notes
        ]
      );
      stats.assignments++;
    }

    // Update sequence
    const maxId = Math.max(...assignments.map(a => a.id));
    await pgClient.query(`SELECT setval('donor_student_assignments_id_seq', $1)`, [maxId]);

    await pgClient.query('COMMIT');
    console.log(`✅ Migrated ${stats.assignments} assignments`);
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error migrating assignments:', error.message);
    throw error;
  } finally {
    pgClient.release();
  }
}

/**
 * Migrate student_documents table
 */
async function migrateDocuments() {
  console.log('\n📋 Migrating documents...');

  const documents = await sqliteQuery('SELECT * FROM student_documents ORDER BY id');

  if (documents.length === 0) {
    console.log('⚠️  No documents to migrate');
    return;
  }

  const pgClient = await pgPool.connect();

  try {
    await pgClient.query('BEGIN');

    for (const doc of documents) {
      await pgClient.query(
        `INSERT INTO student_documents (id, student_id, document_type, document_title, file_name, file_size, mime_type, file_url, blob_name, uploaded_at, description, amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
         student_id = EXCLUDED.student_id,
         document_type = EXCLUDED.document_type,
         document_title = EXCLUDED.document_title,
         file_name = EXCLUDED.file_name,
         file_size = EXCLUDED.file_size,
         mime_type = EXCLUDED.mime_type,
         file_url = EXCLUDED.file_url,
         blob_name = EXCLUDED.blob_name,
         uploaded_at = EXCLUDED.uploaded_at,
         description = EXCLUDED.description,
         amount = EXCLUDED.amount`,
        [
          doc.id,
          doc.student_id,
          doc.document_type,
          doc.document_title,
          doc.file_name,
          doc.file_size,
          doc.mime_type,
          doc.file_url,
          doc.blob_name,
          doc.uploaded_at,
          doc.description,
          doc.amount
        ]
      );
      stats.documents++;
    }

    // Update sequence
    const maxId = Math.max(...documents.map(d => d.id));
    await pgClient.query(`SELECT setval('student_documents_id_seq', $1)`, [maxId]);

    await pgClient.query('COMMIT');
    console.log(`✅ Migrated ${stats.documents} documents`);
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error migrating documents:', error.message);
    throw error;
  } finally {
    pgClient.release();
  }
}

/**
 * Migrate password_reset_tokens table
 */
async function migrateTokens() {
  console.log('\n📋 Migrating password reset tokens...');

  const tokens = await sqliteQuery('SELECT * FROM password_reset_tokens WHERE used = 0 ORDER BY id');

  if (tokens.length === 0) {
    console.log('⚠️  No active tokens to migrate');
    return;
  }

  const pgClient = await pgPool.connect();

  try {
    await pgClient.query('BEGIN');

    for (const token of tokens) {
      await pgClient.query(
        `INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          token.id,
          token.user_id,
          token.token,
          token.expires_at,
          token.used,
          token.created_at
        ]
      );
      stats.tokens++;
    }

    // Update sequence
    if (tokens.length > 0) {
      const maxId = Math.max(...tokens.map(t => t.id));
      await pgClient.query(`SELECT setval('password_reset_tokens_id_seq', $1)`, [maxId]);
    }

    await pgClient.query('COMMIT');
    console.log(`✅ Migrated ${stats.tokens} password reset tokens`);
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Error migrating tokens:', error.message);
    throw error;
  } finally {
    pgClient.release();
  }
}

/**
 * Verify migration
 */
async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');

  const pgClient = await pgPool.connect();

  try {
    const usersCount = await pgClient.query('SELECT COUNT(*) FROM users');
    const donorsCount = await pgClient.query('SELECT COUNT(*) FROM donors');
    const studentsCount = await pgClient.query('SELECT COUNT(*) FROM students');
    const assignmentsCount = await pgClient.query('SELECT COUNT(*) FROM donor_student_assignments');
    const documentsCount = await pgClient.query('SELECT COUNT(*) FROM student_documents');

    console.log('\n📊 PostgreSQL Database Counts:');
    console.log(`  Users: ${usersCount.rows[0].count}`);
    console.log(`  Donors: ${donorsCount.rows[0].count}`);
    console.log(`  Students: ${studentsCount.rows[0].count}`);
    console.log(`  Assignments: ${assignmentsCount.rows[0].count}`);
    console.log(`  Documents: ${documentsCount.rows[0].count}`);

    console.log('\n📊 Migration Statistics:');
    console.log(`  Migrated Users: ${stats.users}`);
    console.log(`  Migrated Donors: ${stats.donors}`);
    console.log(`  Migrated Students: ${stats.students}`);
    console.log(`  Migrated Assignments: ${stats.assignments}`);
    console.log(`  Migrated Documents: ${stats.documents}`);
    console.log(`  Migrated Tokens: ${stats.tokens}`);

  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  } finally {
    pgClient.release();
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('🚀 Starting migration from SQLite to PostgreSQL...\n');
  console.log('Source: SQLite database.sqlite');
  console.log(`Target: PostgreSQL ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'obayi_db'}\n`);

  try {
    // Test PostgreSQL connection
    await pgPool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connection successful\n');

    // Run migrations in order (respecting foreign keys)
    await migrateUsers();
    await migrateDonors();
    await migrateStudents();
    await migrateAssignments();
    await migrateDocuments();
    await migrateTokens();

    // Verify
    await verifyMigration();

    console.log('\n✅ Migration completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close connections
    sqliteDb.close();
    await pgPool.end();
  }
}

// Run migration
runMigration();
