const express = require("express");

const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  searchProducts,
  getProductById,
} = require("../controllers/products");
const { validateProductCreation, validateProductUpdate } = require("../middleware/validation");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.route("/").get(getAllProducts).post(verifyToken, verifyAdmin, validateProductCreation, createProduct);

// Update product status
router.patch("/:id/status", verifyToken, verifyAdmin, updateProductStatus);

router
  .route("/:id")
  .get(getProductById)
  .put(verifyToken, verifyAdmin, validateProductUpdate, updateProduct)
  .delete(verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
