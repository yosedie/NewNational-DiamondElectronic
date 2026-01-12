const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../utills/db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate test tokens for authentication testing
router.get('/generate', async (req, res) => {
  try {
    // Get or create test users for realistic tokens
    let testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (!testUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('testpassword123', 14);
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          role: 'user',
        },
      });
    }

    let adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (!adminUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('adminpassword123', 14);
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    }

    // Valid token with real user ID (expires in 24 hours)
    const validToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Admin token with real user ID (expires in 24 hours)
    const adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Expired token (already expired)
    const expiredToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      JWT_SECRET,
      { expiresIn: '-1h' } // Expired 1 hour ago
    );

    // Invalid token (malformed)
    const invalidToken = 'invalidtoken123xyz.malformed.jwt';

    res.status(200).json({
      message: 'Test tokens generated successfully',
      users: {
        testUser: {
          id: testUser.id,
          email: testUser.email,
          role: testUser.role,
          description: 'Real test user created/retrieved from database'
        },
        adminUser: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          description: 'Real admin user created/retrieved from database'
        }
      },
      tokens: {
        validUserToken: {
          token: validToken,
          userId: testUser.id,
          description: 'Valid user token (expires in 24h)',
          role: 'USER',
          expiresIn: '24h',
          usage: 'Use for user operations (TS-AUTH-015, TS-WISH-001, etc)'
        },
        adminToken: {
          token: adminToken,
          userId: adminUser.id,
          description: 'Valid admin token (expires in 24h)',
          role: 'ADMIN',
          expiresIn: '24h',
          usage: 'Use for admin endpoint access test'
        },
        expiredToken: {
          token: expiredToken,
          description: 'Expired token (expired 1 hour ago)',
          role: 'USER',
          expiresIn: '-1h',
          usage: 'Use for TS-AUTH-013 (token expired error test)'
        },
        invalidToken: {
          token: invalidToken,
          description: 'Malformed/invalid token',
          role: 'N/A',
          usage: 'Use for TS-AUTH-012 (invalid token error test)'
        }
      },
      testCases: {
        'TS-AUTH-012': {
          name: 'Invalid JWT Token',
          method: 'GET',
          endpoint: '/api/orders',
          header: `Authorization: Bearer ${invalidToken}`,
          expectedStatus: 403,
          expectedError: 'Invalid token'
        },
        'TS-AUTH-013': {
          name: 'Expired JWT Token',
          method: 'GET',
          endpoint: '/api/orders',
          header: `Authorization: Bearer ${expiredToken}`,
          expectedStatus: 403,
          expectedError: 'Token expired'
        },
        'TS-AUTH-014': {
          name: 'User accessing admin endpoint',
          method: 'GET',
          endpoint: '/api/admin/users',
          header: `Authorization: Bearer ${validToken}`,
          expectedStatus: 403,
          expectedError: 'Admin access required'
        },
        'TS-AUTH-015': {
          name: 'Admin accessing admin endpoint',
          method: 'GET',
          endpoint: '/api/admin/users',
          header: `Authorization: Bearer ${adminToken}`,
          expectedStatus: 200,
          expectedResponse: 'Users data'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate test tokens',
      details: error.message
    });
  }
});

// Generate token for specific user ID
router.get('/generate-for-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required',
        usage: 'GET /api/test-tokens/generate-for-user/:userId'
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        userId: userId
      });
    }

    // Generate token with user's actual data
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Token generated successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token: token,
      expiresIn: '24h',
      usage: `Authorization: Bearer ${token}`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate token',
      details: error.message
    });
  }
});

module.exports = router;
