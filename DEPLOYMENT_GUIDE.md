# Production Deployment Guide

## 🚀 Deploying Security Updates to Production

This guide walks through deploying the CAPTCHA and rate limiting security features to your live Azure environment.

---

## Prerequisites Checklist

- [x] Code changes committed to git
- [ ] Production domains added to reCAPTCHA admin console
- [ ] Backend dependencies installed locally
- [ ] Frontend dependencies installed locally
- [ ] Access to Azure Portal
- [ ] Access to GitHub repository

---

## Step 1: Configure Production Domains in reCAPTCHA

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click on your site: **Obayi** (site key: 6LdMvaMtAAAAAMIerq0UgqdwpuuWXuK6qkF9Ptiu)
3. Click **Settings** (gear icon)
4. Under **Domains**, add these if not already there:
   ```
   obayi.co
   www.obayi.co
   ambitious-mushroom-03632ab03.6.azurestaticapps.net
   localhost
   ```
5. Click **Save**

---

## Step 2: Commit and Push Code Changes

### 2.1 Stage All Changes

```powershell
git status
git add .
```

### 2.2 Create Commit

```powershell
git commit -m "feat: add CAPTCHA and rate limiting security

- Add reCAPTCHA v3 to all payment buttons (Stripe, PayPal, Paystack)
- Add rate limiting to auth and admin endpoints
- Add Helmet security headers
- Prevent credit card testing bots from accessing payment gateways

Security improvements:
- Login: 5 attempts per 15 min
- Registration: 3 attempts per hour
- Password reset: 3 attempts per hour
- CAPTCHA score threshold: 0.5
- All payment buttons require human verification

Closes #[issue-number]"
```

### 2.3 Push to Repository

```powershell
git push origin master
```

---

## Step 3: Configure Backend Environment Variables (Azure App Service)

### 3.1 Navigate to Azure App Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **App Services**
3. Click on **obayibackend-b2e8bjfkd8gpbeg6**

### 3.2 Add Environment Variables

1. In left menu, click **Configuration** → **Application settings**
2. Click **+ New application setting** and add these:

| Name | Value |
|------|-------|
| `RECAPTCHA_SECRET_KEY` | `6LdMvaMtAAAAAKYKYOD5wkDvO5K8Oj5cCMgdRabe` |
| `RECAPTCHA_MINIMUM_SCORE` | `0.5` |
| `SKIP_CAPTCHA` | `false` |
| `NODE_ENV` | `production` |

3. Click **Save** at the top
4. Click **Continue** to restart the app

---

## Step 4: Configure Frontend Environment Variables (Azure Static Web Apps)

### 4.1 Navigate to Static Web App

