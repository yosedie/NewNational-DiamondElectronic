const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get order statistics for the dashboard
router.get("/order-stats", async (req, res) => {
  try {
    // Get orders from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.customer_order.findMany({
      where: {
        dateTime: {
          gte: thirtyDaysAgo,
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

    // Group orders by date
    const ordersByDate = {};
    orders.forEach((order) => {
      const date = new Date(order.dateTime).toISOString().split("T")[0];
      if (!ordersByDate[date]) {
        ordersByDate[date] = {
          date,
          count: 0,
          revenue: 0,
        };
      }
      ordersByDate[date].count++;
      ordersByDate[date].revenue += order.total;
    });

    const chartData = Object.values(ordersByDate);

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
    // Get total user count
    const totalUsers = await prisma.user.count({
      where: {
        role: "user",
      },
    });

    // Since User table doesn't have createdAt, we'll return just the count
    // In a real scenario, you'd add a createdAt field to track registrations over time
    res.json({
      totalMembers: totalUsers,
      // For now, we'll create mock data for the chart
      // You should add a createdAt field to the User model for real data
      chartData: [
        { date: "2025-10-21", count: totalUsers > 20 ? totalUsers - 20 : 0 },
        { date: "2025-10-28", count: totalUsers > 15 ? totalUsers - 15 : 0 },
        { date: "2025-11-04", count: totalUsers > 10 ? totalUsers - 10 : 0 },
        { date: "2025-11-11", count: totalUsers > 5 ? totalUsers - 5 : 0 },
        { date: "2025-11-18", count: totalUsers },
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
