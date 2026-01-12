"use client"
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import WishItem from "@/components/WishItem";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const WishlistModule = () => {
  const { data: session, status } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();

  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/user/${id}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      console.error("Failed to fetch wishlist:", response.status);
      return;
    }
    
    const wishlistData = await response.json();
    const wishlistItems = wishlistData.data || [];

    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug: string
      stockAvailabillity: number;
    }[] = [];

    wishlistItems.map((item: any) => productArray.push({ 
      id: item?.product?.id, 
      title: item?.product?.title, 
      price: item?.product?.price, 
      image: item?.product?.mainImage, 
      slug: item?.product?.slug, 
      stockAvailabillity: item?.product?.inStock 
    }));

    setWishlist(productArray);
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      console.log("Looking up user by email:", session.user.email);
      apiClient.get(`/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => {
          console.log("User lookup response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("User lookup response data:", data);
          if (data?.id) {
            getWishlistByUserId(data.id);
          } else {
            console.error("User ID not found in response. Full response:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user by email:", error);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, wishlist.length]);
  return (
    <>

      {wishlist && wishlist.length === 0 ? (
        <h3 className="text-center text-2xl py-10 text-black max-lg:text-xl max-sm:text-lg max-sm:pt-5 max-[400px]:text-base">
          Tidak ada barang didalam daftar favorit
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist &&
                  wishlist?.map((item) => (
                    <WishItem
                      id={item?.id}
                      title={item?.title}
                      price={item?.price}
                      image={item?.image}
                      slug={item?.slug}
                      stockAvailabillity={item?.stockAvailabillity}
                      key={nanoid()}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
