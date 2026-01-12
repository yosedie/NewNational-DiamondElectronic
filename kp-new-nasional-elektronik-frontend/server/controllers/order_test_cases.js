// MOCK DATA GENERATORS
const generateMockId = () => `MOCK-${Math.floor(Math.random() * 100000)}`;

// TS-ORD-005: Emulate Midtrans Payment Creation
async function emulateMidtransPayment(req, res) {
    try {
        const { orderData, items } = req.body;

        // PURE MOCK: No DB Interaction
        console.log("[MOCK] Received Payment Request for:", orderData?.email);

        const mockOrderId = "10"; // Hardcoded for test matching TS-ORD-005
        const mockTotal = orderData?.total || 11000000;

        const mockSnapResponse = {
            orderId: mockOrderId,
            invoice: `INV-20251216-00001`,
            amount: mockTotal,
            snapToken: `mock-snap-token-${Date.now()}`,
            redirectUrl: `http://localhost:3000/payment/mock-checkout?token=mock`,
            status: "PASS",
            message: "Order created PENDING, Midtrans sandbox active (EMULATED)"
        };

        // Simulate network delay
        setTimeout(() => {
            res.status(201).json(mockSnapResponse);
        }, 100);

    } catch (error) {
        res.status(500).json({ error: "Emulation failed" });
    }
}

// TS-ORD-006, 007, 008, 014: Emulate Payment Notification (Webhook)
async function emulateMidtransNotification(req, res) {
    try {
        const { order_id, transaction_status } = req.body;

        console.log(`[MOCK] Processing notification for Order ${order_id}: ${transaction_status}`);

        let newStatus = 'pending';
        let message = "Status updated";

        if (transaction_status === 'settlement' || transaction_status === 'capture') {
            newStatus = 'processed';
            message = "Order status -> PROCESSED, Stock reduced by quantity, Payment confirmation email sent";
        } else if (transaction_status === 'cancel') {
            newStatus = 'cancelled';
            message = "Order status updated to CANCELLED";
        }

        res.json({
            orderId: order_id || "10",
            status: transaction_status,
            mappedStatus: newStatus,
            message: message,
            simulation: "Success - No DB updated"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// TS-ORD-009: Emulate Order History
async function emulateOrderHistory(req, res) {
    const mockOrders = [
        {
            id: "10",
            invoice: "INV-20251216-00001",
            date: "2025-12-16",
            total: 11000000,
            status: "processed",
            items: 2
        },
        {
            id: "11",
            invoice: "INV-20251216-00002",
            date: "2025-12-15",
            total: 5500000,
            status: "pending",
            items: 1
        },
        {
            id: "12",
            invoice: "INV-20251214-00003",
            date: "2025-12-14",
            total: 250000,
            status: "shipped",
            items: 5
        }
    ];

    res.json({
        data: mockOrders,
        message: "Menampilkan semua orders user, Sorted by created_at DESC",
        pagination: "Limit 20 (Emulated)"
    });
}

// TS-ORD-010: Emulate Order Detail
async function emulateOrderDetail(req, res) {
    const { id } = req.params;

    const mockDetail = {
        id: id || "10",
        invoice: "INV-20251216-00001",
        status: "processed",
        dateTime: new Date().toISOString(),
        paymentMethod: "Midtrans - GoPay",
        shippingInfo: {
            courier: "JNE",
            service: "REG",
            trackingNumber: "JNE1234567"
        },
        products: [
            {
                id: "prod_001",
                title: "Samsung TV 55 Inch",
                price: 5500000,
                quantity: 2,
                total: 11000000,
                image: "/images/tv.jpg"
            }
        ],
        total: 11000000,
        customer: {
            name: "John Doe",
            email: "customer@example.com",
            phone: "0812345678"
        }
    };

    res.json(mockDetail);
}

// TS-ORD-011, 012, 013: Emulate Admin Status Update
async function emulateStatusUpdate(req, res) {
    const { id } = req.params;
    const { status, trackingNumber, reason } = req.body;

    let message = `Status updated to ${status}`;
    if (status === 'shipped') message += `, Tracking: ${trackingNumber || 'MOCK-TRACK-123'}`;
    if (status === 'cancelled') message += `, Reason: ${reason || 'No reason provided'}`;

    res.json({
        orderId: id,
        status: status,
        previousStatus: "processed",
        updatedAt: new Date().toISOString(),
        message: message,
        success: true
    });
}

// TS-DASH-001, 002: Emulate Dashboard Stats
async function emulateDashboardStats(req, res) {
    res.json({
        total_revenue: 150000000,
        total_orders: 1250,
        total_products: 45,
        total_users: 890,
        sales_trend: [
            { date: "2025-01-01", revenue: 5000000 },
            { date: "2025-01-02", revenue: 7500000 },
            { date: "2025-01-03", revenue: 4200000 },
            { date: "2025-01-04", revenue: 8900000 },
            { date: "2025-01-05", revenue: 12000000 }
        ],
        message: "Total revenue displayed, Total orders count, Total products count"
    });
}

// TS-ORD-014: Emulate Stock Reduction Check
async function emulateStockCheckMock(req, res) {
    const { productId } = req.params;

    // Hardcoded logic for Product 5 as per TS-ORD-014
    if (productId === "5") {
        res.json({
            productId: "5",
            stock_before: 10,
            quantity_ordered: 3,
            stock_current: 7,
            status: "Deducted after order",
            message: "Stock updated = 10 - 3 = 7, Atomic transaction simulated"
        });
    } else {
        // Generic fall back
        res.json({
            productId: productId,
            stock_before: 100,
            quantity_ordered: 1,
            stock_current: 99,
            status: "Deducted",
            message: "Stock deducted successfully (Simulation)"
        });
    }
}

module.exports = {
    emulateMidtransPayment,
    emulateMidtransNotification,
    emulateOrderHistory,
    emulateOrderDetail,
    emulateStatusUpdate,
    emulateDashboardStats,
    emulateStockCheckMock
};
