import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";
import { sanitize } from "@/lib/sanitize";
import { formatCurrency } from "@/utils/currencyFormatter";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-y-2 h-full w-full">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={
            product.mainImage
              ? product.mainImage.startsWith('http')
                ? product.mainImage
                : `/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
          width="0"
          height="0"
          sizes="100vw"
          className="w-auto h-[300px] rounded-lg"
          alt={sanitize(product?.title) || "Product image"}
          unoptimized={product.mainImage?.startsWith('http')}
        />
      </Link>
      <div className="flex flex-col items-center gap-y-2 flex-grow w-full">
        <Link
          href={`/product/${product.slug}`}
          className={
            color === "black"
              ? `text-lg text-black font-normal mt-2 uppercase text-center line-clamp-2 h-[3.5rem] leading-tight`
              : `text-lg text-white font-normal mt-2 uppercase text-center line-clamp-2 h-[3.5rem] leading-tight`
          }
        >
          {product.title}
        </Link>
      <p
        className={
          color === "black"
            ? "text-lg text-black font-semibold"
            : "text-lg text-white font-semibold"
        }
      >
        Rp {formatCurrency(product.price)}
      </p>

      <ProductItemRating productRating={product?.rating} />
        <Link
          href={`/product/${product?.slug}`}
          className="block flex justify-center items-center uppercase bg-white px-3 py-2 text-sm border border-black border-gray-300 font-bold text-custom-red shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 transition-colors duration-200"
        >
          <p>Lihat produk</p>
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
