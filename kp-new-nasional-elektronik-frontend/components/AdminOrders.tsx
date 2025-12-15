"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useReactToPrint } from "react-to-print";
import { HiPrinter } from "react-icons/hi";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Orders-Report-${new Date().toLocaleDateString('id-ID')}`,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await apiClient.get("/api/orders");
      const data = await response.json();

      setOrders(data?.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="w-full p-4">
      {/* Print Button */}
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={handlePrint}
          className="uppercase bg-white px-6 py-3 text-base border border-gray-300 font-bold text-custom-red shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 flex items-center gap-2"
        >
          <HiPrinter className="w-5 h-5" />
          Print All Orders
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {orders && orders.length > 0 &&
              orders.map((order) => (
                <tr key={order?.id}>
                  <td>
                    <div>
                      <p className="font-bold">#{order?.id}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">{order?.name}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`badge badge-sm text-white ${order?.status?.toLowerCase() === 'pending' ? 'badge-warning' :
                      order?.status?.toLowerCase() === 'cancelled' ? 'badge-error' :
                        order?.status?.toLowerCase() === 'paid' ? 'badge-success' :
                          'badge-neutral'
                      }`}>
                      {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1).toLowerCase()}
                    </span>
                  </td>

                  <td>
                    <p>Rp. {formatCurrency(order?.total)}</p>
                  </td>

                  <td>{new Date(Date.parse(order?.dateTime)).toDateString()}</td>
                  <th>
                    <Link
                      href={`/admin/orders/${order?.id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      Details
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Hidden Print Template */}
      <div className="hidden">
        <div ref={printRef} className="p-4 bg-white">
          {/* Header */}
          <div className="mb-3">
            {/* Company Logo - Left aligned */}
            <div className="mb-2">
              <img
                src="/logo v1.png"
                alt="Diamond Electronic logo"
                width={200}
                height={200}
              />
            </div>

            {/* Title and Info - Centered */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">ORDERS REPORT</h1>
              <h2 className="text-lg font-semibold text-gray-700 mt-1">Nasional Elektronik</h2>
              <p className="text-gray-600 text-sm mt-0.5">Diamond Electronic Shop</p>
              <p className="text-gray-600 text-sm">Date: {new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          {/* Orders Table */}
          <table className="w-full border-collapse mb-3">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left py-1.5 px-2 text-sm font-bold">Order ID</th>
                <th className="text-left py-1.5 px-2 text-sm font-bold">Customer Name</th>
                <th className="text-left py-1.5 px-2 text-sm font-bold">Status</th>
                <th className="text-right py-1.5 px-2 text-sm font-bold">Subtotal</th>
                <th className="text-left py-1.5 px-2 text-sm font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 &&
                orders.map((order, index) => (
                  <tr key={order?.id} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-1.5 px-2 text-sm">#{order?.id}</td>
                    <td className="py-1.5 px-2 text-sm">{order?.name} {order?.lastname}</td>
                    <td className="py-1.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${order?.status === 'delivered' ? 'bg-green-200 text-green-800' :
                        order?.status === 'processing' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                        {order?.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-sm text-right">Rp. {formatCurrency(order?.total)}</td>
                    <td className="py-1.5 px-2 text-sm">{new Date(Date.parse(order?.dateTime)).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-800">
                <td colSpan={3} className="py-2 px-2 text-right font-bold text-base"></td>
                <td className="py-2 px-2 text-right font-bold text-base">
                  TOTAL: Rp. {formatCurrency(orders?.reduce((sum, order) => sum + order.total, 0) || 0)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-300 text-center text-gray-600 text-xs">
            <p>Total Orders: {orders?.length || 0}</p>
            <p className="mt-1">Nasional Elektronik - Diamond Electronic Shop</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
