const express = require("express");

const router = express.Router();

const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/category");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Public route - get all categories
router.route("/").get(getAllCategories);

// Admin only routes - create category
router.route("/").post(verifyToken, verifyAdmin, createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(verifyToken, verifyAdmin, updateCategory)
  .delete(verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
