# Obayi Project Context

> **Last Updated:** 2025-10-16
> **Purpose:** This file maintains context across Claude sessions to provide continuity and better assistance.

## Project Overview

**Name:** Obayi - Student-Donor Matching Platform
**Type:** Full-stack web application
**Purpose:** Connect donors with students who need educational support, track donations, and manage student documents

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v7
- **Backend:** Node.js + Express 4.18
- **Database:** SQLite with WAL mode
- **Authentication:** JWT (jsonwebtoken)
- **File Storage:** Azure Blob Storage + Sharp image optimization
- **Security:** bcryptjs password hashing
- **Icons:** Lucide React

**Repository:** https://github.com/olucodehub/obayi

**Deployment:**
- Frontend: GitHub Pages (https://olucodehub.github.io/obayi)
- Backend: Port 5000 (default)

**Core Features:**
1. Multi-role authentication (Admin, Donor, Student)
2. Donor-student matching system
3. Student document management (certificates, receipts)
4. Admin analytics dashboard with network visualization
5. Profile management for all user types
6. Achievement tracking for students
7. Document upload/download with Azure storage

---

## Recent Work & Context

### Admin Login Functionality (Recent)
Based on git history, recent work includes:
- Fixed admin login functionality
- Added debug logging for admin login issues
- Cleaned up debug code from login page
- Added admin account creation helper
- Dashboard padding fixes

**Modified Files:**
- `backend/database.sqlite` (and related WAL/SHM files)
- `backend/package-lock.json`

---

## Project Structure

```
obayi/
├── .claude/                    # Claude session context files
│   ├── context.md              # Project understanding & session history
│   └── requests.md             # Task management & requests
│
├── backend/                    # Express API server
│   ├── config/
│   │   └── database.js         # SQLite connection wrapper
│   ├── middleware/
│   │   ├── auth.js             # JWT auth & RBAC middleware
│   │   └── upload.js           # Multer file upload config
│   ├── routes/
│   │   ├── auth.js             # Login, register, password reset
│   │   ├── admin.js            # Admin management endpoints
│   │   ├── donors.js           # Donor profile & student viewing
│   │   ├── students.js         # Student endpoints (v1 - base64)
│   │   └── students_v2.js      # Student endpoints (v2 - Azure)
│   ├── services/
│   │   └── azureBlobService.js # Azure Blob Storage integration
│   ├── scripts/
│   │   └── initDb.js           # Database initialization script
│   ├── server.js               # Express app setup
│   ├── schema.sql              # Database schema
│   ├── database.sqlite         # SQLite database file
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variable template
│
├── src/                        # React frontend source
│   ├── components/             # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx  # Route protection HOC
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx     # Global auth state management
│   ├── pages/
│   │   ├── auth/               # Login, Register
│   │   ├── dashboards/         # Role-specific dashboards
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   └── DonorDashboard.tsx
│   │   ├── programs/           # Program pages
│   │   └── Dashboard.tsx       # Dashboard router
│   ├── services/               # API services
│   │   ├── api.ts              # Axios instance
│   │   ├── serviceFactory.ts   # Service factory pattern
│   │   ├── productionApi.ts    # Production API services
│   │   └── ...
│   ├── utils/
│   │   └── auth.ts             # LocalStorage auth (demo mode)
│   ├── types/
│   │   └── auth.ts             # TypeScript definitions
│   ├── hooks/
│   │   └── usePageTitle.ts
│   ├── config/
│   │   └── appConfig.ts        # App configuration
│   ├── App.tsx                 # Main app with AuthProvider
│   ├── router.tsx              # Route definitions
│   └── main.tsx                # React entry point
│
├── public/                     # Static assets
├── package.json                # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
└── tailwind.config.js          # TailwindCSS config
```

---

## Active Issues & TODOs

<!-- Add current issues, bugs, or features being worked on -->

### Current Session
- Setting up context management system

---

## Important Notes & Decisions

### Architecture Patterns

1. **Dual-Mode Operation:**
   - App supports two modes: `localStorage` (demo) and `api` (production)
   - Configured via `APP_CONFIG.AUTH_MODE` in frontend
   - Service factory pattern switches between implementations seamlessly

2. **Service Factory Pattern:**
   - Central service abstraction in `serviceFactory.ts`
   - Allows switching between localStorage and API services without changing component code
   - Used for: Auth, Student, Donor, Admin services

3. **Role-Based Access Control (RBAC):**
   - Three user types: `admin`, `donor`, `student`
   - Middleware functions for each role in backend
   - `ProtectedRoute` component in frontend with optional role checking
   - JWT tokens contain `{ userId, userType }` payload

4. **Two Student Endpoint Versions:**
   - **v1** (`students.js`): Stores files as base64 in SQLite
   - **v2** (`students_v2.js`): Uses Azure Blob Storage with Sharp optimization
   - **NOTE:** Consider consolidating to v2 for production

### Security Notes

1. **Default Admin Account:**
   - Email: `admin@obayi.co`
   - Password: `admin123` (hashed with bcrypt)
   - ⚠️ **MUST CHANGE IN PRODUCTION**

2. **JWT Configuration:**
   - 7-day token expiration
   - Secret should be 32+ characters in production
   - Tokens verified on every protected request

3. **Password Security:**
   - bcryptjs with 10 salt rounds
   - No plain text storage
   - Current password verification required for changes

4. **File Upload Limits:**
   - Max size: 5MB (configurable via `MAX_FILE_SIZE` env var)
   - Allowed types: JPEG, PNG, GIF, WebP, PDF, DOC, DOCX

### Database Notes

1. **SQLite Configuration:**
   - WAL (Write-Ahead Logging) mode enabled
   - Foreign key constraints enforced
   - Soft deletes via `is_active` flag
   - Connection optimizations applied (cache_size=1000, synchronous=NORMAL)

2. **Soft Deletes:**
   - Users, assignments marked `is_active = FALSE` instead of hard delete
   - Preserves data integrity for reporting
   - All queries must filter by `is_active = TRUE`

### Context File Usage

**Update this file at the end of each session with:**
- What was accomplished
- Any issues encountered
- Next steps or pending work
- Important decisions made

---

## Quick Reference

### Common Commands
```bash
npm run dev              # Start frontend dev server
npm run dev:backend      # Start backend server
npm run dev:full         # Start both frontend & backend
npm run init-db          # Initialize database
npm run build            # Build for production
```

### Key Files to Know

**Frontend Critical Files:**
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) - Authentication state management
- [src/services/serviceFactory.ts](src/services/serviceFactory.ts) - Service abstraction layer
- [src/router.tsx](src/router.tsx) - Route definitions
- [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) - Route protection
- [src/pages/dashboards/AdminDashboard.tsx](src/pages/dashboards/AdminDashboard.tsx) - Admin interface
- [src/config/appConfig.ts](src/config/appConfig.ts) - App configuration

