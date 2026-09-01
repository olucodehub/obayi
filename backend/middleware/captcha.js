const axios = require('axios');

/**
 * Middleware to verify Google reCAPTCHA v3 token
 *
 * Usage: Add this middleware to routes that need CAPTCHA protection
 * The frontend should send the CAPTCHA token in the request body as 'captchaToken'
 */
const verifyCaptcha = async (req, res, next) => {
  try {
    const captchaToken = req.body.captchaToken;
    const captchaSecret = process.env.RECAPTCHA_SECRET_KEY;

    // Skip CAPTCHA verification in development mode if configured
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_CAPTCHA === 'true') {
      console.log('CAPTCHA verification skipped in development mode');
      return next();
    }

    // Check if CAPTCHA token is provided
    if (!captchaToken) {
      return res.status(400).json({
        error: 'CAPTCHA verification required. Please try again.'
      });
    }

    // Check if secret key is configured
    if (!captchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY not configured in environment variables');
      return res.status(500).json({
        error: 'Server configuration error. Please contact support.'
      });
    }

    // Verify the CAPTCHA token with Google's API
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await axios.post(verificationUrl, null, {
      params: {
        secret: captchaSecret,
        response: captchaToken,
        remoteip: req.ip || req.connection.remoteAddress
      }
    });

    const { success, score, action } = response.data;

    // For reCAPTCHA v3, check both success and score
    // Score ranges from 0.0 (likely bot) to 1.0 (likely human)
    const minimumScore = parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE || '0.5');

    if (!success) {
      console.warn('CAPTCHA verification failed:', response.data);
      return res.status(400).json({
        error: 'CAPTCHA verification failed. Please try again.'
      });
    }

    if (score < minimumScore) {
      console.warn(`CAPTCHA score too low: ${score} (minimum: ${minimumScore})`);
      return res.status(403).json({
        error: 'Security check failed. If you are human, please try again or contact support.'
      });
    }

    // Log successful verification for monitoring
    console.log(`CAPTCHA verified successfully - Score: ${score}, Action: ${action}, IP: ${req.ip}`);

    // Attach CAPTCHA data to request for potential logging
    req.captchaVerified = true;
    req.captchaScore = score;
    req.captchaAction = action;

    next();
  } catch (error) {
    console.error('CAPTCHA verification error:', error.message);

    // In case of network errors or Google API issues, decide whether to:
    // 1. Fail closed (reject the request) - more secure
    // 2. Fail open (allow the request) - better UX but less secure

    // Failing closed (recommended for security)
    return res.status(500).json({
      error: 'Unable to verify security check. Please try again later.'
    });
  }
};

/**
 * Optional: More lenient CAPTCHA verification for less critical operations
 * Uses a lower score threshold
 */
const verifyCaptchaLenient = async (req, res, next) => {
  // Temporarily lower the minimum score
  const originalMinScore = process.env.RECAPTCHA_MINIMUM_SCORE;
  process.env.RECAPTCHA_MINIMUM_SCORE = '0.3';

  await verifyCaptcha(req, res, (err) => {
    // Restore original minimum score
    process.env.RECAPTCHA_MINIMUM_SCORE = originalMinScore;

    if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = {
  verifyCaptcha,
  verifyCaptchaLenient
};
