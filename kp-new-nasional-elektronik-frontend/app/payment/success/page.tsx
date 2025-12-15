"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const order_id = searchParams.get("order_id");
    setOrderId(order_id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pembayaran Berhasil!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Terima kasih atas pembelian Anda. Pesanan Anda telah berhasil diproses.
        </p>
        
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {orderId}
            </p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mb-8">
          Email konfirmasi telah dikirim ke alamat email Anda.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-custom-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Kembali ke Beranda
          </Link>
          
          <button
            onClick={() => router.push("/shop")}
            className="block w-full bg-white text-custom-red border border-custom-red py-3 px-4 rounded-md hover:bg-red-50 transition-colors font-medium"
          >
            Lanjut Belanja
          </button>
        </div>
      </div>
    </div>
  );
}
