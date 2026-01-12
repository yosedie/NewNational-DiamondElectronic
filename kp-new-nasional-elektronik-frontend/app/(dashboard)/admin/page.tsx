"use client";
import { StatsElement } from "@/components";
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import apiClient from "@/lib/api";
import { formatCurrency } from "@/utils/currencyFormatter";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

interface OrderStats {
  chartData: { date: string; count: number; revenue: number }[];
  totalOrders: number;
  totalRevenue: number;
}

interface MemberStats {
  totalMembers: number;
  chartData: { date: string; count: number }[];
}

interface TopProduct {
  id: string;
  title: string;
  mainImage: string;
  price: number;
  totalSold: number;
}

const AdminDashboardPage = () => {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data
        const [ordersRes, membersRes, productsRes] = await Promise.all([
          apiClient.get("/api/dashboard/order-stats"),
          apiClient.get("/api/dashboard/member-stats"),
          apiClient.get("/api/dashboard/top-products"),
        ]);

        const ordersData = await ordersRes.json();
        const membersData = await membersRes.json();
        const productsData = await productsRes.json();

        setOrderStats(ordersData);
        setMemberStats(membersData);
        setTopProducts(productsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-custom-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {orderStats?.totalOrders || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            Rp {formatCurrency(orderStats?.totalRevenue || 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Members</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {memberStats?.totalMembers || 0}
          </p>
        </div>
      </div>

      {/* Order History Chart */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Order History (Last 90 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={orderStats?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" height={60} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="#dc2626"
              name="Orders"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              name="Revenue (Rp)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Member Growth Chart */}
      <div className="bg-gradient-to-r from-custom-red to-red-600 text-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold mb-4">Member Growth</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={memberStats?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="date" stroke="#fff" height={60} />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#fff"
              fill="rgba(255,255,255,0.3)"
              name="Members"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-green-300 flex gap-x-2 items-center text-lg mt-4">
          <FaArrowUp />
          <span>
            Total Members: {memberStats?.totalMembers || 0}
          </span>
        </p>
      </div>

      {/* Most Sold Products */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Most Sold Products
        </h3>
        <div className="space-y-4">
          {topProducts && topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-custom-red text-white rounded-full font-bold">
                  #{index + 1}
                </div>
                <div className="w-16 h-16 relative">
                  <Image
                    src={
                      product.mainImage
                        ? product.mainImage.startsWith("http")
                          ? product.mainImage
                          : `/${product.mainImage}`
                        : "/product_placeholder.jpg"
                    }
                    alt={product.title}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized={product.mainImage?.startsWith("http")}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {product.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Rp {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-custom-red">
                    {product.totalSold}
                  </p>
                  <p className="text-sm text-gray-600">Units Sold</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No sales data available yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
