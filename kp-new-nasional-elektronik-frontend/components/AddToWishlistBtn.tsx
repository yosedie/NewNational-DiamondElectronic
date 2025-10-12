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

  const addToWishlistFun = async () => {
    // getting user by email so I can get his user id
    if (session?.user?.email) {
      try {
        // sending fetch request to get user id because we will need it for saving wish item
        const userResponse = await apiClient.get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        });
        const userData = await userResponse.json();
        
        // Add product to wishlist
        const wishlistResponse = await apiClient.post("/api/wishlist", {
          productId: product?.id,
          userId: userData?.id
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
          toast.error(errorData.message || "Gagal menambahkan produk ke daftar keinginan");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
  toast.error("Gagal menambahkan produk ke daftar keinginan");
      }
    } else {
  toast.error("Anda harus masuk untuk menambahkan produk ke daftar keinginan");
    }
  };

  const removeFromWishlistFun = async () => {
    if (session?.user?.email) {
      try {
        // sending fetch request to get user id because we will need to delete wish item
        const userResponse = await apiClient.get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        });
        const userData = await userResponse.json();
        
        // Remove product from wishlist
        const deleteResponse = await apiClient.delete(
          `/api/wishlist/${userData?.id}/${product?.id}`
        );
        
        if (deleteResponse.ok) {
          removeFromWishlist(product?.id);
          toast.success("Produk berhasil dihapus dari daftar keinginan");
        } else {
          const errorData = await deleteResponse.json();
          toast.error(errorData.message || "Gagal menghapus produk dari daftar keinginan");
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
  toast.error("Gagal menghapus produk dari daftar keinginan");
      }
    }
  };

  const isInWishlist = async () => {
    // sending fetch request to get user id because we will need it for checking whether the product is in wishlist
    if (session?.user?.email) {
      try {
        const userResponse = await apiClient.get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        });
        const userData = await userResponse.json();
        
        // checking is product in wishlist
        const wishlistResponse = await apiClient.get(
          `/api/wishlist/${userData?.id}/${product?.id}`
        );
        const wishlistData = await wishlistResponse.json();
        
        if (wishlistData[0]?.id) {
          setIsProductInWishlist(true);
        } else {
          setIsProductInWishlist(false);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setIsProductInWishlist(false);
      }
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
