const express = require('express');
const router = express.Router();
const {
    emulateMidtransPayment,
    emulateMidtransNotification,
    emulateOrderHistory,
    emulateOrderDetail,
    emulateStatusUpdate,
    emulateDashboardStats
} = require('../controllers/order_test_cases');

// TS-ORD-005: Midtrans Payment Emulation
router.post('/midtrans', emulateMidtransPayment);

// TS-ORD-006, TS-ORD-007, TS-ORD-008: Payment Notification Emulation
router.post('/midtrans/notification', emulateMidtransNotification);

// TS-ORD-009: Order History Emulation
// Note: Real route is /api/orders/user/:userId, but this is the test specific one
router.get('/history', emulateOrderHistory);

// TS-ORD-010: Order Detail Emulation
router.get('/detail/:id', emulateOrderDetail);

// TS-ORD-011, TS-ORD-012, TS-ORD-013: Status Update Emulation
router.put('/status/:id', emulateStatusUpdate);

// TS-DASH-001: Dashboard Stats Emulation
router.get('/dashboard/stats', emulateDashboardStats);

// TS-DASH-002: Dashboard Sales Period Emulation (Reuse stats or add specific)
// using same handler for simple stats
router.get('/dashboard/sales', emulateDashboardStats);

// TS-ORD-014: Check Mock Stock
router.get('/stock-check/:productId', require('../controllers/order_test_cases').emulateStockCheckMock);

module.exports = router;
