import {
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
  SingleProductDynamicFields,
  AddToWishlistBtn,
} from "@/components";
import ProductDescriptionSections from "@/components/ProductDescriptionSections";
import SocialShare from "@/components/SocialShare";
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { sanitize } from "@/lib/sanitize";
import { formatCurrency } from "@/utils/currencyFormatter";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{  productSlug: string, id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  // sending API request for a single product with a given product slug
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(
    `/api/images/${paramsAwaited?.id}`
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto">
        {/* Product Section with Grid Layout */}
        <div className="px-5 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 lg:items-start">
            {/* Left Side - Product Image, Info, and Descriptions (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Top Section - Product Image and Basic Info */}
              <div className="flex justify-start gap-x-8 max-lg:flex-col items-start gap-y-5">
                <div>
                  <Image
                    src={
                      product?.mainImage
                        ? product?.mainImage.startsWith('http')
                          ? product?.mainImage
                          : `/${product?.mainImage}`
                        : "/product_placeholder.jpg"
                    }
                    width={350}
                    height={350}
                    alt="main image"
                    className="w-[350px] h-[350px] object-cover rounded-lg"
                    unoptimized={product?.mainImage?.startsWith('http')}
                  />
                  <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
                    {images?.map((imageItem: ImageItem, key: number) => (
                      <Image
                        key={imageItem.imageID + key}
                        src={
                          imageItem.image.startsWith('http')
                            ? imageItem.image
                            : `/${imageItem.image}`
                        }
                        width={100}
                        height={100}
                        alt="laptop image"
                        className="w-auto h-auto rounded-md"
                        unoptimized={imageItem.image.startsWith('http')}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-y-4 text-black max-[500px]:text-center text-left">
                  <h1 className="text-2xl font-semibold">{sanitize(product?.title)}</h1>
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(product?.rating || 0))}{'☆'.repeat(5 - Math.round(product?.rating || 0))}
                    </div>
                    <span className="text-sm text-gray-600">({product?.rating || 0})</span>
                  </div>
                  <p className="text-xl font-bold text-custom-red">Rp {formatCurrency(product?.price)}</p>
                  <AddToWishlistBtn product={product} slug={paramsAwaited.productSlug} />

                  {/* Additional Info */}
                  <div className="space-y-3 border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-sm">Informasi Produk</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-x-2">
                        <span className="text-gray-600">Manufacturer:</span>
                        <span>Diamond Electronic</span>
                      </div>
                      <div className="flex gap-x-2">
                        <span className="text-gray-600">Category:</span>
                        <span>Elektronik</span>
                      </div>
                      <div className="flex gap-x-2">
                        <span className="text-gray-600">Color:</span>
                        <span>Silver, LightSlateGray, Blue</span>
                      </div>
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="flex items-center gap-x-2 pt-2">
                    <SocialShare
                      title={sanitize(product?.title)}
                      description={`Produk berkualitas tinggi dari Diamond Electronic: ${sanitize(product?.title)}`}
                    />
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ulasan Pelanggan</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.round(product?.rating || 4))}{'☆'.repeat(5 - Math.round(product?.rating || 4))}
                  </div>
                  <span className="text-sm text-gray-600">{product?.rating || 4.0} dari 5</span>
                </div>
                <p className="text-sm text-gray-600">Berdasarkan {Math.floor(Math.random() * 200) + 50} ulasan</p>

                {/* Sample Reviews */}
                <div className="mt-4 space-y-3">
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-yellow-400 text-sm">★★★★★</div>
                      <span className="text-xs text-gray-600">2 hari lalu</span>
                    </div>
                    <p className="text-sm text-gray-700">Produk berkualitas bagus, sesuai deskripsi. Pengiriman cepat dan packing aman.</p>
                    <p className="text-xs text-gray-500 mt-1">- Budi Santoso</p>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-yellow-400 text-sm">★★★★☆</div>
                      <span className="text-xs text-gray-600">1 minggu lalu</span>
                    </div>
                    <p className="text-sm text-gray-700">Harga terjangkau, kualitas memuaskan. Recommended seller!</p>
                    <p className="text-xs text-gray-500 mt-1">- Siti Rahayu</p>
                  </div>
                </div>
              </div>

              {/* Product Description (without Ringkasan Produk section) */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                          <span>DE-2024</span>
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
            </div>

            {/* Right Sidebar - Ringkasan Produk and Action Buttons (1/3 width) */}
            <div className="lg:col-span-1 sticky top-6 self-start">
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
                      <StockAvailabillity stock={94} inStock={product?.inStock} />
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Garansi</span>
                      <span className="font-medium">1 Tahun</span>
                    </div>
                  </div>
                </section>

                {/* Action Buttons */}
                <section className="p-6">
                  <SingleProductDynamicFields product={product} />
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
