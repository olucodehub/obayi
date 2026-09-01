# Quick Testing Guide - CAPTCHA & Rate Limiting

## ✅ Configuration Complete

Your reCAPTCHA keys have been configured:

**Frontend** (`.env`):
- Site Key: `6LdMvaMtAAAAAMIerq0UgqdwpuuWXuK6qkF9Ptiu`

**Backend** (`backend/.env`):
- Secret Key: `6LdMvaMtAAAAAKYKYOD5wkDvO5K8Oj5cCMgdRabe`
- Minimum Score: `0.5` (balanced security)
- CAPTCHA Skip: `false` (CAPTCHA enabled)

## 🚀 Start the Application

### 1. Start Backend
```bash
cd backend
npm start
```
Backend will run on: `http://localhost:5000`

### 2. Start Frontend (in a new terminal)
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

## 🧪 Test CAPTCHA Protection

### Test 1: Login with CAPTCHA
1. Go to `http://localhost:5173/login`
2. Open browser DevTools (F12) → Console tab
3. Enter credentials and click "Sign in"
4. Check console for CAPTCHA logs:
   ```
   Login attempt for: your-email@example.com
   ```
5. Backend logs should show:
   ```
   CAPTCHA verified successfully - Score: 0.9, Action: login, IP: ::1
   ```

**Expected Result**: Login should work normally with CAPTCHA verification happening invisibly.

### Test 2: Registration with CAPTCHA
1. Go to `http://localhost:5173/register`
2. Fill in the registration form
3. Submit the form
4. Check DevTools console and backend logs for CAPTCHA verification

**Expected Result**: Registration completes with invisible CAPTCHA check.

### Test 3: Password Reset with CAPTCHA
1. Go to `http://localhost:5173/forgot-password`
2. Enter an email address
3. Submit the form
4. Check logs for CAPTCHA verification

**Expected Result**: Password reset request processes with CAPTCHA verification.

## 🛡️ Test Rate Limiting

### Test 1: Login Rate Limit (5 attempts / 15 minutes)
1. Go to login page
2. Try logging in with **wrong password** 6 times rapidly
3. On the 6th attempt, you should see:
   ```
   Too many login attempts from this IP, please try again after 15 minutes
   ```

**Expected Result**: After 5 failed attempts, further attempts are blocked.

### Test 2: Registration Rate Limit (3 attempts / 1 hour)
1. Try creating 4 different accounts rapidly
2. On the 4th attempt, you should see:
   ```
   Too many accounts created from this IP, please try again after an hour
   ```

**Expected Result**: After 3 registrations, further attempts are blocked.

### Test 3: Password Reset Rate Limit (3 attempts / 1 hour)
1. Go to forgot password page
2. Submit password reset requests 4 times
3. On the 4th attempt, you should see:
   ```
   Too many password reset attempts, please try again after an hour
   ```

**Expected Result**: After 3 requests, further attempts are blocked.

### Test 4: General API Rate Limit (100 requests / minute)
1. Open DevTools → Network tab
2. Rapidly make API calls (refresh pages, etc.)
3. After 100 requests in a minute, you should see:
   ```
   Too many requests from this IP, please slow down
   ```

**Expected Result**: After 100 API calls in a minute, requests are throttled.

## 📊 Monitor Rate Limit Headers

In DevTools → Network tab, check any API response headers:

```
RateLimit-Limit: 5
RateLimit-Remaining: 4
RateLimit-Reset: 1234567890
```

These headers show:
- **Limit**: Maximum requests allowed
- **Remaining**: Requests remaining in current window
- **Reset**: Unix timestamp when limit resets

## 🔍 Check Backend Logs

Your backend logs will show:

**Successful CAPTCHA verification**:
```
CAPTCHA verified successfully - Score: 0.9, Action: login, IP: ::1
```

**Low CAPTCHA score** (potential bot):
```
CAPTCHA score too low: 0.2 (minimum: 0.5)
```

**Rate limit hit**:
```
Rate limit exceeded for IP: ::1
```

## ⚙️ Adjust Settings (if needed)

### Make CAPTCHA More Lenient
In `backend/.env`:
```env
RECAPTCHA_MINIMUM_SCORE=0.3  # Lower = more lenient (0.0 to 1.0)
```

### Make CAPTCHA Stricter
```env
RECAPTCHA_MINIMUM_SCORE=0.7  # Higher = stricter
```

### Temporarily Disable CAPTCHA (for testing)
```env
SKIP_CAPTCHA=true  # ONLY for development testing
```

### Adjust Rate Limits
Edit `backend/middleware/rateLimiter.js`:

```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Change time window
  max: 10,                    // Change max attempts
  // ...
});
```

## 🚨 Common Issues & Solutions

### Issue: "CAPTCHA verification required"
**Cause**: Frontend can't find the site key
**Solution**: Make sure `.env` has `VITE_RECAPTCHA_SITE_KEY` set
**Fix**: Restart the frontend dev server after changing `.env`

### Issue: Backend error "RECAPTCHA_SECRET_KEY not configured"
**Cause**: Backend can't find the secret key
**Solution**: Make sure `backend/.env` has `RECAPTCHA_SECRET_KEY` set
**Fix**: Restart the backend server

### Issue: "Too many requests" on first login
**Cause**: Rate limiter might be too strict
**Solution**: Increase limits in `rateLimiter.js` or wait for the window to reset

### Issue: CAPTCHA always fails
**Cause**: Incorrect keys or domain mismatch
**Solution**:
1. Verify keys are correct
2. Check that `localhost` is added to your reCAPTCHA domain list
3. Check backend logs for specific error messages

### Issue: Rate limits not working
**Cause**: Middleware not properly configured
**Solution**:
1. Check `server.js` has rate limiter imports
2. Verify middleware order (rate limiters should be early)
3. Restart backend server

## 📈 Production Checklist

Before deploying to production:

- [ ] ✅ reCAPTCHA keys are configured (already done)
- [ ] Verify production domains are added to reCAPTCHA admin panel
- [ ] Set `SKIP_CAPTCHA=false` in production (already done)
- [ ] Test CAPTCHA on production domain
- [ ] Monitor CAPTCHA scores for first few days
- [ ] Adjust `RECAPTCHA_MINIMUM_SCORE` based on real traffic
- [ ] Monitor rate limit logs for legitimate users being blocked
- [ ] Adjust rate limits if needed based on actual usage patterns
- [ ] Set up alerts for unusual patterns (many CAPTCHA failures, rate limit hits)

## 🎯 Expected Behavior

**Normal User Experience**:
- ✅ Forms work smoothly without any visible CAPTCHA challenge
- ✅ No delays or interruptions
- ✅ CAPTCHA verification happens invisibly in background

**Bot/Attacker Experience**:
- ❌ Login attempts blocked after 5 tries
- ❌ Registration blocked after 3 tries
- ❌ Password reset blocked after 3 tries
- ❌ Low CAPTCHA scores rejected (< 0.5)
- ❌ Rapid API calls throttled

## 📞 Need Help?

If you encounter issues:

1. **Check browser console** (F12) for frontend errors
2. **Check backend terminal** for server errors
3. **Review logs** for CAPTCHA verification messages
4. **Test with SKIP_CAPTCHA=true** to isolate CAPTCHA issues
5. **Verify .env files** are loaded (restart servers after changes)

Your security implementation is now **fully configured and ready to test**! 🎉
