const express = require('express');

const router = express.Router();

const { verifyToken } = require('../middleware/auth');

const {
  getCustomerOrder,
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getAllOrders,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus
} = require('../controllers/customer_orders');

// All order routes require JWT authentication
// Public route to get all orders (no verifyToken)
router.route('/')
  .get(getAllOrders)
  .post(verifyToken, createCustomerOrder);

// User-specific orders (TS-ORD-009)
router.route('/user/:email')
  .get(verifyToken, getUserOrders);

// Order details with product info (TS-ORD-010)
router.route('/:id/details')
  .get(verifyToken, getOrderDetails);

// Update order status - admin only (TS-ORD-011, TS-ORD-012)
router.route('/:id/status')
  .put(verifyToken, updateOrderStatus);

router.route('/:id')
  .get(verifyToken, getCustomerOrder)
  .put(verifyToken, updateCustomerOrder)
  .delete(verifyToken, deleteCustomerOrder);


module.exports = router;