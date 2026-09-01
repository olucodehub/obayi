const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Aggressive rate limiter for login attempts (prevents brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
  skipFailedRequests: false, // Count failed requests
});

// Rate limiter for registration (prevents spam accounts)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: {
    error: 'Too many accounts created from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset requests (prevents account enumeration)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter (prevents API abuse)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: {
    error: 'Too many requests from this IP, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for payment/donation related endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 payment requests per 15 minutes
  message: {
    error: 'Too many payment attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiter that slows down requests instead of blocking
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
  delayMs: 500, // Add 500ms delay per request above 50
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Admin operations limiter (very strict)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit to 50 admin operations per 15 minutes
  message: {
    error: 'Too many admin operations, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  apiLimiter,
  paymentLimiter,
  speedLimiter,
  adminLimiter
};
