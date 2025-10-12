import Link from "next/link";
import React from "react";

const IntroducingSection = () => {
  return (
    <div id="introducing-section" className="py-20 pt-24 bg-gradient-to-r from-red-800 via-custom-red to-red-400">
      <div className="text-center flex flex-col gap-y-5 items-center">
        <h1 className="text-3xl text-white font-bold mb-3 max-xl:text-2xl max-md:text-xl max-sm:text-lg text-center">
          TELUSURI PRODUK KAMI
        </h1>
      </div>
    </div>
  );
};

export default IntroducingSection;
