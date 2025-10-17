const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Log the secret being used for debugging
  const secret = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key';
  console.log('Using secret:', secret);

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  const secret = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key';
  jwt.verify(token, secret, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

module.exports = { authenticateToken, optionalAuth };