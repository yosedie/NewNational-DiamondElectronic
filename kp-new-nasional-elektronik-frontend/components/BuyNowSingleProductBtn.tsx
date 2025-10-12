"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
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
      className="btn flex-1 min-w-0 text-sm border border-custom-red hover:border-custom-red border-1 font-normal bg-custom-red text-white hover:bg-white hover:scale-110 hover:text-custom-red transition-all uppercase ease-in max-[500px]:w-full"
    >
      Buy Now
    </button>
  );
};

export default BuyNowSingleProductBtn;
