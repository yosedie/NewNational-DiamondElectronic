const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { asyncHandler, AppError } = require('../utills/errorHandler');

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload single image for product
const uploadProductImage = asyncHandler(async (request, response) => {
  // Check if file was uploaded
  if (!request.files || Object.keys(request.files).length === 0) {
    throw new AppError('No file uploaded', 400);
  }

  const file = request.files.file;

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new AppError(
      'File too large',
      413,
      true,
      [{ field: 'file', message: `Maximum file size is 5MB. Uploaded: ${(file.size / 1024 / 1024).toFixed(2)}MB` }]
    );
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError(
      'Invalid file format',
      400,
      true,
      [{ field: 'file', message: 'Only image formats (JPG, PNG, GIF, WebP) are allowed' }]
    );
  }

  // Generate unique filename with UUID
  const fileExtension = path.extname(file.name);
  const uniqueFilename = `${uuidv4()}${fileExtension}`;
  const uploadPath = path.join(uploadDir, uniqueFilename);

  // Move file to uploads directory
  await file.mv(uploadPath);

  // Return success response with file path
  return response.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    imagePath: `/uploads/products/${uniqueFilename}`,
    filename: uniqueFilename,
    size: file.size,
    mimetype: file.mimetype,
    timestamp: new Date().toISOString()
  });
});

// Get uploaded image info
const getImageInfo = asyncHandler(async (request, response) => {
  const { filename } = request.params;

  const imagePath = path.join(uploadDir, filename);

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    throw new AppError('Image not found', 404);
  }

  const stats = fs.statSync(imagePath);

  return response.status(200).json({
    filename,
    path: `/uploads/products/${filename}`,
    size: stats.size,
    uploadedAt: stats.mtime,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  uploadProductImage,
  getImageInfo,
};
