# PostgreSQL Migration Quick Start Guide
## From SQLite to Azure PostgreSQL - Obayi Education Foundation

**Created:** 2025-01-30

---

## 📚 Overview

This guide provides a quick reference for migrating your Obayi Education Foundation backend from SQLite to Azure PostgreSQL Free Tier.

**Benefits:**
- ✅ **FREE** - Azure PostgreSQL Free Tier (750 hours/month)
- ✅ **Persistent** - No more data loss on app restarts
- ✅ **Scalable** - Production-ready database
- ✅ **Reliable** - Automated backups included

---

## 📁 Files Created

Your migration package includes:

| File | Description |
|------|-------------|
| `schema-postgres.sql` | PostgreSQL schema (equivalent to schema.sql) |
| `AZURE_POSTGRES_SETUP.md` | Complete Azure Portal setup guide |
| `config/database-postgres.js` | PostgreSQL database connection config |
| `migrate-to-postgres.js` | Data migration script from SQLite |
| `generate-password.js` | Admin password hash generator |
| `test-postgres.js` | Connection and schema verification |
| `ADMIN_MANAGEMENT.md` | Admin account management guide |
| `POSTGRES_MIGRATION_QUICKSTART.md` | This file |

---

## 🚀 Quick Start (30 Minutes)

### Phase 1: Azure Setup (15 minutes)

Follow the complete guide: **AZURE_POSTGRES_SETUP.md**

**Quick steps:**
1. Azure Portal → Create Resource → Azure Database for PostgreSQL Flexible Server
2. Configure:
   - **Server name:** obayi-postgres-server
   - **Region:** West Europe (same as backend)
   - **Workload type:** Development
   - **Compute:** Burstable B1ms (FREE)
   - **Storage:** 32 GB
   - **Admin username:** obayiadmin
   - **Password:** (secure password - save it!)
3. Configure Networking:
   - Add your IP address
   - Allow Azure services
4. Deploy (5-10 minutes wait)

**Save these details:**
```
Server: obayi-postgres-server.postgres.database.azure.com
Database: obayi_db
Username: obayiadmin
Password: <your-password>
Port: 5432
```

---

### Phase 2: Database Schema (5 minutes)

1. **Connect to PostgreSQL:**

   Using Azure Cloud Shell:
   ```bash
   psql "host=obayi-postgres-server.postgres.database.azure.com port=5432 dbname=postgres user=obayiadmin password=YOUR_PASSWORD sslmode=require"
   ```

2. **Create Database:**
   ```sql
   CREATE DATABASE obayi_db;
   \c obayi_db
   ```

3. **Deploy Schema:**

   Copy contents of `backend/schema-postgres.sql` and paste into psql, or:

   ```bash
   psql "host=obayi-postgres-server.postgres.database.azure.com port=5432 dbname=obayi_db user=obayiadmin password=YOUR_PASSWORD sslmode=require" -f schema-postgres.sql
   ```

4. **Verify:**
   ```sql
   \dt  -- Should show 6 tables
   SELECT * FROM users;  -- Should show default admin
   ```

---

### Phase 3: Backend Configuration (5 minutes)

1. **Install PostgreSQL Driver:**
   ```bash
   cd c:\Dev\obayi\backend
   npm install pg
   ```

2. **Update `.env` file:**
   ```env
   # Database Configuration
   DATABASE_TYPE=postgres
   DATABASE_URL=postgresql://obayiadmin:YOUR_PASSWORD@obayi-postgres-server.postgres.database.azure.com:5432/obayi_db?sslmode=require

   # Or use separate variables:
   DB_HOST=obayi-postgres-server.postgres.database.azure.com
   DB_PORT=5432
   DB_NAME=obayi_db
   DB_USER=obayiadmin
   DB_PASSWORD=YOUR_PASSWORD
   DB_SSL=true

   # Existing variables (keep these)
   JWT_SECRET=your-secure-jwt-secret
   FRONTEND_URL=http://localhost:5173
   AZURE_STORAGE_CONNECTION_STRING=your-connection-string
   AZURE_STORAGE_CONTAINER_NAME=obayi-files
   LOGIC_APP_WEBHOOK_URL=your-logic-app-url
   ```

3. **Test Connection:**
   ```bash
   node test-postgres.js
   ```

   Expected output:
   ```
   ✅ Connected successfully!
   ✅ ALL TESTS PASSED!
   ```

---

### Phase 4: Migrate Data (5 minutes - Optional)

**Only if you have existing data in SQLite:**

1. **Run Migration Script:**
   ```bash
   node migrate-to-postgres.js
   ```

