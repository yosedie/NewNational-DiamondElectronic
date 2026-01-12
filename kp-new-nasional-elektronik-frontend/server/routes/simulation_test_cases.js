const express = require('express');
const router = express.Router();
const controller = require('../controllers/simulation_test_cases');

// === SECURITY ===
// TS-SEC-001
router.post('/auth/login-attempt', controller.simulateLoginRateLimit);

// TS-SEC-002
router.get('/rate-limit-check', controller.simulateGeneralRateLimit);

// TS-SEC-003
router.post('/search/safe', controller.simulateSafeSearch);

// TS-SEC-004
router.post('/product/safe-add', controller.simulateSafeContentAdd);

// TS-SEC-005
router.post('/auth/hash-check', controller.simulatePasswordHash);

// TS-SEC-006
router.get('/cors-check', controller.simulateCorsCheck);


// === PERFORMANCE ===
// TS-PERF-001
router.get('/perf/products', controller.simulateProductPerformance);

// TS-PERF-002
router.get('/perf/image', controller.simulateImageOptimization);

// TS-PERF-003
router.get('/perf/connections', controller.simulateConnectionPool);

// TS-PERF-004
router.get('/perf/response-time', controller.simulateResponseTimeStats);


// === INTEGRATION ===
// TS-INT-001
router.get('/int/backend-check', controller.simulateBackendHealth);

// TS-INT-002
router.get('/int/db-check', controller.simulateDbConnection);

// TS-INT-003
router.post('/int/webhook-check', controller.simulateWebhookReceipt);

module.exports = router;
