const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get order statistics for the dashboard
router.get("/order-stats", async (req, res) => {
  try {
    // Get orders from the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const orders = await prisma.customer_order.findMany({
      where: {
        dateTime: {
          gte: ninetyDaysAgo,
        },
      },
      select: {
        dateTime: true,
        total: true,
        status: true,
      },
      orderBy: {
        dateTime: "asc",
      },
    });

    // Group orders by Month
    const ordersByMonth = {};
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    orders.forEach((order) => {
      const dateVal = new Date(order.dateTime);
      const monthIndex = dateVal.getMonth(); // 0-11
      const year = dateVal.getFullYear();
      const key = `${monthNames[monthIndex]} ${year}`; // Group key: "Month Year" to handle year crossing

      if (!ordersByMonth[key]) {
        ordersByMonth[key] = {
          date: key, // Using Month Year as the label
          sortKey: `${year}-${String(monthIndex + 1).padStart(2, '0')}`, // YYYY-MM for sorting
          count: 0,
          revenue: 0,
        };
      }
      ordersByMonth[key].count++;
      ordersByMonth[key].revenue += order.total;
    });

    // Ensure October, November, December 2025 are always shown
    const requiredMonths = [
      { month: "October", index: 9 },
      { month: "November", index: 10 },
      { month: "December", index: 11 }
    ];

    requiredMonths.forEach(({ month, index }) => {
      const key = `${month} 2025`;
      if (!ordersByMonth[key]) {
        ordersByMonth[key] = {
          date: key,
          sortKey: `2025-${String(index + 1).padStart(2, '0')}`,
          count: 0,
          revenue: 0,
        };
      }
    });

    // Convert to array and sort chronologically
    const chartData = Object.values(ordersByMonth).sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey)
    ).map(({ sortKey, ...rest }) => rest); // Remove sortKey from final output

    // Get total statistics
    const totalOrders = await prisma.customer_order.count();
    const totalRevenue = await prisma.customer_order.aggregate({
      _sum: {
        total: true,
      },
    });

    res.json({
      chartData,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ error: "Failed to fetch order statistics" });
  }
});

// Get member registration statistics
router.get("/member-stats", async (req, res) => {
  try {
    // Mock data showing growth to 100 members with fluctuations
    const totalMembers = 100;

    // Create data points from October to December 2025 with ups and downs
    res.json({
      totalMembers: totalMembers,
      // Mock data showing realistic growth with fluctuations
      chartData: [
        { date: "2025-10-01", count: 10 },
        { date: "2025-10-05", count: 15 },  // Up
        { date: "2025-10-08", count: 12 },  // Down
        { date: "2025-10-12", count: 20 },  // Up
        { date: "2025-10-15", count: 18 },  // Down
        { date: "2025-10-18", count: 25 },  // Up
        { date: "2025-10-21", count: 22 },  // Down
        { date: "2025-10-24", count: 30 },  // Up
        { date: "2025-10-27", count: 28 },  // Down
        { date: "2025-10-30", count: 35 },  // Up
        { date: "2025-11-02", count: 33 },  // Down
        { date: "2025-11-05", count: 40 },  // Up
        { date: "2025-11-08", count: 38 },  // Down
        { date: "2025-11-11", count: 45 },  // Up
        { date: "2025-11-14", count: 43 },  // Down
        { date: "2025-11-17", count: 52 },  // Up
        { date: "2025-11-20", count: 50 },  // Down
        { date: "2025-11-23", count: 58 },  // Up
        { date: "2025-11-26", count: 55 },  // Down
        { date: "2025-11-29", count: 63 },  // Up
        { date: "2025-12-02", count: 60 },  // Down
        { date: "2025-12-05", count: 70 },  // Up
        { date: "2025-12-08", count: 68 },  // Down
        { date: "2025-12-11", count: 78 },  // Up
        { date: "2025-12-14", count: 75 },  // Down
        { date: "2025-12-17", count: 85 },  // Up
        { date: "2025-12-20", count: 83 },  // Down
        { date: "2025-12-23", count: 95 },  // Up
        { date: "2025-12-24", count: 100 }, // Final
      ],
    });
  } catch (error) {
    console.error("Error fetching member stats:", error);
    res.status(500).json({ error: "Failed to fetch member statistics" });
  }
});

// Get top selling products
router.get("/top-products", async (req, res) => {
  try {
    // Get products with their order quantities
    const productOrders = await prisma.customer_order_product.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    // Get product details
    const topProducts = await Promise.all(
      productOrders.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            title: true,
            mainImage: true,
            price: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
        };
      })
    );

    res.json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});

module.exports = router;
