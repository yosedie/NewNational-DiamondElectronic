const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/wishlist");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/count", getWishlistCount);
router.get("/user/:userId", getWishlistByUserId);
router.post("/public", createWishItemPublic);
router.delete("/user/:userId/:productId", deleteWishItemPublic);

// User routes (require authentication)
router.get("/", verifyToken, getMyWishlist);
router.post("/", verifyToken, createWishItem);
router.delete("/clear", verifyToken, clearMyWishlist);
router.get("/check/:productId", verifyToken, checkWishlistItem);
router.delete("/:productId", verifyToken, deleteWishItem);

// Admin routes
router.get("/admin/all", verifyToken, verifyAdmin, getAllWishlist);

module.exports = router;
