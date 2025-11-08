const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path
      });
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: req.rateLimit?.resetTime
      });
    },
    skip: (req) => {
      return req.path === '/health';
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'API rate limit exceeded (100 requests per hour)'
});

const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Rate limit exceeded (50 requests per 15 minutes)'
});

module.exports = {
  createRateLimiter,
  apiRateLimiter,
  strictRateLimiter
};
