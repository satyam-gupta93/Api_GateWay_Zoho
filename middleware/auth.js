require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const connectDB = require('../utils/db');
const ApiKey = require('../models/ApiKey');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Connect to MongoDB once when middleware is initialized
connectDB();


const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or invalid Authorization header');
    return res.status(401).json({ error: 'Missing or invalid authorization header...' });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.warn('JWT user not found in DB', { userId: decoded.userId });
      return res.status(403).json({ error: 'User no longer exists...' });
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      authMethod: 'jwt',
    };

    logger.info('JWT authentication successful', { userId: decoded.userId });
    next();
  } catch (error) {
    logger.warn('JWT verification failed', { error: error.message });
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};


const authenticateAPIKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    logger.warn('Missing API key');
    return res.status(401).json({ error: 'Missing API key..' });
  }

  try {
    const keyData = await ApiKey.findOne({ key_value: apiKey, is_active: true }).populate('user_id');

    if (!keyData) {
      logger.warn('Invalid or inactive API key', { apiKey: apiKey.substring(0, 8) + '...' });
      return res.status(403).json({ error: 'Invalid or inactive API key..' });
    }

    // Update last used timestamp
    keyData.last_used_at = new Date();
    await keyData.save();

    req.user = {
      userId: keyData.user_id._id.toString(),
      email: keyData.user_id.email,
      authMethod: 'api-key',
    };

    logger.info('API key authentication successful', { userId: req.user.userId });
    next();
  } catch (error) {
    logger.error('API key authentication error', { error: error.message });
    return res.status(500).json({ error: 'Authentication error' });
  }
};


const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateJWT(req, res, next);
  } else if (apiKey) {
    return authenticateAPIKey(req, res, next);
  } else {
    logger.warn('No authentication credentials provided');
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Provide either Bearer token or X-API-Key header',
    });
  }
};

module.exports = {
  authenticate,
  authenticateJWT,
  authenticateAPIKey,
  JWT_SECRET,
};
