const express = require("express");
const router = express.Router();
const {
  createTransaction,
  handleNotification
} = require("../controllers/midtrans");

// Create Midtrans transaction
router.post("/transaction", createTransaction);

// Handle Midtrans notification/webhook
router.post("/notification", handleNotification);

module.exports = router;