**Backend Critical Files:**
- [backend/server.js](backend/server.js) - Express app entry point
- [backend/middleware/auth.js](backend/middleware/auth.js) - JWT auth & RBAC
- [backend/routes/auth.js](backend/routes/auth.js) - Authentication endpoints
- [backend/routes/admin.js](backend/routes/admin.js) - Admin endpoints
- [backend/config/database.js](backend/config/database.js) - Database wrapper
- [backend/schema.sql](backend/schema.sql) - Database schema
- [backend/services/azureBlobService.js](backend/services/azureBlobService.js) - File storage

**Database Tables:**
- `users` - Base user table (all types)
- `donors` - Donor-specific profile data
- `students` - Student-specific profile data
- `donor_student_assignments` - Matching relationships
- `student_documents` - Document metadata
- `password_reset_tokens` - Password recovery

**Environment Files:**
- [backend/.env](backend/.env) - Backend environment variables (not in repo)
- [.env](..env) - Frontend environment variables (not in repo)

---

## API Endpoints Quick Reference

### Authentication (`/api/auth`)
- `POST /auth/register` - Register new user (donor/student)
- `POST /auth/login` - Login and get JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password

### Admin (`/api/admin`) - Requires Admin Role
- `GET /admin/donors` - List all donors
- `GET /admin/students` - List all students
- `GET /admin/assignments` - List all assignments
- `POST /admin/assign` - Create donor-student assignment
- `POST /admin/unassign` - Remove assignment
- `GET /admin/stats` - Platform statistics
- `DELETE /admin/donors/:id` - Deactivate donor
- `DELETE /admin/students/:id` - Deactivate student

