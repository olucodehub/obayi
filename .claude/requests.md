# Requests & Tasks

> **How to use this file:**
>
> 1. Add your requests under the "New Requests" section below
> 2. Tag me in the chat and mention you've added a request
> 3. I'll move completed requests to "Completed" section with notes
> 4. Keep this file open in your IDE for easy access

---

## New Requests

<!-- Write your requests here. Use this format:

### [Date] - Brief Title
Description of what you need...


Example:
### 2025-10-16 - Fix button alignment on homepage
The submit button is not centered properly on mobile view

-->



---

## In Progress

<!-- I'll move requests here when I start working on them -->

---

## Completed

### 2025-10-16 - Investigate SQLite isolation issue
**Status:** ✅ Complete

**Problem:**
Users couldn't see other registered users after deployment. Each session appeared to have its own isolated database.

**Root Cause:**
The deployed app was running in `localStorage` mode instead of `api` mode, causing each browser to maintain its own isolated storage instead of connecting to the shared SQLite backend.

**Solution Implemented:**
1. Created [.env.production](.env.production) file with production configuration:
   - `VITE_AUTH_MODE=api` (forces API mode in production)
   - `VITE_API_URL=https://obayibackend.azurewebsites.net/api`

2. Updated [vite.config.ts](vite.config.ts) to set correct base path for GitHub Pages: `/obayi/`

3. Updated [.gitignore](.gitignore) to allow `.env.production` to be committed (no secrets, just config)

**Files Modified:**
- [.env.production](.env.production) - Created
- [vite.config.ts](vite.config.ts) - Updated base path
- [.gitignore](.gitignore) - Allow .env.production

**Next Steps:**
1. Rebuild the app: `npm run build`
2. Commit and push changes
3. Deploy to GitHub Pages
4. Test that users now share the same database

---

### 2025-10-16 - Analyze all code files to understand the project

### 2025-10-16 - Analyze all code files to understand the project

**Status:** ✅ Complete

**What was done:**

- Comprehensive frontend analysis (React + TypeScript architecture)
- Comprehensive backend analysis (Express + SQLite API)
- Documented all API endpoints and authentication flows
- Updated context.md with complete project understanding
- Identified technical debt and production checklist items

**Key Findings:**

- Dual-mode architecture (localStorage demo + API production)
- Well-structured RBAC with 3 user types (admin, donor, student)
- Two versions of student endpoints exist (v1 base64, v2 Azure Blob)
- Default admin credentials: admin@obayi.co / admin123 (needs change in prod)
- Complete admin dashboard with analytics and network visualization

**Files Updated:**

- [.claude/context.md](.claude/context.md) - Complete project documentation

**Next Steps:**
All information is now documented in context.md for future reference. Ready for new requests!