2. **Review Migration Stats:**
   ```
   ✅ Migrated X users
   ✅ Migrated Y donors
   ✅ Migrated Z students
   ```

3. **Verify in PostgreSQL:**
   ```sql
   SELECT
     (SELECT COUNT(*) FROM users) as users,
     (SELECT COUNT(*) FROM donors) as donors,
     (SELECT COUNT(*) FROM students) as students;
   ```

---

### Phase 5: Production Deployment

1. **Update Azure App Service:**

   Azure Portal → App Services → obayibackend-b2e8bjfkd8gpbeg6 → Configuration

   **Add/Update:**
   ```
   DATABASE_TYPE=postgres
   DATABASE_URL=postgresql://obayiadmin:PASSWORD@obayi-postgres-server.postgres.database.azure.com:5432/obayi_db?sslmode=require
   ```

   Click Save → Continue

2. **Update Backend Code (if needed):**

   If your `backend/config/database.js` doesn't auto-detect PostgreSQL:

   ```javascript
   // Option 1: Use DATABASE_TYPE
   if (process.env.DATABASE_TYPE === 'postgres') {
     module.exports = require('./database-postgres');
   } else {
     module.exports = require('./database'); // SQLite
   }

   // Option 2: Use DATABASE_URL presence
   if (process.env.DATABASE_URL) {
     module.exports = require('./database-postgres');
   } else {
     module.exports = require('./database');
   }
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "feat: migrate to Azure PostgreSQL"
   git push
   ```

4. **Verify Deployment:**
   - Check Azure App Service logs
   - Test API endpoints
   - Verify database connections

---

## 🔐 Admin Account Setup

### Change Default Password

**Default admin account:**
```
Email: admin@obayi.co
Password: admin123
```

**⚠️ CHANGE IMMEDIATELY!**

#### Option 1: Via Frontend
1. Login with default credentials
2. Go to Profile/Settings
3. Change password

#### Option 2: Via SQL

```bash
# Generate hash
node generate-password.js YourNewSecurePassword123!

# Copy the hash, then in psql:
```

```sql
UPDATE users
SET password_hash = '$2a$10$HASH_FROM_ABOVE'
WHERE email = 'admin@obayi.co';
```

### Create Additional Admins

```bash
# Generate password hash
node generate-password.js AdminPassword123!

# In psql:
```

```sql
INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone)
VALUES (
  'newadmin@obayi.co',
  '$2a$10$HASH_HERE',
  'admin',
  'New',
  'Admin',
  '+234XXXXXXXXXX'
);
```

**See ADMIN_MANAGEMENT.md for complete admin guide.**

---

## ✅ Verification Checklist

After migration, verify:

- [ ] Test PostgreSQL connection: `node test-postgres.js`
- [ ] All 6 tables exist: users, donors, students, etc.
- [ ] Admin account exists and is active
- [ ] Data migrated (if applicable)
- [ ] Backend connects to PostgreSQL
- [ ] API endpoints work (test login, register)
- [ ] Azure App Service environment variables updated
- [ ] Default admin password changed
- [ ] Azure firewall rules configured
- [ ] SSL/TLS enabled
- [ ] Backups enabled (automatic in Azure)

---

## 🔧 Common Commands

### Database Connection

```bash
# Connect to database
psql "host=obayi-postgres-server.postgres.database.azure.com port=5432 dbname=obayi_db user=obayiadmin sslmode=require"

# Or with password inline (not recommended for production)
PGPASSWORD=your_password psql -h obayi-postgres-server.postgres.database.azure.com -U obayiadmin -d obayi_db
```

### Useful SQL Queries

```sql
-- List all tables
\dt

-- Show table structure
\d users

-- Count all records
SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM donors) as donors,
  (SELECT COUNT(*) FROM students) as students,
  (SELECT COUNT(*) FROM donor_student_assignments) as assignments,
  (SELECT COUNT(*) FROM student_documents) as documents;

-- List all admins
SELECT id, email, first_name, last_name, is_active
FROM users
WHERE user_type = 'admin';

-- Check database size
SELECT pg_size_pretty(pg_database_size('obayi_db'));

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backend Testing

```bash
# Test PostgreSQL connection
node test-postgres.js

# Generate password hash
node generate-password.js YourPassword123!

# Run migration (if needed)
node migrate-to-postgres.js

