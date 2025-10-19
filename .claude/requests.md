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

### 2025-10-19 - Registration UX improvements and backend deployment setup

**Status:** ✅ Complete

**Problems:**
1. Password fields on registration form had no visibility toggle
2. Phone number fields didn't support international format (e.g., +234)
3. Registration failed with `ERR_NAME_NOT_RESOLVED` - backend not deployed
4. Error messages were generic ("Registration failed") with no helpful details

**Root Cause:**
The backend at `https://obayibackend.azurewebsites.net` was never deployed to Azure, causing all API calls to fail. The production environment was configured to use this non-existent API endpoint.

**Solution Implemented:**

**1. Password Visibility Toggle** ([Register.tsx:32-33](src/pages/auth/Register.tsx#L32-L33), [Register.tsx:217-277](src/pages/auth/Register.tsx#L217-L277))
- Added state for `showPassword` and `showConfirmPassword`
- Added eye icon buttons to toggle password visibility
- Icons change between "show" (eye) and "hide" (eye-slash) states

**2. International Phone Format** ([Register.tsx:285-295](src/pages/auth/Register.tsx#L285-L295))
- Added placeholder: `+1 234 567 8900`
- Added helper text explaining international format with examples
- Updated both main phone field and guardian phone field (for students)
- Added missing `guardianPhone` field to student registration form

**3. Backend Deployment Setup** ([backend/DEPLOYMENT.md](backend/DEPLOYMENT.md))
Created comprehensive Azure deployment guide with 3 options:
- **Option 1**: Deploy via Azure Portal (easiest, step-by-step GUI)
- **Option 2**: Deploy via Azure CLI (automated, reproducible)
- **Option 3**: Deploy via VS Code extension (quickest for testing)

Created deployment files:
- [backend/.deployment](backend/.deployment) - Build configuration
- [backend/web.config](backend/web.config) - IIS/Windows Azure config
- [backend/.gitignore](backend/.gitignore) - Ignore sensitive files
- [backend/.env.example](backend/.env.example) - Environment template

**4. Improved Error Messages** ([productionApi.ts:82-88](src/services/productionApi.ts#L82-L88), [productionApi.ts:95-102](src/services/productionApi.ts#L95-L102))
- Network errors now show: "Unable to connect to the server. Please check your internet connection or try again later."
- API errors now show the specific error from backend or a helpful fallback message
- Detects `ERR_NETWORK`, `ERR_NAME_NOT_RESOLVED`, and other connection issues

**Files Modified:**
- [src/pages/auth/Register.tsx](src/pages/auth/Register.tsx) - Password toggle, phone format, guardian phone field
- [src/services/productionApi.ts](src/services/productionApi.ts) - Better error handling
- [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) - Complete deployment guide (new file)
- [backend/.deployment](backend/.deployment) - Azure build config (new file)
- [backend/web.config](backend/web.config) - IIS config (new file)
- [backend/.gitignore](backend/.gitignore) - Git ignore rules (new file)
- [backend/.env.example](backend/.env.example) - Updated with production URL

**Next Steps:**

**IMMEDIATE - Deploy Backend to Azure:**
Follow the [backend deployment guide](backend/DEPLOYMENT.md) to deploy the backend. Choose one of three options:
1. Azure Portal (recommended for first-time users)
2. Azure CLI (recommended for automated deployments)
3. VS Code Extension (recommended for quick testing)

After deployment:
1. Set environment variables in Azure:
   - `NODE_ENV=production`
   - `JWT_SECRET=<secure-random-string>`
   - `FRONTEND_URL=https://obayi.co`
   - `PORT=8080`

2. Verify deployment:
   - Visit: `https://obayibackend.azurewebsites.net/api/health`
   - Should return: `{"status":"OK","message":"Obayi Backend API is running"}`

3. Test registration on obayi.co

**IMPORTANT NOTE:**
SQLite database on Azure App Service is **ephemeral** (data will be lost on restart). For production, consider:
- Migrating to Azure SQL Database
- Using PostgreSQL on Azure
- Mounting Azure Files for persistent SQLite storage

See [DEPLOYMENT.md](backend/DEPLOYMENT.md) for details.

---

### 2025-10-17 - Fix Azure Static Web Apps asset loading issue

**Status:** ✅ Complete

**Problem:**
Site at obayi.co showed blank page with console errors:

- "Expected JavaScript module but server responded with MIME type 'text/html'"
- CSS refused to load due to incorrect MIME type
- Assets not found (404 errors returned as HTML)

**Root Cause:**
Vite config had `base: '/obayi/'` which was for GitHub Pages deployment, but the actual site is hosted on Azure Static Web Apps at the root path. This caused all asset paths to be incorrect (e.g., `/obayi/assets/index.js` instead of `/assets/index.js`).

**Solution Implemented:**

1. Changed [vite.config.ts](vite.config.ts) base path from `/obayi/` to `/`
2. Rebuilt the application
3. Committed and pushed changes
4. Azure will auto-deploy via GitHub Actions workflow

**Files Modified:**

- [vite.config.ts](vite.config.ts) - Changed base from '/obayi/' to '/'
- [package.json](package.json) - Added deploy scripts

**Commits:**

- `d64ce9a` - fix: correct base path for Azure Static Web Apps deployment

**Next Steps:**

- Wait 2-3 minutes for Azure auto-deployment
- Refresh obayi.co to see the fixed site
- Test that API mode is working (users share database)

---

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
