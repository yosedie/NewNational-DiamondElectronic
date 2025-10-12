import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";

const ProductsSection = async () => {
  try {
    // sending API request for getting all products
    const data = await apiClient.get("/api/products");
    const products = await data.json();
    
    // Check if products is an array, if not, use empty array as fallback
    const productArray = Array.isArray(products) ? products : [];
    
    return (
      <div className="bg-custom-red border-t-4 border-white">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="PRODUK ANDALAN" />
          <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-6 px-10 gap-y-12 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {productArray.length > 0 ? (
              productArray.map((product: Product) => (
                <ProductItem key={product.id} product={product} color="white" />
              ))
            ) : (
              <div className="col-span-full text-center text-white py-10">
                <p>No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="bg-custom-red border-t-4 border-white">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="PRODUK ANDALAN" />
          <div className="text-center text-white py-10">
            <p>Error loading products. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductsSection;
