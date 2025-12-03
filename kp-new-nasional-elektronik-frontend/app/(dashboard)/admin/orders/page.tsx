"use client";
import { AdminOrders } from "@/components";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage customer orders</p>
        </div>
      </div>

      {/* Orders Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <AdminOrders />
      </div>
    </div>
  );
};

export default DashboardOrdersPage;
