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
    <div className="xl:ml-5 w-full max-xl:mt-5 ">
      {/* Print Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors m-2"
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
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
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
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

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
                    <span className="badge badge-success text-white badge-sm">
                      {order?.status}
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
                      details
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
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
        <div ref={printRef} className="p-8 bg-white">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">ORDERS REPORT</h1>
            <h2 className="text-xl font-semibold text-gray-700 mt-2">Nasional Elektronik</h2>
            <p className="text-gray-600 mt-1">Diamond Electronic Shop</p>
            <p className="text-gray-600">Date: {new Date().toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          {/* Orders Table */}
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left py-3 px-2 font-bold">Order ID</th>
                <th className="text-left py-3 px-2 font-bold">Customer Name</th>
                <th className="text-left py-3 px-2 font-bold">Status</th>
                <th className="text-right py-3 px-2 font-bold">Subtotal</th>
                <th className="text-left py-3 px-2 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 &&
                orders.map((order, index) => (
                  <tr key={order?.id} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-3 px-2">#{order?.id}</td>
                    <td className="py-3 px-2">{order?.name} {order?.lastname}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order?.status === 'delivered' ? 'bg-green-200 text-green-800' :
                        order?.status === 'processing' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {order?.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">Rp. {formatCurrency(order?.total)}</td>
                    <td className="py-3 px-2">{new Date(Date.parse(order?.dateTime)).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-800">
                <td colSpan={3} className="py-3 px-2 text-right font-bold text-lg">TOTAL:</td>
                <td className="py-3 px-2 text-right font-bold text-lg">
                  Rp. {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
            <p>Total Orders: {orders.length}</p>
            <p className="mt-2">Nasional Elektronik - Diamond Electronic Shop</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
