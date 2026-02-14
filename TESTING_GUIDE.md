# Complete Testing Guide - Obayi Platform

## Prerequisites
- Backend deployed to Azure App Service
- Frontend deployed and accessible
- Admin account: `admin@obayi.co`
- Test accounts created in database

---

## Step 1: Verify Database Connection

### Test Database Connectivity
```bash
cd backend
node test-postgres.js
```

**Expected Result:**
- ✅ Connected to Azure PostgreSQL
- ✅ Shows total users, donors, students
- ✅ No errors

---

## Step 2: Verify Test Data Exists

### Check Users in Database
```bash
cd backend
node -e "
require('dotenv').config();
const db = require('./config/database');
(async () => {
    const users = await db.all('SELECT id, email, user_type FROM users ORDER BY id');
    console.log('Users in database:');
    users.forEach(u => console.log(\`  - \${u.email} (\${u.user_type})\`));
    await db.close();
})();
"
```

**Expected Result:**
- Should see at least 6 users (1 admin, 2 donors, 3 students)

---

## Step 3: Test Backend API Endpoints

### 3.1 Test Health Check
```bash
curl https://obayi.azurewebsites.net/
```

**Expected Result:**
```json
{
  "message": "Obayi Education Foundation API",
  "version": "1.0.1",
  "status": "running"
}
```

### 3.2 Test Login Endpoint
```bash
curl -X POST https://obayi.azurewebsites.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@obayi.co\",\"password\":\"YOUR_PASSWORD\"}"
```

**Expected Result:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@obayi.co",
    "userType": "admin"
  }
}
```

### 3.3 Test Admin Donors Endpoint
First, login and save the token, then:
```bash
curl https://obayi.azurewebsites.net/api/admin/donors \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Result:**
- Array of 2 donors with their details
- Each donor should show `assigned_students` count

### 3.4 Test Admin Students Endpoint
```bash
curl https://obayi.azurewebsites.net/api/admin/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Result:**
- Array of 3 students with their details
- Each student should show `assigned_donors` count

---

## Step 4: Test Frontend - Admin Dashboard

### 4.1 Login as Admin
1. Open browser and go to: `https://your-frontend-url.com/login`
2. Enter credentials:
   - Email: `admin@obayi.co`
   - Password: (your admin password)
3. Click "Login"

**Expected Result:**
- ✅ Redirected to admin dashboard
- ✅ No error messages

### 4.2 Check Donors List
1. Navigate to "Donors" section in admin dashboard
2. Look for the donors list

**Expected Result:**
- ✅ Should see 2 donors:
  - John Smith (donor1@test.com) - Smith Foundation
  - Sarah Johnson (donor2@test.com) - Johnson Charity
- ✅ Each donor shows number of assigned students
- ✅ Can click on donor to view details

**If you DON'T see donors:**
- Open browser DevTools (F12)
- Go to Console tab - check for errors
- Go to Network tab - find the request to `/api/admin/donors`
- Check the response status and data

### 4.3 Check Students List
1. Navigate to "Students" section in admin dashboard
2. Look for the students list

**Expected Result:**
- ✅ Should see 3 students:
  - Ahmed Obasanjo (student1@test.com) - Lagos High School
  - Fatima Adeyemi (student2@test.com) - Abuja Secondary School
  - Chioma Nwosu (student3@test.com) - Port Harcourt Academy
- ✅ Each student shows number of assigned donors
- ✅ Can click on student to view details

### 4.4 Check Assignments
1. Navigate to "Assignments" section
2. Look for existing assignments

**Expected Result:**
- ✅ Should see 4 assignments:
  - John Smith → Ahmed Obasanjo
  - John Smith → Fatima Adeyemi
  - Sarah Johnson → Fatima Adeyemi
  - Sarah Johnson → Chioma Nwosu

### 4.5 Create New Assignment
1. Click "Create Assignment" or similar button
2. Select a donor from dropdown
3. Select a student from dropdown
4. Add optional notes
5. Click "Save" or "Create"

**Expected Result:**
- ✅ Assignment created successfully
- ✅ Shows in assignments list
- ✅ Student's donor count increases
- ✅ Donor's student count increases

---

## Step 5: Test Frontend - Donor Dashboard

