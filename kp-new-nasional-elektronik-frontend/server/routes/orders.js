const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrderStatus
} = require("../controllers/orders");

// POST - Create new order
router.post("/", createOrder);

// GET - Get single order
router.get("/:id", getOrder);

// GET - Get all orders for user
router.get("/user/:userId", getUserOrders);

// PUT - Update order status
router.put("/:id", updateOrderStatus);

module.exports = router;
