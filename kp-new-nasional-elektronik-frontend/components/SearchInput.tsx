"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { sanitize } from "@/lib/sanitize";
import apiClient from "@/lib/api";
import ProductItemRating from "./ProductItemRating";

interface Product {
  id: string;
  title: string;
  slug: string;
  mainImage?: string;
  price: number;
  rating?: number;
}

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // function for modifying URL for searching products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize the search input before using it in URL
    const sanitizedSearch = sanitize(searchInput);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
    setShowDropdown(false);
  };

  // function to search products as user types
  const searchProductsAPI = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiClient.get(`/api/search?query=${encodeURIComponent(query)}`);
      const products = await data.json();
      const productArray = Array.isArray(products) ? products : [];
      setSearchResults(productArray);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    searchProductsAPI(value);
  };

  // handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative flex w-full">
      <form className="flex w-full max-w-full" onSubmit={searchProducts}>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          onFocus={() => searchInput && setShowDropdown(true)}
          placeholder="Ketik Disini"
          className="bg-gray-50 input input-bordered w-[87%] rounded-r-none outline-none focus:outline-none"
        />
        <button type="submit" className="btn bg-custom-red text-white rounded-l-none rounded-r-xl hover:bg-custom-red">
          Cari
        </button>
      </form>

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="loading loading-spinner loading-sm"></div>
              <span className="ml-2">Mencari...</span>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  setShowDropdown(false);
                  setSearchInput("");
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 mr-3">
                  <Image
                    src={
                      product.mainImage
                        ? product.mainImage.startsWith('http')
                          ? product.mainImage
                          : `/${product.mainImage}`
                        : "/product_placeholder.jpg"
                    }
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded"
                    alt={sanitize(product?.title) || "Product image"}
                    unoptimized={product.mainImage?.startsWith('http')}
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {sanitize(product.title)}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-custom-red">
                      ${product.price}
                    </span>
                    <ProductItemRating productRating={product?.rating} />
                  </div>
                </div>
              </Link>
            ))
          ) : searchInput.trim() ? (
            <div className="p-4 text-center text-gray-500">
              Tidak ada produk ditemukan untuk "{searchInput}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
