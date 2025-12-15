"use client";
import React from "react";
import { sanitize } from "@/lib/sanitize";

interface ProductDescriptionSectionsProps {
  product: any;
}

const ProductDescriptionSections = ({ product }: ProductDescriptionSectionsProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Product Overview Section */}
      <section className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ringkasan Produk</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Kategori</span>
            <span className="font-medium">Elektronik</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Kondisi</span>
            <span className="font-medium">Baru</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Stok</span>
            <span className={`font-medium ${product?.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product?.inStock ? 'Tersedia' : 'Habis'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Berat</span>
            <span className="font-medium">1.2 kg</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Garansi</span>
            <span className="font-medium">1 Tahun</span>
          </div>
        </div>
      </section>

      {/* Product Description Section */}
      <section className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi Produk</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {sanitize(product?.description) || "Produk berkualitas tinggi dari Diamond Electronic. Sempurna untuk memenuhi kebutuhan rumah tangga Anda dengan desain modern dan teknologi terkini."}
          </p>
        </div>
      </section>

      {/* Product Specifications Section */}
      <section className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Spesifikasi Produk</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Spesifikasi Umum</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Merek</span>
                <span>Diamond Electronic</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model</span>
                <span>DE-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Garansi</span>
                <span>1 Tahun</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Dimensi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Panjang</span>
                <span>30 cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lebar</span>
                <span>20 cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tinggi</span>
                <span>15 cm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Information Section */}
      <section className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Pengiriman</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Pengiriman Lokal</p>
              <p className="text-sm text-gray-600">Estimasi 2-3 hari kerja untuk Surabaya</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Pengiriman Nasional</p>
              <p className="text-sm text-gray-600">Estimasi 5-7 hari kerja untuk luar kota</p>
            </div>
          </div>
        </div>
      </section>

      {/* Return Policy Section */}
      <section className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kebijakan Pengembalian</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Perhatian:</strong> Produk dapat dikembalikan dalam 7 hari jika ada cacat pabrik atau tidak sesuai deskripsi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDescriptionSections;