import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";
import { getCategoryIdBySlug } from "@/lib/utils";

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockParam = searchParams?.inStock === "true";
  const outOfStockParam = searchParams?.outOfStock === "true";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Price filter - use simple parameter
  if (searchParams?.price) {
    queryParams.append('price', searchParams.price.toString());
  }
  
  // Rating filter - use simple parameter
  if (searchParams?.rating) {
    queryParams.append('rating', searchParams.rating.toString());
  }
  
  // Stock filters - use simple parameters
  queryParams.append('inStock', inStockParam.toString());
  queryParams.append('outOfStock', outOfStockParam.toString());
  
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