### 5.1 Login as Donor
1. Logout from admin account
2. Go to `/login`
3. Enter donor credentials:
   - Email: `donor1@test.com`
   - Password: `donor123`
4. Click "Login"

**Expected Result:**
- ✅ Redirected to donor dashboard
- ✅ No error messages

### 5.2 View Assigned Students
1. Look for "My Students" or similar section
2. Check the list of assigned students

**Expected Result:**
- ✅ Donor 1 (John Smith) should see 2 students:
  - Ahmed Obasanjo - Lagos High School (Grade 10)
  - Fatima Adeyemi - Abuja Secondary School (Grade 11)
- ✅ Each student shows their details
- ✅ Shows assignment notes if any
- ✅ Shows total number of donors supporting each student

**If you DON'T see students:**
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for `/api/donors/students` request
- Verify response has data

### 5.3 View Student Details
1. Click on a student card/name
2. View their profile

**Expected Result:**
- ✅ Shows student's full information
- ✅ Shows school, grade, bio
- ✅ Shows documents if any uploaded

---

## Step 6: Test Frontend - Student Dashboard

### 6.1 Login as Student
1. Logout from donor account
2. Go to `/login`
3. Enter student credentials:
   - Email: `student2@test.com`
   - Password: `student123`
4. Click "Login"

**Expected Result:**
- ✅ Redirected to student dashboard
- ✅ No error messages

### 6.2 View Assigned Donors
1. Look for "My Donors" or "My Sponsors" section
2. Check the list of assigned donors

**Expected Result:**
- ✅ Student 2 (Fatima) should see 2 donors:
  - John Smith - Smith Foundation
  - Sarah Johnson - Johnson Charity
- ✅ Each donor shows their organization
- ✅ Shows assignment notes
- ✅ Shows donor contact information

**If you DON'T see donors:**
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for `/api/students/donors` request
- Verify response has data

---

## Step 7: Test User Registration

### 7.1 Register New Donor
1. Logout from all accounts
2. Go to `/register`
3. Fill in donor registration form:
   - Email: `testdonor@example.com`
   - Password: `password123`
   - First Name: `Test`
   - Last Name: `Donor`
   - User Type: `Donor`
   - Organization: `Test Organization`
   - Phone: `+1234567890`
4. Click "Register"

**Expected Result:**
- ✅ Registration successful message
- ✅ Redirected to login or donor dashboard
- ✅ Can login with new credentials
- ✅ User appears in admin dashboard

**If registration fails:**
- Check browser console for errors
- Check Network tab for `/api/auth/register` request
- Look for specific error message

### 7.2 Register New Student
1. Logout
2. Go to `/register`
3. Fill in student registration form:
   - Email: `teststudent@example.com`
   - Password: `password123`
   - First Name: `Test`
   - Last Name: `Student`
   - User Type: `Student`
   - School: `Test School`
   - Grade: `Grade 10`
   - Phone: `+1234567891`
4. Click "Register"

**Expected Result:**
- ✅ Registration successful message
- ✅ Can login with new credentials
- ✅ Student appears in admin dashboard

---

## Step 8: Troubleshooting Common Issues

### Issue: "Can't see donors/students in admin dashboard"

**Check 1: Backend is running**
```bash
curl https://obayi.azurewebsites.net/
```

