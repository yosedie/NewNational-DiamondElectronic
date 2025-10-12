import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";
import { getCategoryIdBySlug } from "@/lib/utils";

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Price filter
  queryParams.append('filters[price][$lte]', searchParams?.price?.toString() || '3000');
  
  // Rating filter
  queryParams.append('filters[rating][$gte]', (Number(searchParams?.rating) || 0).toString());
  
  // Stock filters
  if (inStockNum === 1 && outOfStockNum === 0) {
    // Only in stock
    queryParams.append('filters[inStock][$equals]', '1');
  } else if (inStockNum === 0 && outOfStockNum === 1) {
    // Only out of stock
    queryParams.append('filters[outOfStock][$equals]', '1');
  } else if (inStockNum === 1 && outOfStockNum === 1) {
    // Both in stock and out of stock
    queryParams.append('filters[inStock][$lte]', '1');
  } else {
    // Default: show in stock items only
    queryParams.append('filters[inStock][$equals]', '1');
  }
  
  // Category filter
  if (params?.slug && params.slug.length > 0) {
    const categoryId = getCategoryIdBySlug(params.slug[0]);
    console.log('Category slug:', params.slug[0]);
    console.log('Mapped categoryId:', categoryId);

    if (categoryId) {
      // Filter by category ID
      queryParams.append('categoryId', categoryId);
    }
  }
  
  // Sort parameter
  queryParams.append('sort', searchParams?.sort?.toString() || 'defaultSort');
  
  // Page parameter
  queryParams.append('page', page.toString());

  // sending API request with filtering, sorting and pagination for getting all products
  const apiUrl = `/api/products?${queryParams.toString()}`;
  console.log('API URL:', apiUrl);
  const data = await apiClient.get(apiUrl);
  const products = await data.json();

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: Product) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          Produk tidak ditemukan
        </h3>
      )}
    </div>
  );
};

export default Products;
