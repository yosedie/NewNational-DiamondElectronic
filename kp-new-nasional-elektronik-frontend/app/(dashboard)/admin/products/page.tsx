"use client";
import {
  CustomButton,
  DashboardProductTable,
} from "@/components";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your product inventory</p>
        </div>
      </div>

      {/* Product Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <DashboardProductTable />
      </div>
    </div>
  );
};

export default DashboardProducts;
