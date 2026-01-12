"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { deleteWishItem } from "@/app/actions";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";

interface wishItemStateTrackers {
  setIsWishItemDeleted: any;
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: ProductInWishlist) => {
  const { data: session, status } = useSession();
  const { removeFromWishlist } = useWishlistStore();
  const router = useRouter();
  const [userId, setUserId] = useState<string>();

  const openProduct = (slug: string): void => {
    router.push(`/product/${slug}`);
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient.get(`/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.id) {
            setUserId(data.id);
          } else {
            console.error("User ID not found in response");
          }
        })
        .catch((error) => {
          console.error("Error fetching user by email:", error);
        });
    }
  };

  const deleteItemFromWishlist = async (productId: string) => {
    if (!userId) {
      toast.error("User tidak ditemukan");
      return;
    }

    try {
      const response = await apiClient.delete(`/api/wishlist/user/${userId}/${productId}`);

      if (response.ok) {
        removeFromWishlist(productId);
        toast.success("Item berhasil dihapus dari daftar keinginan Anda");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Gagal menghapus item dari wishlist");
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      toast.error("Terjadi kesalahan saat menghapus item");
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email]);

  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <th
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {id}
      </th>
      <th>
        <div className="w-20 h-20 mx-auto" onClick={() => openProduct(slug)}>
          <Image
            src={
              image
                ? image.startsWith('http')
                  ? image
                  : `/${image}`
                : "/product_placeholder.jpg"
            }
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-lg"
            alt={sanitize(title)}
            unoptimized={image?.startsWith('http')}
          />
        </div>
      </th>
      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {sanitize(title)}
      </td>
      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {stockAvailabillity ? (
          <span className="text-success">Stock tersedia</span>
        ) : (
          <span className="text-error">Stock habis</span>
        )}
      </td>
      <td>
        <button className="btn btn-xs bg-custom-red text-white hover:text-custom-red border border-custom-red hover:bg-white hover:text-custom-red text-sm">
          <FaHeartCrack />
          <span
            className="max-sm:hidden"
            onClick={() => deleteItemFromWishlist(id)}
          >
            remove from the wishlist
          </span>
        </button>
      </td>
    </tr>
  );
};

export default WishItem;
