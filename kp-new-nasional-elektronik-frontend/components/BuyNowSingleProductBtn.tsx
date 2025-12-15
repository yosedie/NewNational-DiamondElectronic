"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
  disabled = false,
}: SingleProductBtnProps & { disabled?: boolean }) => {
  const router = useRouter();
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
    });
    calculateTotals();
  toast.success("Produk berhasil ditambahkan ke keranjang");
    router.push("/checkout");
  };
  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`btn flex-1 min-w-0 text-sm border border-1 font-normal uppercase ease-in max-[500px]:w-full transition-all ${
        disabled
          ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-60'
          : 'bg-custom-red text-white border-custom-red hover:bg-white hover:scale-110 hover:text-custom-red hover:border-custom-red'
      }`}
    >
      Buy Now
    </button>
  );
};

export default BuyNowSingleProductBtn;
