# Admin Account Management Guide
## Obayi Education Foundation - PostgreSQL Database

**Created:** 2025-01-30

---

## 📋 Table of Contents

1. [Default Admin Account](#default-admin-account)
2. [Creating New Admin Accounts](#creating-new-admin-accounts)
3. [Listing Admin Accounts](#listing-admin-accounts)
4. [Changing Admin Password](#changing-admin-password)
5. [Deactivating Admin Accounts](#deactivating-admin-accounts)
6. [Reactivating Admin Accounts](#reactivating-admin-accounts)
7. [Deleting Admin Accounts](#deleting-admin-accounts)
8. [Admin Permissions](#admin-permissions)
9. [Security Best Practices](#security-best-practices)

---

## 🔐 Default Admin Account

When you deploy the PostgreSQL schema, one default admin account is created:

```
Email: admin@obayi.co
Password: admin123
```

⚠️ **CRITICAL:** Change this password immediately after first login!

---

## ➕ Creating New Admin Accounts

### Method 1: Using SQL (Direct Database Access)

#### Step 1: Generate Password Hash

Create a file `backend/generate-password.js`:

```javascript
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node generate-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('\nPassword:', password);
  console.log('Hash:', hash);
  console.log('\nCopy the hash above for your SQL INSERT statement\n');
});
```

#### Step 2: Generate the Hash

```bash
cd c:\Dev\obayi\backend
node generate-password.js YourSecurePassword123!
```

Example output:
```
Password: YourSecurePassword123!
Hash: $2a$10$xQz8h8y9J0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4m
```

#### Step 3: Connect to Database

```bash
# Using psql
psql -h obayi-postgres-server.postgres.database.azure.com \
     -U obayiadmin \
     -d obayi_db

# Or using Azure Cloud Shell in Azure Portal
```

#### Step 4: Insert New Admin

```sql
INSERT INTO users (
  email,
  password_hash,
  user_type,
  first_name,
  last_name,
  phone,
  is_active
) VALUES (
  'john.doe@obayi.co',
  '$2a$10$xQz8h8y9J0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4m',
  'admin',
  'John',
  'Doe',
  '+234XXXXXXXXXX',
  TRUE
);
```

#### Step 5: Verify Creation

```sql
SELECT id, email, first_name, last_name, user_type, created_at
FROM users
WHERE email = 'john.doe@obayi.co';
```

---

### Method 2: Using Backend API (After Backend is Running)

#### Using curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@obayi.co",
    "password": "SecurePassword123!",
    "userType": "admin",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+234XXXXXXXXXX"
  }'
```

#### Using Postman:

1. Method: POST
2. URL: `http://localhost:3000/api/auth/register` (or production URL)
3. Headers:
   ```
   Content-Type: application/json
   ```
4. Body (raw JSON):
   ```json
   {
     "email": "john.doe@obayi.co",
     "password": "SecurePassword123!",
     "userType": "admin",
     "firstName": "John",
     "lastName": "Doe",
     "phone": "+234XXXXXXXXXX"
   }
   ```

#### Using the Frontend:

1. Navigate to `/register` page
2. Select "Admin" as user type (if option available)
3. Fill in the form
4. Submit

**Note:** You may need to add admin registration permission to your frontend if not already present.

---

### Method 3: Using Admin Panel (If Available)

If you have an admin panel with user management:

1. Log in as admin
2. Navigate to "Users" or "Admin Management"
3. Click "Add New Admin"
4. Fill in the form
5. Submit

---

## 📋 Listing Admin Accounts

### List All Admins:

```sql
SELECT
  id,
  email,
  first_name,
  last_name,
  phone,
  is_active,
  created_at,
  updated_at
FROM users
WHERE user_type = 'admin'
ORDER BY created_at DESC;
```

### List Active Admins Only:

```sql
SELECT
  id,
  email,
  first_name,
  last_name,
  phone,
  created_at
FROM users
WHERE user_type = 'admin'
  AND is_active = TRUE
ORDER BY created_at DESC;
```

### Count Total Admins:

```sql
SELECT
  COUNT(*) as total_admins,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_admins,
  COUNT(CASE WHEN is_active = FALSE THEN 1 END) as inactive_admins
FROM users
WHERE user_type = 'admin';
```

---

## 🔑 Changing Admin Password

### Method 1: Using SQL (If You Know Old Password Hash)

#### Generate New Password Hash:

```bash
node generate-password.js NewSecurePassword456!
```

#### Update Password:

```sql
UPDATE users
SET password_hash = '$2a$10$NEW_HASH_HERE'
WHERE email = 'admin@obayi.co';
```

#### Verify Update:

```sql
SELECT email, updated_at
FROM users
WHERE email = 'admin@obayi.co';
```

---

### Method 2: Using Backend API (Password Change Endpoint)

#### When Logged In:

```bash
curl -X PUT http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword456!"
  }'
```

---

### Method 3: Using Password Reset Flow (If Forgot Password)

#### Step 1: Request Reset Token

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@obayi.co"
  }'
```

#### Step 2: Check Database for Token (Development Only)

```sql
SELECT token, expires_at
FROM password_reset_tokens
WHERE user_id = (SELECT id FROM users WHERE email = 'admin@obayi.co')
  AND used = FALSE
ORDER BY created_at DESC
LIMIT 1;
```

#### Step 3: Reset Password with Token

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "newPassword": "NewPassword456!"
  }'
```

---

### Method 4: Emergency Password Reset (Database Access Required)

If you're locked out and have database access:

```sql
-- Generate a new password hash first using Node.js script
-- Then update directly:

UPDATE users
SET password_hash = '$2a$10$xQz8h8y9J0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4m',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@obayi.co';

-- Verify
SELECT email, updated_at FROM users WHERE email = 'admin@obayi.co';
```

---

## ⛔ Deactivating Admin Accounts

### Soft Delete (Recommended - Preserves History):

```sql
UPDATE users
SET is_active = FALSE,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'john.doe@obayi.co'
  AND user_type = 'admin';
```

### Verify Deactivation:

```sql
SELECT email, is_active, updated_at
FROM users
WHERE email = 'john.doe@obayi.co';
```

---

## ✅ Reactivating Admin Accounts

```sql
UPDATE users
SET is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'john.doe@obayi.co'
  AND user_type = 'admin';
```

### Verify Reactivation:

```sql
SELECT email, is_active, updated_at
FROM users
WHERE email = 'john.doe@obayi.co';
```

---

## 🗑️ Deleting Admin Accounts

### ⚠️ WARNING: Permanent Deletion

Deleting an admin account is permanent and will also delete:
- Any donor/student assignments they created (due to foreign key constraints)
- Associated password reset tokens

### Check Dependencies First:

```sql
-- Check assignments created by this admin
SELECT COUNT(*) as assignments_created
FROM donor_student_assignments
WHERE assigned_by_admin_id = (
  SELECT id FROM users WHERE email = 'john.doe@obayi.co'
);
```

### Delete Admin Account:

```sql
-- This will cascade delete related records
DELETE FROM users
WHERE email = 'john.doe@obayi.co'
  AND user_type = 'admin';
```

### Safer Alternative: Deactivate Instead

Instead of deleting, it's recommended to deactivate accounts to preserve history:

```sql
UPDATE users
SET is_active = FALSE
WHERE email = 'john.doe@obayi.co';
```

---

## 🔐 Admin Permissions

### What Admins Can Do:

Based on your `backend/middleware/auth.js` and routes:

✅ **User Management:**
- View all donors (`GET /api/admin/donors`)
- View all students (`GET /api/admin/students`)
- View specific donor/student details
- Deactivate donors/students
- Access all user profiles

✅ **Assignment Management:**
- Create donor-student assignments (`POST /api/admin/assign`)
- Remove assignments (`POST /api/admin/unassign`)
- View all assignments (`GET /api/admin/assignments`)

✅ **Platform Oversight:**
- View platform statistics (`GET /api/admin/stats`)
- Monitor system health
- Access all donor and student data
- View student documents

✅ **Profile Management:**
- Update own profile
- Change own password

❌ **What Admins Cannot Do:**
- Create other admin accounts (unless added to API)
- Directly modify donor/student profiles (they can only deactivate)
- Access password hashes or reset other admins' passwords

---

## 🛡️ Security Best Practices

### Password Requirements:

✅ **Enforce Strong Passwords:**
- Minimum 8 characters
- Include uppercase letters
- Include lowercase letters
- Include numbers
- Include special characters

Example: `Obayi2025!Secure#Pass`

### Account Security:

1. **Change Default Password Immediately**
   ```sql
   -- First login priority
   UPDATE users
   SET password_hash = '$2a$10$NEW_HASH'
   WHERE email = 'admin@obayi.co';
   ```

2. **Regular Password Rotation**
   - Change passwords every 90 days
   - Never reuse old passwords

3. **Monitor Admin Activity**
   ```sql
   -- Check recent admin logins
   SELECT
     u.email,
     u.last_login_at,
     u.updated_at
   FROM users u
   WHERE u.user_type = 'admin'
   ORDER BY u.updated_at DESC;
   ```

   **Note:** You may need to add `last_login_at` column:
   ```sql
   ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;
   ```

4. **Limit Admin Accounts**
   - Only create admin accounts when necessary
   - Review admin list regularly
   - Deactivate unused accounts

5. **Secure Environment Variables**
   - Never commit `.env` files
   - Use Azure Key Vault for production secrets
   - Rotate JWT_SECRET periodically

6. **Enable Two-Factor Authentication (Future Enhancement)**
   - Consider adding 2FA for admin accounts
   - Use authenticator apps (Google Authenticator, Authy)

7. **Audit Trail (Future Enhancement)**
   - Log all admin actions
   - Track who assigned which donors to students
   - Monitor failed login attempts

---

## 📝 Admin Account Checklist

### When Creating New Admin:

- ✅ Use strong, unique password
- ✅ Verify email address is correct
- ✅ Set appropriate first/last name
- ✅ Add phone number if available
- ✅ Test login immediately
- ✅ Document who created the account and why
- ✅ Inform the new admin to change password on first login

### Regular Maintenance:

- ✅ Review admin list monthly
- ✅ Deactivate accounts of former staff
- ✅ Check for suspicious activity
- ✅ Verify all admins are still authorized
- ✅ Update contact information as needed

---

## 🚨 Emergency Procedures

### Lost All Admin Access:

If all admin accounts are locked:

1. **Access Azure PostgreSQL:**
   - Use Azure Portal → Cloud Shell
   - Or use psql with admin credentials

2. **Reset Default Admin Password:**
   ```bash
   # Generate new hash
   node generate-password.js EmergencyPassword123!

   # Copy the hash, then in psql:
   ```

   ```sql
   UPDATE users
   SET password_hash = '$2a$10$NEW_HASH',
       is_active = TRUE
   WHERE email = 'admin@obayi.co';
   ```

3. **Verify and Login:**
   ```
   Email: admin@obayi.co
   Password: EmergencyPassword123!
   ```

4. **Immediately Change Password** after logging in

### Compromised Admin Account:

1. **Immediately Deactivate:**
   ```sql
   UPDATE users
   SET is_active = FALSE
   WHERE email = 'compromised@obayi.co';
   ```

2. **Invalidate All Sessions:**
   - Change JWT_SECRET in environment variables
   - This logs out all users
   - Generate new secret:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```

3. **Review Activity:**
   ```sql
   SELECT * FROM donor_student_assignments
   WHERE assigned_by_admin_id = (
     SELECT id FROM users WHERE email = 'compromised@obayi.co'
   )
   ORDER BY assigned_at DESC;
   ```

4. **Notify Other Admins**

5. **Create New Admin Account** for affected user (if needed)

---

## 📞 Support

For questions or issues with admin account management:

- **Technical Issues:** Check backend logs
- **Security Concerns:** Contact system administrator immediately
- **Database Issues:** Refer to Azure PostgreSQL documentation

---

**Last Updated:** 2025-01-30
**Version:** 1.0
