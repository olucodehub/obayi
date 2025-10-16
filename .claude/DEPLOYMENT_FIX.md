# SQLite Isolation Issue - Fix Documentation

## Problem Summary
After deployment to GitHub Pages, users couldn't see other registered users. Each browser session appeared to have its own isolated database.

## Root Cause
The deployed application was running in **localStorage mode** instead of **API mode**:
- In localStorage mode, data is stored in each user's browser
- Each browser has isolated storage, so users can't see each other
- The backend SQLite database was never being used

This happened because environment variables (`.env`) are not deployed with the static site, causing the app to fall back to localStorage mode by default.

## Solution
Created a production-specific environment file that Vite automatically uses during build.

### Files Created/Modified

1. **[.env.production](./.env.production)** - NEW
   ```env
   VITE_AUTH_MODE=api
   VITE_API_URL=https://obayibackend.azurewebsites.net/api
   VITE_DEBUG=false
   ```

2. **[vite.config.ts](../vite.config.ts)** - MODIFIED
   - Changed `base: '/'` to `base: '/obayi/'` for GitHub Pages

3. **[.gitignore](../.gitignore)** - MODIFIED
   - Added exception to allow `.env.production` to be committed

## How It Works

### Before Fix (localStorage mode)
```
User Browser → localStorage (isolated per browser)
                     ↓
              No shared data ❌
```

### After Fix (API mode)
```
User Browser → Frontend (API mode)
                     ↓
              API Request (HTTPS)
                     ↓
         Azure Backend Server
                     ↓
         SQLite Database (shared) ✅
```

## Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```
   This will automatically use `.env.production` values.

2. **Commit changes:**
   ```bash
   git add .env.production vite.config.ts .gitignore
   git commit -m "fix: configure production to use API mode instead of localStorage"
   git push
   ```

3. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```
   OR use your existing deployment workflow.

4. **Verify the fix:**
   - Open the deployed site in two different browsers
   - Register a new user in Browser A
   - Login as admin in Browser B
   - Admin should now see the user registered in Browser A

## Testing Locally

To test production mode locally:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Then open http://localhost:4173 and verify API mode is active.

## Environment Configuration Summary

| File | Purpose | Mode |
|------|---------|------|
| `.env` | Local development (NOT committed) | Can be either |
| `.env.production` | Production builds (committed) | API mode |

## Backend Requirements

Ensure your backend is running and accessible:
- URL: https://obayibackend.azurewebsites.net/api
- Health check: https://obayibackend.azurewebsites.net/api/health
- CORS must allow: https://olucodehub.github.io

## Troubleshooting

### If users still can't see each other:

1. **Check browser console for errors:**
   - Open DevTools → Console
   - Look for API connection errors

2. **Verify API mode is active:**
   - Open DevTools → Console
   - Type: `localStorage.getItem('obayi_users')`
   - If it returns data, you're still in localStorage mode ❌
   - If it returns null, you're in API mode ✅

3. **Check backend is running:**
   ```bash
   curl https://obayibackend.azurewebsites.net/api/health
   ```

4. **Clear browser cache and localStorage:**
   - DevTools → Application → Clear storage
   - Reload the page

5. **Verify CORS configuration:**
   Check backend allows your frontend domain.

## Important Notes

- `.env` (local dev) is gitignored - never commit secrets
- `.env.production` is committed - contains only public config
- Backend API URL is public - no sensitive data
- Always test production build locally before deploying

## Date Fixed
2025-10-16

## Fixed By
Claude Code Assistant
