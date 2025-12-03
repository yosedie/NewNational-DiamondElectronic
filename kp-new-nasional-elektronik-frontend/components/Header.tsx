"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { setWishlist, wishQuantity } = useWishlistStore();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
  toast.success("Berhasil keluar!");
  };

  // React Query for fetching user by email
  const { data: userData } = useQuery({
    queryKey: ['user', session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const response = await apiClient.get(`/api/users/email/${session.user.email}`);
      return response.json();
    },
    enabled: !!session?.user?.email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query for fetching wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];
      const response = await apiClient.get(`/api/wishlist/${userData.id}`);
      const wishlist = await response.json();
      return wishlist.map((item: any) => ({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock
      }));
    },
    enabled: !!userData?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Update wishlist store when wishlist data changes
  useEffect(() => {
    if (wishlistData) {
      setWishlist(wishlistData);
    }
  }, [wishlistData, setWishlist]);

  // Scroll detection for sticky header - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navigation
        setIsNavVisible(false);
      } else {
        // Scrolling up - show navigation
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className="bg-white">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className={`h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto transition-transform duration-300 fixed top-10 left-0 right-0 z-40 ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <Link href="/">
            <img src="/logo v1 svg.svg" width={200} height={200} alt="Diamond Electronic logo" className="relative right-5 max-[1023px]:w-40" />
          </Link>
          <SearchInput />
          <div className="flex gap-x-10 items-center">
            {userData?.role === "admin" ? (
              <Link href="/admin" className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition-colors whitespace-nowrap">
                Admin Menu
              </Link>
            ) : (
              <>
                <HeartElement wishQuantity={wishQuantity} />
                <CartElement />
              </>
            )}
          </div>
        </div>
      )}
      {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10  max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/">
            <Image
              src="/logo v1.png"
              width={130}
              height={130}
              alt="Diamond Electronic logo"
              className="w-56 h-auto"
            />
          </Link>
          <div className="flex gap-x-5 items-center">
            <FaBell className="text-xl" />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={30}
                  height={30}
                  className="w-full h-full rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/admin">Dashboard</Link>
                </li>
                <li>
                  <a>Profile</a>
                </li>
                <li onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
