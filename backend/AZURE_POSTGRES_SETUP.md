# Azure PostgreSQL Flexible Server Setup Guide
## Free Tier Configuration for Obayi Education Foundation

**Created:** 2025-01-30
**Database:** PostgreSQL 16
**Tier:** Free (B1ms - Burstable)

---

## ✅ Prerequisites

- Azure account with active subscription
- Access to Azure Portal (https://portal.azure.com)
- Basic SQL knowledge
- pgAdmin or Azure Data Studio (optional, for GUI management)

---

## 📝 STEP 1: Create Azure PostgreSQL Flexible Server

### 1.1 Navigate to Azure Portal

1. Go to https://portal.azure.com
2. Sign in with your Azure credentials
3. Click **"Create a resource"** (top left)
4. Search for **"Azure Database for PostgreSQL Flexible Server"**
5. Click **"Create"**

### 1.2 Configure Basics Tab

**Project Details:**
- **Subscription:** Select your subscription
- **Resource Group:**
  - Option A: Select existing (e.g., `obayi-resources`)
  - Option B: Create new → Name: `obayi-database-rg`

**Server Details:**
- **Server name:** `obayi-postgres-server` (must be globally unique)
  - If taken, try: `obayi-db-[your-initials]` or `obayi-postgres-2025`
- **Region:** Select same region as your backend (West Europe recommended)
- **PostgreSQL version:** **16** (recommended) or 15
- **Workload type:** Select **"Development"**

**Authentication:**
- **Authentication method:** Choose **"PostgreSQL authentication only"**
- **Admin username:** `obayiadmin` (write this down!)
- **Password:** Create a strong password
  - Requirements: 8+ characters, uppercase, lowercase, number, special character
  - **IMPORTANT:** Save this password securely!
  - Example: `Obayi2025!Secure#DB`
- **Confirm password:** Re-enter password

Click **"Next: Networking >"**

### 1.3 Configure Networking Tab

**Connectivity method:**
- Select **"Public access (allowed IP addresses)"**

**Firewall rules:**
Click **"+ Add current client IP address"** to add your computer's IP

**Add Azure services:**
- ✅ Check **"Allow public access from any Azure service within Azure to this server"**
- This allows your Azure App Service backend to connect

**Important:** We'll add more IP addresses after creation if needed

Click **"Next: Security >"**

### 1.4 Configure Security Tab

- **High availability:** Leave UNCHECKED (not needed for free tier)
- Leave all other settings as default

Click **"Next: Tags >"** (optional, skip if not needed)

### 1.5 Configure Compute + Storage Tab

**IMPORTANT - Free Tier Configuration:**

Click **"Configure server"**

- **Compute tier:** Select **"Burstable"**
- **Compute size:** Select **"B1ms"** (1 vCore, 2 GiB RAM)
- **Storage:** Leave at **32 GiB** (maximum for free tier)
- **Backup retention:** 7 days (default)
- **Redundancy options:** Locally-redundant backup

Click **"Save"**

### 1.6 Review + Create

1. Click **"Review + create"**
2. Verify the settings:
   - ✅ Pricing: Should show **"Included (750 Hours Free)"**
   - ✅ Compute: B1ms (Burstable)
   - ✅ Storage: 32 GB
3. Click **"Create"**

**Deployment time:** 5-10 minutes

---

## 📝 STEP 2: Configure Firewall Rules

### 2.1 After Deployment Completes

1. Click **"Go to resource"**
2. In the left menu, click **"Networking"** (under Settings)

### 2.2 Add Firewall Rules

**Add these IP addresses:**

1. **Your development machine:**
   - Name: `MyComputer`
   - Click **"+ Add current client IP address"**

2. **Azure App Service Backend:**
   - Name: `AzureAppService`
   - ✅ Check: **"Allow public access from any Azure service within Azure to this server"**

3. **Optional - Allow all IPs (for initial testing only):**
   - Name: `TemporaryTestAccess`
   - Start IP: `0.0.0.0`
   - End IP: `255.255.255.255`
   - ⚠️ **Remove this after testing!**

Click **"Save"**

---

## 📝 STEP 3: Get Connection Details

### 3.1 Copy Connection Information

1. In your PostgreSQL server, click **"Overview"** in the left menu
2. Copy these values:

```
Server name: obayi-postgres-server.postgres.database.azure.com
Admin username: obayiadmin
Database name: postgres (default)
Port: 5432
SSL Mode: require
```

### 3.2 Create Connection String

Format for Node.js:
```
postgresql://obayiadmin:YOUR_PASSWORD@obayi-postgres-server.postgres.database.azure.com:5432/postgres?sslmode=require
```

**Replace:**
- `YOUR_PASSWORD` with your actual password
- `obayi-postgres-server` with your actual server name

---

## 📝 STEP 4: Create Database and Run Schema

### 4.1 Connect Using Azure Cloud Shell

1. In Azure Portal, click the **Cloud Shell icon** (>_) at the top right
2. Select **Bash**
3. Connect to PostgreSQL:

```bash
psql "host=obayi-postgres-server.postgres.database.azure.com port=5432 dbname=postgres user=obayiadmin password=YOUR_PASSWORD sslmode=require"
```

**Alternative: Using psql from your local machine**
```bash
# Install PostgreSQL client first if not installed
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

psql -h obayi-postgres-server.postgres.database.azure.com -U obayiadmin -d postgres
```

### 4.2 Create Obayi Database

Once connected:

```sql
-- Create the database
CREATE DATABASE obayi_db;

-- Switch to the new database
\c obayi_db

-- Verify you're in the correct database
SELECT current_database();
```

### 4.3 Run Schema File

**Option A: Copy and paste the schema**
1. Open `backend/schema-postgres.sql` file
2. Copy the entire contents
3. Paste into the psql terminal
4. Press Enter

**Option B: Upload and run from Azure Cloud Shell**
```bash
# Upload schema-postgres.sql using Cloud Shell file manager
# Then run:
psql "host=obayi-postgres-server.postgres.database.azure.com port=5432 dbname=obayi_db user=obayiadmin password=YOUR_PASSWORD sslmode=require" -f schema-postgres.sql
```

### 4.4 Verify Schema Creation

```sql
-- List all tables
\dt

-- You should see:
-- users
-- donors
-- students
-- donor_student_assignments
-- student_documents
-- password_reset_tokens

-- Check users table
SELECT * FROM users;

-- You should see the default admin user
```

---

## 📝 STEP 5: Update Backend Configuration

### 5.1 Install PostgreSQL Library

```bash
cd c:\Dev\obayi\backend
npm install pg
```

### 5.2 Update Environment Variables

Create or update `.env` file in backend folder:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL Connection
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://obayiadmin:YOUR_PASSWORD@obayi-postgres-server.postgres.database.azure.com:5432/obayi_db?sslmode=require

# Or separate variables:
DB_HOST=obayi-postgres-server.postgres.database.azure.com
DB_PORT=5432
DB_NAME=obayi_db
DB_USER=obayiadmin
DB_PASSWORD=YOUR_PASSWORD
DB_SSL=true

# JWT Secret (generate a secure one!)
JWT_SECRET=your-secure-jwt-secret-here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER_NAME=obayi-files

# Email Service (Azure Logic App)
LOGIC_APP_WEBHOOK_URL=your-logic-app-url
```

### 5.3 Update Azure App Service Configuration

1. Go to Azure Portal → App Services → obayibackend-b2e8bjfkd8gpbeg6
2. Click **"Configuration"** → **"Application settings"**
3. Add these new settings:

```
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://obayiadmin:YOUR_PASSWORD@obayi-postgres-server.postgres.database.azure.com:5432/obayi_db?sslmode=require
```

4. Click **"Save"** → **"Continue"**

---

## 📝 STEP 6: Test Connection

### 6.1 Create Test Script

Create `backend/test-postgres.js`:

```javascript
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL ||
  'postgresql://obayiadmin:YOUR_PASSWORD@obayi-postgres-server.postgres.database.azure.com:5432/obayi_db?sslmode=require';

async function testConnection() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');

    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);

    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    console.log('Users count:', usersResult.rows[0].count);

    await client.end();
    console.log('✅ Test complete!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

### 6.2 Run Test

```bash
cd c:\Dev\obayi\backend
node test-postgres.js
```

Expected output:
```
Connecting to PostgreSQL...
✅ Connected successfully!
PostgreSQL version: PostgreSQL 16.x on x86_64-pc-linux-gnu...
Users count: 1
✅ Test complete!
```

---

## 🔐 STEP 7: Manage Admin Accounts

### 7.1 Default Admin Account

The schema creates one default admin:
- **Email:** admin@obayi.co
- **Password:** admin123
- **⚠️ CHANGE THIS IMMEDIATELY!**

### 7.2 Add New Admin Account (Using SQL)

Connect to database and run:

```sql
-- First, create a password hash
-- Use bcrypt with 10 rounds (same as your app)
-- You can generate this from your app or use an online bcrypt generator

-- Example: Adding a new admin
INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone)
VALUES (
  'your.email@obayi.co',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',  -- Generate this!
  'admin',
  'Your',
  'Name',
  '+234XXXXXXXXXX'
);
```

### 7.3 Generate Password Hash (Node.js Method)

Create `backend/generate-password.js`:

```javascript
const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'defaultPassword123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this hash in your SQL INSERT statement');
});
```

Run it:
```bash
node generate-password.js YourSecurePassword123
```

### 7.4 Add Admin via Backend API (After Backend is Running)

```bash
# Using curl or Postman
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@obayi.co",
    "password": "SecurePassword123!",
    "userType": "admin",
    "firstName": "New",
    "lastName": "Admin",
    "phone": "+234XXXXXXXXXX"
  }'
```

### 7.5 List All Admin Accounts

```sql
SELECT
  id,
  email,
  first_name,
  last_name,
  phone,
  is_active,
  created_at
FROM users
WHERE user_type = 'admin'
ORDER BY created_at DESC;
```

### 7.6 Deactivate Admin Account

```sql
-- Deactivate (soft delete)
UPDATE users
SET is_active = FALSE
WHERE email = 'admin@obayi.co';

-- Reactivate
UPDATE users
SET is_active = TRUE
WHERE email = 'admin@obayi.co';
```

### 7.7 Change Admin Password

```sql
-- Update password hash
UPDATE users
SET password_hash = '$2a$10$NEW_HASH_HERE'
WHERE email = 'admin@obayi.co';
```

---

## 📊 STEP 8: Monitoring and Maintenance

### 8.1 View Database Metrics

1. Go to PostgreSQL server in Azure Portal
2. Click **"Metrics"** in left menu
3. Useful metrics:
   - CPU percent
   - Memory percent
   - Storage used
   - Active connections
   - Failed connections

### 8.2 Check Free Tier Usage

1. Go to **"Overview"**
2. Look for **"Compute hours used"**
3. Free tier: 750 hours/month (24/7 uptime = 720 hours)
4. You get **30 extra hours buffer**

### 8.3 Enable Slow Query Logging

```sql
-- Enable logging
ALTER DATABASE obayi_db SET log_min_duration_statement = 1000;

-- View slow queries later
SELECT * FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 8.4 Backup Strategy

**Automated backups:**
- Azure PostgreSQL includes automatic backups
- Retention: 7 days (default)
- Point-in-time restore available

**Manual backup:**
```bash
# Using pg_dump
pg_dump -h obayi-postgres-server.postgres.database.azure.com \
  -U obayiadmin \
  -d obayi_db \
  -F c \
  -f obayi_backup_$(date +%Y%m%d).dump
```

---

## 🔧 Troubleshooting

### Issue: Cannot connect to database

**Solution 1: Check firewall rules**
- Ensure your IP is added in Networking settings
- Check "Allow Azure services" is enabled

**Solution 2: Verify connection string**
- Check server name is correct
- Verify username format: `username` (not `username@servername`)
- Ensure SSL mode is set

**Solution 3: Test with psql**
```bash
psql -h your-server.postgres.database.azure.com -U obayiadmin -d postgres
# Enter password when prompted
```

### Issue: "SSL connection required"

**Solution:**
Always include `sslmode=require` in connection string:
```
?sslmode=require
```

In Node.js:
```javascript
ssl: { rejectUnauthorized: false }
```

### Issue: "Password authentication failed"

**Solution:**
- Verify password is correct
- Check if special characters need URL encoding
- Try resetting password in Azure Portal

### Issue: Free tier hours exceeded

**Solution:**
- Check usage in Azure Portal
- Free tier: 750 hours/month (enough for 24/7)
- If exceeded, you'll be charged standard rates
- Consider scaling down or stopping server when not needed

---

## 📚 Useful Commands

### PostgreSQL Commands

```sql
-- List all databases
\l

-- Connect to database
\c obayi_db

-- List tables
\dt

-- Describe table
\d users

-- List users/roles
\du

-- Show current user
SELECT current_user;

-- Show current database
SELECT current_database();

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Count records in all tables
SELECT
  schemaname,
  tablename,
  (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
FROM (
  SELECT
    table_name,
    table_schema,
    query_to_xml(format('select count(*) as cnt from %I.%I', table_schema, table_name), false, true, '') as xml_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
) t;
```

---

## 🎉 Next Steps

After completing setup:

1. ✅ Test connection from your local backend
2. ✅ Test connection from Azure App Service
3. ✅ Change default admin password
4. ✅ Create additional admin accounts if needed
5. ✅ Update backend code to use PostgreSQL
6. ✅ Migrate existing SQLite data (if any)
7. ✅ Test all API endpoints
8. ✅ Deploy to production
9. ✅ Monitor performance and usage

---

## 📞 Support

- **Azure PostgreSQL Docs:** https://learn.microsoft.com/en-us/azure/postgresql/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Issue Tracker:** Create issues in your repository

---

## 🔐 Security Checklist

- ✅ Strong admin password set
- ✅ JWT_SECRET changed from default
- ✅ Firewall rules configured (not wide open)
- ✅ SSL/TLS enabled
- ✅ Regular backups enabled
- ✅ Monitor failed login attempts
- ✅ Review and remove test firewall rules
- ✅ Use environment variables for secrets (never commit passwords)

---

**Congratulations! Your Azure PostgreSQL database is ready to use!** 🎊
