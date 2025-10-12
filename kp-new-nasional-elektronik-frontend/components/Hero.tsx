"use client";
import Image from "next/image";
import React from "react";
import { FaArrowDown } from "react-icons/fa";
import Link from "next/link";

const Hero = () => {
  const scrollToIntroducing = () => {
    const element = document.getElementById('introducing-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-[500px] w-full bg-custom-red max-lg:h-[600px] max-md:h-[500px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            Tujuan Utama Anda untuk Peralatan Rumah Tangga
          </h1>
          <p className="text-white max-sm:text-sm">
            Berlokasi di jantung kota Surabaya, Diamond Electronic berkomitmen untuk meningkatkan gaya hidup Anda dengan rangkaian peralatan berkualitas pilihan.
          </p>
          <div className="flex gap-x-3 max-lg:flex-col max-lg:gap-y-2">
            <Link href="/shop" className="bg-white text-custom-red font-bold px-8 py-2 max-lg:text-xl max-sm:text-lg hover:bg-gray-100 flex items-center justify-center">
              BELI SEKARANG
            </Link>
            <button
              onClick={scrollToIntroducing}
              className="bg-white text-custom-red font-bold px-8 py-2 max-lg:text-xl max-sm:text-lg hover:bg-gray-100 flex items-center gap-2 group transition-all duration-300 hover:scale-105"
            >
              INFO LANJUT
              <FaArrowDown className="transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </div>
        </div>
        <Image
          src="/watch for banner.png"
          width={400}
          height={400}
          alt="smart watch"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
