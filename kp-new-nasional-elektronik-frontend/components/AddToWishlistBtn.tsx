"use client";

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

interface AddToWishlistBtnProps {
  product: Product;
  slug: string;
}

const AddToWishlistBtn = ({ product, slug }: AddToWishlistBtnProps) => {
  const { data: session, status } = useSession();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [isProductInWishlist, setIsProductInWishlist] = useState<boolean>();
  const [userId, setUserId] = useState<string>();

  // Fetch user ID from backend
  const getUserId = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await apiClient.get(`/api/users/email/${session.user.email}`);
      if (response.ok) {
        const data = await response.json();
        setUserId(data.id);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      getUserId();
    }
  }, [session?.user?.email]);

  const addToWishlistFun = async () => {
    // Check if user is logged in
    if (!session) {
      toast.error("Anda harus masuk untuk menambahkan produk ke daftar keinginan");
      return;
    }

    if (!userId) {
      toast.error("Gagal mendapatkan informasi pengguna");
      return;
    }

    try {
      // Add product to wishlist using public endpoint
      const wishlistResponse = await apiClient.post("/api/wishlist/public", {
        productId: product?.id,
        userId: userId,
      });

      if (wishlistResponse.ok) {
        addToWishlist({
          id: product?.id,
          title: product?.title,
          price: product?.price,
          image: product?.mainImage,
          slug: product?.slug,
          stockAvailabillity: product?.inStock,
        });
        toast.success("Produk berhasil ditambahkan ke daftar keinginan");
      } else {
        const errorData = await wishlistResponse.json();
        toast.error(errorData.error || "Gagal menambahkan produk ke daftar keinginan");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Gagal menambahkan produk ke daftar keinginan");
    }
  };

  const removeFromWishlistFun = async () => {
    if (!session) {
      toast.error("Anda harus masuk untuk menghapus produk dari daftar keinginan");
      return;
    }

    if (!userId) {
      toast.error("Gagal mendapatkan informasi pengguna");
      return;
    }

    try {
      // Remove product from wishlist using public endpoint
      const deleteResponse = await apiClient.delete(
        `/api/wishlist/user/${userId}/${product?.id}`
      );

      if (deleteResponse.ok) {
        removeFromWishlist(product?.id);
        toast.success("Produk berhasil dihapus dari daftar keinginan");
      } else {
        const errorData = await deleteResponse.json();
        toast.error(errorData.error || "Gagal menghapus produk dari daftar keinginan");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Gagal menghapus produk dari daftar keinginan");
    }
  };

  const isInWishlist = async () => {
    // Check if user is logged in
    if (!session) {
      setIsProductInWishlist(false);
      return;
    }

    try {
      // Check if product is in wishlist (userId extracted from JWT token on backend)
      const wishlistResponse = await apiClient.get(
        `/api/wishlist/check/${product?.id}`
      );
      const wishlistData = await wishlistResponse.json();

      if (wishlistData?.inWishlist) {
        setIsProductInWishlist(true);
      } else {
        setIsProductInWishlist(false);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      setIsProductInWishlist(false);
    }
  };

  useEffect(() => {
    isInWishlist();
  }, [session?.user?.email, wishlist]);

  return (
    <>
      {isProductInWishlist ? (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={removeFromWishlistFun}
        >
          <FaHeartCrack className="text-lg text-custom-black" />
          <span className="text-sm">REMOVE FROM WISHLIST</span>
        </p>
      ) : (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={addToWishlistFun}
        >
          <FaHeart className="text-lg text-custom-black" />
          <span className="text-sm">ADD TO WISHLIST</span>
        </p>
      )}
    </>
  );
};

export default AddToWishlistBtn;
