const { z } = require('zod');
const { AppError } = require('../utills/errorHandler');

// Zod schema for product creation
const productCreationSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  slug: z.string()
    .min(1, 'Slug is required'),
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters'),
  price: z.number()
    .or(z.string().transform(Number))
    .refine(val => val > 0, 'Price must be positive'),
  inStock: z.number()
    .or(z.string().transform(Number))
    .refine(val => val >= 0, 'Stock cannot be negative')
    .refine(val => Number.isInteger(val), 'Stock must be a whole number'),
  categoryId: z.string()
    .min(1, 'Category is required'),
  mainImage: z.string()
    .min(1, 'Main image is required'),
  manufacturer: z.string()
    .optional(),
  rating: z.number()
    .optional()
    .default(5),
});

// Zod schema for product update (more lenient - all fields optional except id)
const productUpdateSchema = z.object({
  title: z.string()
    .min(1, 'Product title is required')
    .min(3, 'Title must be at least 3 characters')
    .optional()
    .refine(val => val !== '', 'Product title cannot be empty'),
  slug: z.string()
    .optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .optional(),
  price: z.number()
    .or(z.string().transform(Number))
    .refine(val => val > 0, 'Price must be positive')
    .optional(),
  inStock: z.number()
    .or(z.string().transform(Number))
    .refine(val => val >= 0, 'Stock cannot be negative')
    .optional(),
  categoryId: z.string()
    .optional(),
  mainImage: z.string()
    .optional(),
  manufacturer: z.string()
    .optional(),
  rating: z.number()
    .optional(),
}).refine(
  (data) => {
    // If title is provided, it must not be empty
    if ('title' in data && data.title === '') {
      return false;
    }
    return true;
  },
  { message: 'Product title cannot be empty' }
);

// Middleware to validate product creation
const validateProductCreation = (req, res, next) => {
  try {
    const validatedData = productCreationSchema.parse(req.body);
    req.validatedBody = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new AppError(
        'Validation failed',
        400,
        true,
        fieldErrors
      );
    }
    throw error;
  }
};

// Middleware to validate product update
const validateProductUpdate = (req, res, next) => {
  try {
    // Check if title exists and is empty
    if ('title' in req.body && req.body.title === '') {
      throw new AppError(
        'Validation failed',
        400,
        true,
        [{ field: 'title', message: 'Product title is required' }]
      );
    }

    const validatedData = productUpdateSchema.parse(req.body);
    req.validatedBody = validatedData;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new AppError(
        'Validation failed',
        400,
        true,
        fieldErrors
      );
    }
    throw error;
  }
};

module.exports = {
  productCreationSchema,
  productUpdateSchema,
  validateProductCreation,
  validateProductUpdate,
};