**Check 2: API returns data**
```bash
# Login first to get token
TOKEN=$(curl -s -X POST https://obayi.azurewebsites.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@obayi.co\",\"password\":\"YOUR_PASSWORD\"}" \
  | jq -r '.token')

# Test donors endpoint
curl -s https://obayi.azurewebsites.net/api/admin/donors \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Check 3: Database has data**
```bash
cd backend
node -e "
require('dotenv').config();
const db = require('./config/database');
(async () => {
    const donors = await db.all('SELECT COUNT(*) as count FROM donors');
    const students = await db.all('SELECT COUNT(*) as count FROM students');
    console.log('Donors:', donors[0].count);
    console.log('Students:', students[0].count);
    await db.close();
})();
"
```

**Check 4: Clear browser cache**
- Press `Ctrl + Shift + Delete`
- Clear cached images and files
- Try in Incognito mode

**Check 5: Check frontend API URL**
- Verify frontend is pointing to correct backend URL
- Check `.env` file in frontend

---

### Issue: "Login not working"

**Check 1: User exists in database**
```bash
cd backend
node -e "
require('dotenv').config();
const db = require('./config/database');
(async () => {
    const user = await db.get('SELECT email, user_type FROM users WHERE email = \$1', ['admin@obayi.co']);
    console.log('User:', user);
    await db.close();
})();
"
```

**Check 2: Password is correct**
- Try resetting password if needed
- Check for typos

**Check 3: CORS issues**
- Check browser console for CORS errors
- Verify backend CORS is configured correctly

---

### Issue: "Registration creates user but no profile"

**This was the original bug - should be fixed now**

Verify fix is deployed:
```bash
cd backend
grep -n "RETURNING id" routes/auth.js
```

Should show:
- Line 74: INSERT INTO users ... RETURNING id
- Line 83: INSERT INTO donors ... RETURNING id
- Line 90: INSERT INTO students ... RETURNING id

---

## Step 9: Verify All Fixes Are Deployed

### Check Git Commits
```bash
cd backend
git log --oneline -5
```

**Expected commits:**
- `f73d1fa` - fix: add RETURNING id to all INSERT statements
- `58e17f7` - feat: add endpoint for students to view assigned donors
- `75c6938` - fix: resolve PostgreSQL GROUP BY issue
- `8a98c73` - fix: complete PostgreSQL migration
- `9549575` - feat: migrate from SQLite to Azure PostgreSQL

### Check Azure Deployment
1. Go to Azure Portal
2. Navigate to App Service
3. Check "Deployment Center" section
4. Verify latest commit is deployed
5. Check logs for any errors

### Restart Backend (if needed)
1. In Azure Portal → App Service
2. Click "Restart"
3. Wait 2-3 minutes
4. Test again

---

## Step 10: Production Readiness Checklist

- [ ] Database connection working
- [ ] Test data visible in database
- [ ] Admin can login
- [ ] Admin can see all donors
- [ ] Admin can see all students
- [ ] Admin can see all assignments
- [ ] Admin can create new assignments
- [ ] Donors can login
- [ ] Donors can see assigned students
- [ ] Students can login
- [ ] Students can see assigned donors
- [ ] New donors can register
- [ ] New students can register
- [ ] Registration creates both user and profile
- [ ] All API endpoints return 200 status
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## Quick Test Script

Run this to verify everything at once:

```bash
cd backend
node -e "
require('dotenv').config();
const db = require('./config/database');

(async () => {
    console.log('🔍 COMPREHENSIVE SYSTEM CHECK\n');

    // Check users
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    console.log(\`✓ Total Users: \${userCount.count}\`);

    // Check donors
    const donorCount = await db.get('SELECT COUNT(*) as count FROM donors');
    console.log(\`✓ Total Donors: \${donorCount.count}\`);

    // Check students
    const studentCount = await db.get('SELECT COUNT(*) as count FROM students');
    console.log(\`✓ Total Students: \${studentCount.count}\`);

    // Check assignments
    const assignmentCount = await db.get('SELECT COUNT(*) as count FROM donor_student_assignments WHERE is_active = TRUE');
    console.log(\`✓ Active Assignments: \${assignmentCount.count}\`);

    // Check if RETURNING id is in auth.js
    const fs = require('fs');
    const authContent = fs.readFileSync('./routes/auth.js', 'utf8');
    const hasReturningId = authContent.includes('RETURNING id');
    console.log(\`✓ Auth.js has RETURNING id: \${hasReturningId ? 'YES' : 'NO'}\`);

    console.log('\n✅ System check complete!\n');

    if (userCount.count < 6) {
        console.log('⚠️  Warning: Expected at least 6 users (1 admin, 2 donors, 3 students)');
    }

    await db.close();
})();
"
```

---

## Support

If issues persist after following all steps:

1. **Check backend logs in Azure:**
   - Azure Portal → App Service → Log stream
   - Look for errors

2. **Check database connectivity:**
   - Verify .env variables are correct
   - Test connection with test-postgres.js

3. **Check frontend configuration:**
   - Verify API URL in frontend .env
   - Check CORS settings in backend

4. **Restart everything:**
   - Restart Azure App Service
   - Clear browser cache
   - Try incognito mode

---

**Last Updated:** 2026-02-14