# Start backend
npm start
```

---

## 🐛 Troubleshooting

### Cannot Connect to PostgreSQL

**Problem:** Connection timeout or refused

**Solutions:**
1. Check Azure firewall rules (add your IP)
2. Verify "Allow Azure services" is enabled
3. Check connection string format
4. Verify SSL mode: `sslmode=require`

**Test:**
```bash
psql "host=obayi-postgres-server.postgres.database.azure.com port=5432 dbname=postgres user=obayiadmin sslmode=require"
```

---

### Password Authentication Failed

**Problem:** `password authentication failed for user "obayiadmin"`

**Solutions:**
1. Verify password is correct
2. Check for special characters (URL encode if needed)
3. Try resetting password in Azure Portal
4. Ensure username is correct (no `@servername` suffix for Flexible Server)

---

### Tables Not Found

**Problem:** `relation "users" does not exist`

**Solutions:**
1. Verify you're connected to correct database: `SELECT current_database();`
2. Switch to correct database: `\c obayi_db`
3. Run schema file: `psql ... -f schema-postgres.sql`
4. Check if tables exist: `\dt`

---

### Migration Errors

**Problem:** Foreign key constraint violations during migration

**Solutions:**
1. Check migration runs tables in correct order (users → donors/students → assignments)
2. Verify source SQLite data integrity
3. Check for orphaned records
4. Review migration script logs

---

### Backend Won't Start

**Problem:** Backend fails to start after PostgreSQL migration

**Solutions:**
1. Check DATABASE_URL or DB_* environment variables
2. Verify `pg` package is installed: `npm install pg`
3. Check database connection config
4. Review backend logs for specific errors
5. Test connection: `node test-postgres.js`

---

## 📊 Cost Monitoring

**Free Tier Limits:**
- **750 hours/month** = 31.25 days (more than enough for 24/7)
- **32 GB storage** (included)
- **Backup retention:** 7 days (included)

**Check Usage:**
1. Azure Portal → PostgreSQL server
2. Overview → Compute hours used
3. Metrics → CPU, Memory, Storage

**Alerts:**
- Set up alerts at 700 hours (before hitting limit)
- Monitor storage usage approaching 32 GB
- Set billing alerts in Azure Cost Management

---

## 🔐 Security Checklist

After setup:

- [ ] Changed default admin password
- [ ] JWT_SECRET is strong and secure
- [ ] Firewall rules are restrictive (not 0.0.0.0/0)
- [ ] SSL/TLS enabled (sslmode=require)
- [ ] Environment variables not committed to git
- [ ] Azure Key Vault for production secrets (recommended)
- [ ] Regular password rotation policy
- [ ] Monitor failed login attempts
- [ ] Review admin accounts regularly

---

## 📞 Support Resources

- **Azure PostgreSQL Docs:** https://learn.microsoft.com/en-us/azure/postgresql/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Node.js pg Driver:** https://node-postgres.com/
- **This Repository:** Check README and documentation files

---

## 🎯 Next Steps

After completing migration:

1. ✅ Test all API endpoints thoroughly
2. ✅ Update API documentation (if exists)
3. ✅ Train team on PostgreSQL differences
4. ✅ Set up monitoring and alerts
5. ✅ Create backup/restore procedures
6. ✅ Document connection strings securely
7. ✅ Schedule regular security audits
8. ✅ Plan for scaling (when needed)

---

## 📝 Key Differences: SQLite vs PostgreSQL

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Connection** | File-based | Network-based |
| **Concurrency** | Limited writes | Multiple concurrent writes |
| **Data Types** | Flexible | Strict type system |
| **AUTO_INCREMENT** | AUTOINCREMENT | SERIAL/BIGSERIAL |
| **DATETIME** | TEXT/INTEGER | TIMESTAMP |
| **Boolean** | 0/1 | TRUE/FALSE |
| **LIMIT** | LIMIT n OFFSET m | LIMIT n OFFSET m (same) |
| **Date Functions** | date('now') | CURRENT_TIMESTAMP |
| **Upsert** | INSERT OR REPLACE | ON CONFLICT DO UPDATE |
| **String Concat** | \|\| | \|\| (same) |

---

## 🎉 Success!

Congratulations on migrating to Azure PostgreSQL! Your database is now:

- ✅ **Persistent** - Data survives app restarts
- ✅ **Scalable** - Ready for production growth
- ✅ **Reliable** - Automatic backups included
- ✅ **FREE** - No cost for 750 hours/month

**Questions?** Refer to the detailed guides:
- Setup: `AZURE_POSTGRES_SETUP.md`
- Admin: `ADMIN_MANAGEMENT.md`
- Migration: `migrate-to-postgres.js`

---

**Last Updated:** 2025-01-30
**Version:** 1.0
