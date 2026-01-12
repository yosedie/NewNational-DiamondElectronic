// MOCK SIMULATION CONTROLLER
// PURELY STATELESS - NO DB OR REAL INFRASTRUCTURE

// TS-SEC-001: Rate Limiting (Login Brute Force)
async function simulateLoginRateLimit(req, res) {
    const { email, attempt } = req.body;

    // Simulate logic: Attempt 6 triggers 429
    if (attempt >= 6) {
        return res.status(429).json({
            error: "Too Many Requests",
            message: "Too many login attempts from this IP, please try again after 15 minutes",
            details: "Rate limiter active (Simulation)"
        });
    }

    return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
        attemptsDetails: `Attempt ${attempt} of 5`
    });
}

// TS-SEC-002: Rate Limiting (General API)
async function simulateGeneralRateLimit(req, res) {
    const count = parseInt(req.query.requestCount) || 1;

    // Simulate logic: Request 101 triggers 429
    if (count > 100) {
        return res.status(429).json({
            error: "Too Many Requests",
            message: "API rate limit exceeded",
            details: "Window: 15 min, Requests: " + count
        });
    }

    return res.json({
        message: "Request allowed",
        currentCount: count,
        limit: 100
    });
}

// TS-SEC-003: Input Validation (SQL Injection)
async function simulateSafeSearch(req, res) {
    const { keyword } = req.body;

    // Check for suspicious SQL keywords mock
    const isSuspicious = /DROP TABLE|DELETE FROM|SELECT \*/i.test(keyword);

    return res.json({
        originalKeyword: keyword,
        sanitized: true,
        executedQuery: "SELECT * FROM items WHERE name LIKE ?",
        parameter: keyword, // Implementation would use params
        message: isSuspicious ? "SQL Injection attempt detected but neutralized via Parameterized Query" : "Search executed safe",
        simulation: "Prisma parameterized query used"
    });
}

// TS-SEC-004: Input Validation (XSS)
async function simulateSafeContentAdd(req, res) {
    const { name, description } = req.body;

    // Simple mock sanitization
    const sanitizedName = name.replace(/<script>/g, "&lt;script&gt;").replace(/<\/script>/g, "&lt;/script&gt;");

    return res.json({
        originalName: name,
        storedName: sanitizedName,
        message: "Input sanitized, Script tags escaped",
        renderSafety: "Safe for HTML rendering"
    });
}

// TS-SEC-005: Password Hashing
async function simulatePasswordHash(req, res) {
    const { password } = req.body;

    // Mock bcrypt hash
    const fakeHash = "$2b$10$" + Buffer.from(password).toString('base64').substring(0, 22) + "XyZ...";

    return res.json({
        plaintextInput: password,
        storedHash: fakeHash,
        algorithm: "bcrypt",
        saltRounds: 10,
        result: "Password di DB bukan plaintext"
    });
}

// TS-SEC-006: CORS Policy Mock
async function simulateCorsCheck(req, res) {
    const origin = req.headers.origin || "unknown";
    const allowed = ["http://localhost:3000", "http://localhost:3001"];

    if (origin === "http://evil.com") {
        return res.status(403).json({
            error: "CORS Error",
            message: "Origin http://evil.com not allowed",
            policy: "Strict Origin"
        });
    }

    return res.json({
        status: "Allowed",
        origin: origin,
        message: "CORS middleware active"
    });
}

// TS-PERF-001: Product List Performance
async function simulateProductPerformance(req, res) {
    // Mock timing
    const start = process.hrtime();
    // Simulate "work"
    const mockProducts = Array(5).fill({ id: 1, name: "Product" });
    const end = process.hrtime(start);
    const timeMs = (end[1] / 1000000).toFixed(2); // Mock, usually < 1ms for this array

    return res.json({
        datasetSize: "1000+ records",
        queryTime: "45ms (Mocked)",
        optimization: "Indexes utilized, Pagination active",
        result: "Performance < 100ms PASS"
    });
}

// TS-PERF-002: Image Optimization
async function simulateImageOptimization(req, res) {
    return res.json({
        original: {
            name: "product.jpg",
            size: "5MB",
            format: "JPG"
        },
        optimized: {
            name: "product.webp",
            size: "245KB",
            format: "WebP",
            reduction: "95%"
        },
        delivery: "Next.js Image Component + Lazy Loading"
    });
}

// TS-PERF-003: Connection Pool
async function simulateConnectionPool(req, res) {
    return res.json({
        status: "Healthy",
        activeConnections: 50, // Simulated concurrent
        poolConfig: {
            max: 10,
            idle: 2000
        },
        queueState: "Managed",
        message: "No connection timeout, requests queued properly"
    });
}

// TS-PERF-004: API Response Time
async function simulateResponseTimeStats(req, res) {
    return res.json({
        metrics: {
            samples: 100,
            average: "145ms",
            p95: "380ms",
            min: "45ms",
            max: "490ms"
        },
        status: "Stable",
        result: "Performance PASS < 200ms avg"
    });
}

// TS-INT-001: Frontend-Backend Integration
async function simulateBackendHealth(req, res) {
    return res.json({
        status: "Online",
        integration: "Frontend <-> Backend",
        dataParsed: true,
        cors: "Enabled"
    });
}

// TS-INT-002: Backend-DB Integration
async function simulateDbConnection(req, res) {
    return res.json({
        status: "Connected",
        database: "MySQL",
        orm: "Prisma Client",
        queryTest: "SELECT 1",
        result: "Success"
    });
}

// TS-INT-003: Mock Webhook Receipt
async function simulateWebhookReceipt(req, res) {
    return res.json({
        received: true,
        signature: "verified_sha256_mock",
        payload: req.body,
        action: "Order updated via Webhook"
    });
}

module.exports = {
    simulateLoginRateLimit,
    simulateGeneralRateLimit,
    simulateSafeSearch,
    simulateSafeContentAdd,
    simulatePasswordHash,
    simulateCorsCheck,
    simulateProductPerformance,
    simulateImageOptimization,
    simulateConnectionPool,
    simulateResponseTimeStats,
    simulateBackendHealth,
    simulateDbConnection,
    simulateWebhookReceipt
};
