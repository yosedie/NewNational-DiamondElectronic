const express = require('express');
const router = express.Router();
const { uploadProductImage, getImageInfo } = require('../controllers/images');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Upload product image (admin only)
router.post('/upload', verifyToken, verifyAdmin, uploadProductImage);

// Get image info
router.get('/:filename', getImageInfo);

module.exports = router;
