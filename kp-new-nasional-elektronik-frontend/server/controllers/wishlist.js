const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

// Get wishlist by userId (can be public or authenticated)
const getWishlistByUserId = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const wishlist = await prisma.wishlist.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: {
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  return response.status(200).json({
    data: wishlist,
    total: wishlist.length,
  });
});

// Get current user's wishlist (authenticated)
const getMyWishlist = asyncHandler(async (request, response) => {
  const userId = request.user.id; // from JWT token

  const wishlist = await prisma.wishlist.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: {
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  return response.status(200).json({
    data: wishlist,
    total: wishlist.length,
  });
});

// Admin only - get all wishlists
const getAllWishlist = asyncHandler(async (request, response) => {
  const wishlist = await prisma.wishlist.findMany({
    include: {
      product: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return response.json(wishlist);
});

// Add product to wishlist (public - accepts userId in body)
const createWishItemPublic = asyncHandler(async (request, response) => {
  const { productId, userId } = request.body;

  if (!productId || !userId) {
    throw new AppError("Product ID and User ID are required", 400);
  }

  // Verify user exists in database
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new AppError("User not found", 404);
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if wishlist item already exists
  const existingWishItem = await prisma.wishlist.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });

  if (existingWishItem) {
    throw new AppError("Already in wishlist", 400);
  }

  try {
    const wishItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            category: {
              select: { name: true },
            },
          },
        },
      },
    });
    return response.status(201).json(wishItem);
  } catch (error) {
    // Handle foreign key constraint errors
    if (error.code === 'P2003') {
      throw new AppError("User or Product not found", 404);
    }
    throw error;
  }
});

// Add product to wishlist (authenticated)
const createWishItem = asyncHandler(async (request, response) => {
  const { productId } = request.body;
  const userId = request.user.id; // from JWT token

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  // Verify user exists in database
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new AppError("User not found. Invalid token or user has been deleted.", 401);
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if wishlist item already exists
  const existingWishItem = await prisma.wishlist.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });

  if (existingWishItem) {
    throw new AppError("Already in wishlist", 400);
  }

  try {
    const wishItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
    return response.status(201).json(wishItem);
  } catch (error) {
    // Handle foreign key constraint errors
    if (error.code === 'P2003') {
      throw new AppError("User or Product not found", 404);
    }
    throw error;
  }
});

// Delete item from wishlist by userId and productId (public)
const deleteWishItemPublic = asyncHandler(async (request, response) => {
  const { userId, productId } = request.params;

  if (!userId || !productId) {
    throw new AppError("User ID and Product ID are required", 400);
  }

  // Find wishlist item
  const wishItem = await prisma.wishlist.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });

  if (!wishItem) {
    throw new AppError("Wishlist item not found", 404);
  }

  await prisma.wishlist.delete({
    where: {
      id: wishItem.id,
    },
  });
  
  return response.status(200).json({ message: "Item removed from wishlist" });
});

// Delete item from wishlist (authenticated)
const deleteWishItem = asyncHandler(async (request, response) => {
  const { productId } = request.params;
  const userId = request.user.id; // from JWT token

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  // Find and verify ownership
  const wishItem = await prisma.wishlist.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });

  if (!wishItem) {
    throw new AppError("Wishlist item not found", 404);
  }

  await prisma.wishlist.delete({
    where: {
      id: wishItem.id,
    },
  });
  
  return response.status(200).json({ message: "Item removed from wishlist" });
});

// Check if product is in user's wishlist (authenticated)
const checkWishlistItem = asyncHandler(async (request, response) => {
  const { productId } = request.params;
  const userId = request.user.id; // from JWT token

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }
  
  const wishItem = await prisma.wishlist.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
    include: {
      product: true,
    },
  });
  
  return response.status(200).json({
    inWishlist: !!wishItem,
    wishItem: wishItem || null,
  });
});

// Clear all wishlist items for current user (authenticated)
const clearMyWishlist = asyncHandler(async (request, response) => {
  const userId = request.user.id; // from JWT token
  
  await prisma.wishlist.deleteMany({
    where: {
      userId: userId,
    },
  });
  
  return response.status(204).send();
});

// Get wishlist count by userId (public) - validates user exists
const getWishlistCount = asyncHandler(async (request, response) => {
  const { userId } = request.query;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  // Verify user exists in database
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) {
    throw new AppError("User not found", 404);
  }

  // Count wishlist items for this user
  const count = await prisma.wishlist.count({
    where: {
      userId: userId,
    },
  });

  return response.status(200).json({
    count: count,
    userId: userId,
    userEmail: userExists.email,
  });
});

module.exports = {
  getMyWishlist,
  getWishlistByUserId,
  getAllWishlist,
  createWishItem,
  createWishItemPublic,
  deleteWishItem,
  deleteWishItemPublic,
  checkWishlistItem,
  clearMyWishlist,
  getWishlistCount,
};
