"use client";



import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";



const AddToCartSingleProductBtn = ({ product, quantityCount } : SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount
    });
    calculateTotals();
  toast.success("Produk berhasil ditambahkan ke keranjang");
  };
  return (
    <button
      onClick={handleAddToCart}
      className="btn flex-1 min-w-0 text-sm border border-gray-300 border-1 font-normal bg-white text-custom-red hover:bg-custom-red hover:text-white hover:border-custom-red hover:scale-110 transition-all uppercase ease-in max-[500px]:w-full"
    >
      Add to cart
    </button>
  );
};

export default AddToCartSingleProductBtn;
