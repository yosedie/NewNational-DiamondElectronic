"use client";



import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";



const AddToCartSingleProductBtn = ({ product, quantityCount, disabled = false }: SingleProductBtnProps & { disabled?: boolean }) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    if (disabled) {
      toast.error("Produk tidak tersedia");
      return;
    }
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
      slug: product?.slug
    });
    calculateTotals();
    toast.success("Produk berhasil ditambahkan ke keranjang");
  };
  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`btn flex-1 min-w-0 text-sm border border-1 font-normal uppercase ease-in max-[500px]:w-full transition-all ${disabled
          ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-60'
          : 'bg-white text-custom-red border-gray-300 hover:bg-custom-red hover:text-white hover:border-custom-red hover:scale-110'
        }`}
    >
      Add to cart
    </button>
  );
};

export default AddToCartSingleProductBtn;
