const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      error: 'No token provided',
      details: 'Authorization header with Bearer token is required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Token expired',
        details: 'Your session has expired. Please log in again.'
      });
    }
    
    return res.status(403).json({
      error: 'Invalid token',
      details: 'The provided token is invalid or malformed.'
    });
  }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'No user found',
      details: 'Please authenticate first'
    });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required',
      details: 'You do not have permission to access this resource'
    });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyAdmin
};