1. In [Azure Portal](https://portal.azure.com)
2. Navigate to **Static Web Apps**
3. Click on your app: **ambitious-mushroom-03632ab03**

### 4.2 Add Environment Variables

1. In left menu, click **Configuration** → **Application settings**
2. Click **+ Add** and add these:

| Name | Value |
|------|-------|
| `VITE_RECAPTCHA_SITE_KEY` | `6LdMvaMtAAAAAMIerq0UgqdwpuuWXuK6qkF9Ptiu` |
| `VITE_API_URL` | `https://obayibackend-b2e8bjfkd8gpbeg6.westeurope-01.azurewebsites.net/api` |

3. Click **Save**

---

## Step 5: Deploy Backend to Azure

### Option A: Automatic Deployment (GitHub Actions)

If you have GitHub Actions set up:

1. Push code to master branch (already done in Step 2)
2. GitHub Actions will automatically:
   - Install dependencies
   - Build the application
   - Deploy to Azure App Service
3. Monitor deployment at: `https://github.com/[your-username]/obayi/actions`

### Option B: Manual Deployment via Azure CLI

```powershell
# Login to Azure
az login

# Navigate to backend directory
cd backend

# Deploy to Azure App Service
az webapp up --name obayibackend-b2e8bjfkd8gpbeg6 --resource-group [your-resource-group]
```

### Option C: Deploy from Azure Portal

1. In Azure Portal → App Service → **obayibackend-b2e8bjfkd8gpbeg6**
2. Left menu → **Deployment Center**
3. If GitHub is connected:
   - Click **Sync** to pull latest code
4. If not connected:
   - Configure GitHub deployment
   - Select repository and branch
   - Click **Save**

---

## Step 6: Deploy Frontend to Azure Static Web Apps

### Option A: Automatic Deployment (GitHub Actions)

Azure Static Web Apps automatically deploys on push to master:

1. Code pushed in Step 2 triggers deployment
2. GitHub Actions workflow builds and deploys
3. Monitor at: `https://github.com/[your-username]/obayi/actions`
4. Wait for "Azure Static Web Apps CI/CD" workflow to complete

### Option B: Manual Trigger

```powershell
# In project root
npm run build

# Deploy using Azure CLI
az staticwebapp deploy --name ambitious-mushroom-03632ab03 --source ./dist
```

---

## Step 7: Verify Backend Deployment

### 7.1 Check Backend Health

```powershell
# Test backend API is running
curl https://obayibackend-b2e8bjfkd8gpbeg6.westeurope-01.azurewebsites.net/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Obayi Backend API is running"
}
```

### 7.2 Check Dependencies Installed

1. Go to Azure Portal → App Service → **obayibackend-b2e8bjfkd8gpbeg6**
2. Left menu → **Advanced Tools** → **Go**
3. Opens Kudu console
4. Click **Debug console** → **CMD**
5. Navigate to `site/wwwroot`
6. Run: `npm list helmet express-rate-limit express-slow-down`

Should show all packages installed.

### 7.3 Check Environment Variables

In Azure Portal → App Service → **Configuration**:
- Verify `RECAPTCHA_SECRET_KEY` is set
- Verify `RECAPTCHA_MINIMUM_SCORE` = 0.5
- Verify `SKIP_CAPTCHA` = false

---

## Step 8: Verify Frontend Deployment

### 8.1 Check Frontend Build

1. Visit: https://obayi.co
2. Should load without errors

### 8.2 Check CAPTCHA Integration

1. Open https://obayi.co/donate
2. Open browser DevTools (F12) → Console
3. Click any payment button
4. Console should show:
   ```
   CAPTCHA verified for donation: donate_stripe_onetime
   ```
5. Payment link should open

### 8.3 Check Environment Variables

1. In browser console, run:
   ```javascript
   console.log(import.meta.env.VITE_RECAPTCHA_SITE_KEY)
   ```
2. Should output: `6LdMvaMtAAAAAMIerq0UgqdwpuuWXuK6qkF9Ptiu`

---

## Step 9: Test Security Features

### 9.1 Test Payment CAPTCHA

1. Go to https://obayi.co/donate
2. Click "Donate via Stripe"
3. Button should briefly show "Verifying..."
4. Stripe payment page should open
5. Check browser console for CAPTCHA log

✅ **Expected**: Payment page opens smoothly after ~1 second

### 9.2 Test Login Rate Limiting

1. Go to https://obayi.co/login
2. Enter wrong password 6 times rapidly
3. After 5 attempts, should see:
   ```
   Too many login attempts from this IP, please try again after 15 minutes
   ```

✅ **Expected**: Rate limiting blocks after 5 attempts

### 9.3 Test Registration Rate Limiting

1. Try creating 4 accounts in quick succession
2. After 3 attempts, should see:
   ```
   Too many accounts created from this IP, please try again after an hour
   ```

✅ **Expected**: Rate limiting blocks after 3 attempts

---

## Step 10: Monitor for 48 Hours

### 10.1 Monitor reCAPTCHA Console

1. Visit: https://www.google.com/recaptcha/admin
2. Click on **Obayi** site
3. View **Analytics** tab
4. Monitor:
   - Score distribution (should see mostly 0.7-1.0 for real users)
   - Request volume
   - Verification success rate

### 10.2 Monitor Azure Logs

**Backend Logs**:
1. Azure Portal → App Service → **obayibackend-b2e8bjfkd8gpbeg6**
2. Left menu → **Log stream**
3. Watch for:
   ```
   CAPTCHA verified successfully - Score: 0.9
   ```

**Frontend Logs**:
1. Azure Portal → Static Web App
2. Left menu → **Application Insights** (if configured)

### 10.3 Monitor Payment Gateways

Check fraud metrics in:
- **Stripe Dashboard**: https://dashboard.stripe.com
- **PayPal Dashboard**: https://www.paypal.com/merchantreports
- **Paystack Dashboard**: https://dashboard.paystack.com

Look for:
- ✅ Reduction in failed payment attempts
- ✅ Lower fraud dispute rates
- ✅ Improved account health scores

---

## Step 11: Rollback Plan (If Needed)

If issues arise, you can quickly rollback:

### 11.1 Disable CAPTCHA Temporarily

**Backend**:
```env
SKIP_CAPTCHA=true
```

**Frontend**: Remove CAPTCHA temporarily by commenting out:
```javascript
// const { executeRecaptcha } = useGoogleReCaptcha();
```

### 11.2 Git Rollback

```powershell
# Revert to previous commit
git revert HEAD
git push origin master
```

### 11.3 Azure Rollback

1. Azure Portal → App Service → **Deployment Center**
2. Click **Redeploy** on previous successful deployment

---

## Troubleshooting

### Issue: "Cannot find module 'helmet'"

**Solution**: Backend dependencies not installed

```powershell
# SSH into Azure App Service or use Kudu console
cd /home/site/wwwroot
npm install
```

### Issue: CAPTCHA not working on production

**Solution 1**: Check domain is registered
- Verify `obayi.co` is in reCAPTCHA admin console

**Solution 2**: Check environment variables
- Verify `VITE_RECAPTCHA_SITE_KEY` in Azure Static Web Apps config

**Solution 3**: Check backend secret key
- Verify `RECAPTCHA_SECRET_KEY` in Azure App Service config

### Issue: Rate limiting too strict

**Solution**: Adjust limits in `backend/middleware/rateLimiter.js`
```javascript
const loginLimiter = rateLimit({
  max: 10,  // Increase from 5 to 10
});
```

Then redeploy backend.

### Issue: CORS errors

**Solution**: Verify `FRONTEND_URL` in backend `.env` matches production domain
```env
FRONTEND_URL=https://obayi.co
```

---

## Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] CAPTCHA working on /donate page
- [ ] Rate limiting working on /login
- [ ] reCAPTCHA admin console showing traffic
- [ ] Backend logs showing CAPTCHA verifications
- [ ] No console errors on production site
- [ ] Payment buttons working normally
- [ ] Stripe/PayPal/Paystack links opening correctly
- [ ] Monitoring set up for next 48 hours

---

## Success Metrics (After 7 Days)

Track these metrics to measure success:

| Metric | Before | Target After |
|--------|--------|--------------|
| Failed payment attempts | High | -90% |
| Bot traffic to /donate | High | -90% |
| CAPTCHA success rate | N/A | >95% |
| Legitimate user complaints | 0 | 0 |
| Stripe fraud score | Low | Improved |
| Rate limit triggers (login) | 0 | Minimal |

---

## Support

If you encounter issues during deployment:

1. **Check Azure deployment logs**
2. **Review browser console for errors**
3. **Check reCAPTCHA admin console**
4. **Review backend logs in Azure Log Stream**
5. **Test locally first** before deploying changes

---

**Deployment Status**: ⏳ Pending
**Last Updated**: September 1, 2026