### Donor (`/api/donors`) - Requires Donor Role
- `PUT /donors/profile` - Update donor profile
- `GET /donors/students` - List assigned students
- `GET /donors/students/:id` - Get student details
- `GET /donors/students/:id/documents/:docId/download` - Download document

### Student (`/api/students`) - Requires Student Role
- `GET /students/profile` - Get profile with stats
- `PUT /students/profile` - Update profile
- `POST /students/profile-picture` - Upload profile picture
- `POST /students/documents` - Upload document
- `GET /students/documents` - List documents
- `DELETE /students/documents/:id` - Delete document

---

## Known Issues & TODOs

### Technical Debt
1. **Consolidate Student Routes:** v1 (base64) and v2 (Azure) both exist - need to migrate fully to v2
2. **Error Messages:** Some expose database structure - need to make more generic
3. **Async/Await Consistency:** students_v2.js missing some awaits
4. **Token Expiration:** 7 days might be too long - consider shorter duration with refresh tokens

### Production Checklist
- [ ] Change default admin password
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure Azure Blob Storage connection string
- [ ] Set up proper CORS for production domain
- [ ] Enable HTTPS/TLS
- [ ] Implement rate limiting on auth endpoints
- [ ] Add request logging for audit trail
- [ ] Test soft-delete functionality thoroughly
- [ ] Set up database backups
- [ ] Configure proper error monitoring

---

## Session History

### Session 1 - 2025-10-16
- **Topic:** Context management setup, codebase analysis & deployment fix
- **What was done:**
  - Created `.claude/context.md` for maintaining session context
  - Created `.claude/requests.md` for task management workflow
  - Performed comprehensive frontend codebase analysis (React + TypeScript)
  - Performed comprehensive backend codebase analysis (Express + SQLite)
  - Documented complete project architecture, authentication flow, and API endpoints
  - **FIXED CRITICAL BUG:** Users isolated in localStorage mode instead of API mode
  - Created `.env.production` to force API mode in production
  - Updated `vite.config.ts` with correct GitHub Pages base path
  - Created deployment fix documentation
- **Key Findings:**
  - Dual-mode architecture (localStorage demo + API production)
  - Well-structured RBAC with 3 user types
  - Two versions of student endpoints (v1 base64, v2 Azure)
  - Default admin credentials need changing in production
  - Comprehensive admin dashboard with analytics
  - **CRITICAL:** Deployed app was using localStorage (isolated) instead of SQLite (shared)
- **Bugs Fixed:**
  - User isolation issue: App now properly connects to backend in production
- **Files Created:**
  - [.env.production](.env.production) - Production environment config
  - [.claude/DEPLOYMENT_FIX.md](.claude/DEPLOYMENT_FIX.md) - Fix documentation
- **Files Modified:**
  - [vite.config.ts](../vite.config.ts) - Set base path to `/obayi/`
  - [.gitignore](../.gitignore) - Allow .env.production to be committed
- **Next steps:**
  1. Rebuild app: `npm run build`
  2. Commit changes and deploy to GitHub Pages
  3. Test that users now share same database
