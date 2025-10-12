"use client";
import { useSession } from "next-auth/react";
import React from "react";

interface PaymentMethodsProps {
  onSelectPayment?: (method: string) => void;
  selectedPayment?: string;
}

const PaymentMethods = ({ onSelectPayment, selectedPayment }: PaymentMethodsProps) => {
  const { data: session, status } = useSession();

  // Check if user is logged in
  if (status === "loading") {
    return (
      <div className="p-4 text-center">
        <p>Loading payment options...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-4 text-center bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">Please log in to view payment options</p>
      </div>
    );
  }

  const paymentMethods = [
    { id: "bca", name: "BCA Transfer", icon: "🏦" },
    { id: "bni", name: "BNI Transfer", icon: "🏦" },
    { id: "bri", name: "BRI Transfer", icon: "🏦" },
    { id: "mandiri", name: "Mandiri Transfer", icon: "🏦" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
      <div className="grid grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectPayment?.(method.id)}
            className={`p-4 border rounded-lg transition-all duration-200 ${
              selectedPayment === method.id
                ? "border-custom-red bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">{method.icon}</span>
              <span className="text-sm font-medium text-gray-900">{method.name}</span>
            </div>
          </button>
        ))}
      </div>
      {selectedPayment && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            Selected: {paymentMethods.find(m => m.id === selectedPayment)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;