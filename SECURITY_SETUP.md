# Security Setup Guide: CAPTCHA & Rate Limiting

This guide explains how to configure CAPTCHA and rate limiting to protect your Obayi application from credit card testing, brute force attacks, and other malicious activities.

## Overview

The following security measures have been implemented:

1. **Google reCAPTCHA v3** - Invisible bot protection on Login, Register, and Password Reset forms
2. **Rate Limiting** - Request throttling to prevent abuse
3. **Security Headers** - Helmet.js for enhanced HTTP security
4. **Admin Route Protection** - Stricter limits on admin operations

## 1. Setting Up Google reCAPTCHA v3

### Step 1: Create reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Create a new site with these settings:
   - **Label**: Obayi App
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domains
     - For development: `localhost`
     - For production: `your-domain.com`, `your-app.azurestaticapps.net`
   - Accept the terms and submit

4. You'll receive two keys:
   - **Site Key** (for frontend)
   - **Secret Key** (for backend)

### Step 2: Configure Backend (.env)

Edit `backend/.env` and add your reCAPTCHA secret key:

```env
# Google reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your-actual-recaptcha-secret-key-here
RECAPTCHA_MINIMUM_SCORE=0.5

# Security Configuration
SKIP_CAPTCHA=false  # Set to true for local testing without CAPTCHA
```

**Configuration Options:**
- `RECAPTCHA_MINIMUM_SCORE`: Score threshold (0.0-1.0). Lower = stricter. Recommended: 0.5
  - 1.0 = Definitely human
  - 0.0 = Definitely bot
- `SKIP_CAPTCHA`: Set to `true` during development to bypass CAPTCHA (NOT for production!)

### Step 3: Configure Frontend (.env)

Edit the root `.env` file and add your reCAPTCHA site key:

```env
# Google reCAPTCHA v3 Site Key (for frontend)
VITE_RECAPTCHA_SITE_KEY=your-actual-recaptcha-site-key-here
```

### Step 4: Verify Implementation

The following forms now have CAPTCHA protection:
- **Login** (`src/pages/auth/Login.tsx`)
- **Register** (`src/pages/auth/Register.tsx`)
- **Forgot Password** (`src/pages/auth/ForgotPassword.tsx`)

CAPTCHA tokens are automatically generated and verified on the backend.

## 2. Rate Limiting Configuration

Rate limiting has been implemented to protect against:
- Brute force login attempts
- Spam account creation
- Password reset abuse
- API flooding
- Admin operation abuse

### Default Limits

| Endpoint | Limit | Window | Applied To |
|----------|-------|--------|------------|
| Login | 5 requests | 15 minutes | Per IP |
| Registration | 3 requests | 1 hour | Per IP |
| Password Reset | 3 requests | 1 hour | Per IP |
| General API | 100 requests | 1 minute | Per IP |
| Admin Routes | 50 requests | 15 minutes | Per IP |

### Customizing Rate Limits

Edit `backend/middleware/rateLimiter.js` to adjust limits:

```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Time window
  max: 5,                     // Max requests per window
  message: {
    error: 'Custom error message'
  }
});
```

### Rate Limit Headers

Rate limit information is returned in response headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Time when the rate limit resets

## 3. Security Headers (Helmet)

Helmet has been configured in `backend/server.js` to add security headers:

```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false  // Disabled for API-only backend
}));
```

This adds headers like:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

## 4. Testing Your Setup

### Test CAPTCHA Protection

1. **Without valid CAPTCHA keys** (development):
   - Set `SKIP_CAPTCHA=true` in `backend/.env`
   - The app will work but won't verify CAPTCHA

2. **With valid CAPTCHA keys**:
   - Set `SKIP_CAPTCHA=false`
   - Try logging in - CAPTCHA should verify silently
   - Check browser console for CAPTCHA scores
   - Check backend logs for verification messages

### Test Rate Limiting

1. **Test login rate limit**:
   - Try logging in with wrong credentials 6 times rapidly
   - After 5 attempts, you should see: "Too many login attempts..."

2. **Test registration rate limit**:
   - Try creating 4 accounts in quick succession
   - After 3 attempts, you should see: "Too many accounts created..."

3. **Monitor rate limits**:
   ```bash
   # Check response headers in browser DevTools Network tab
   # Look for RateLimit-* headers
   ```

## 5. Monitoring & Logs

### Backend Logs

The backend logs CAPTCHA verification results:

```bash
# Successful CAPTCHA verification
CAPTCHA verified successfully - Score: 0.9, Action: login, IP: 127.0.0.1

# Failed verification
CAPTCHA score too low: 0.2 (minimum: 0.5)
```

### Rate Limit Monitoring

Monitor rate limit hits in backend logs:
- Each rate-limited request is logged
- Check for patterns of abuse
- Adjust limits based on legitimate usage patterns

## 6. Production Deployment

### Pre-Deployment Checklist

- [ ] Replace `RECAPTCHA_SECRET_KEY` with production key
- [ ] Replace `VITE_RECAPTCHA_SITE_KEY` with production key
- [ ] Set `SKIP_CAPTCHA=false` in production
- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Add all production domains to reCAPTCHA admin panel
- [ ] Test all forms with CAPTCHA in production
- [ ] Monitor CAPTCHA scores and adjust `RECAPTCHA_MINIMUM_SCORE` if needed

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment-specific keys** (separate dev/prod)
3. **Monitor CAPTCHA scores** to detect attack patterns
4. **Adjust rate limits** based on actual traffic
5. **Enable HTTPS** in production (CAPTCHA requires it)
6. **Review logs regularly** for suspicious activity

## 7. Troubleshooting

### CAPTCHA Not Working

1. **Check browser console** for errors
2. **Verify site key** is correct in `.env`
3. **Check domain** is registered in reCAPTCHA admin
4. **Ensure HTTPS** is enabled (reCAPTCHA requires it in production)
5. **Check backend logs** for verification errors

### Rate Limiting Issues

1. **"Too many requests"** for legitimate users:
   - Increase the `max` value in rate limiter
   - Increase the `windowMs` (time window)

2. **Rate limits not working**:
   - Check that middleware is imported correctly
   - Verify middleware order in `server.js`
   - Check IP address detection (may be incorrect behind proxies)

### Common Errors

```
Error: CAPTCHA verification required
```
**Solution**: Ensure `VITE_RECAPTCHA_SITE_KEY` is set in frontend `.env`

```
Error: RECAPTCHA_SECRET_KEY not configured
```
**Solution**: Add `RECAPTCHA_SECRET_KEY` to backend `.env`

```
Error: Too many login attempts
```
**Solution**: Wait 15 minutes or adjust rate limits in `rateLimiter.js`

## 8. Additional Security Recommendations

1. **Enable 2FA** for admin accounts
2. **Implement IP whitelisting** for admin routes
3. **Add request signing** for sensitive operations
4. **Set up monitoring alerts** for unusual patterns
5. **Regular security audits** of dependencies
6. **Implement CSRF protection** if using cookies
7. **Add request logging** with unique IDs for tracking

## 9. Support & Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
- [Helmet.js](https://helmetjs.github.io/)

## Summary

Your Obayi application now has comprehensive protection against:
- ✅ Credit card testing and carding attacks
- ✅ Brute force login attempts
- ✅ Spam account creation
- ✅ Password reset abuse
- ✅ API abuse and flooding
- ✅ Common web vulnerabilities

Remember to monitor logs and adjust security settings based on your specific traffic patterns and threat landscape.
