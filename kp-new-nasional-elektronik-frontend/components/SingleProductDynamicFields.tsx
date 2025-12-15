"use client";
import React, { useState } from "react";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";
import BuyNowSingleProductBtn from "./BuyNowSingleProductBtn";

const SingleProductDynamicFields = ({ product }: { product: Product }) => {
  const [quantityCount, setQuantityCount] = useState<number>(1);
  const isInStock = Boolean(product.inStock);

  return (
    <>
      <QuantityInput
        quantityCount={quantityCount}
        setQuantityCount={setQuantityCount}
      />
      <div className="mb-4"></div>
      <div className="flex gap-x-5 justify-between w-full max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-y-1">
        <AddToCartSingleProductBtn
          quantityCount={quantityCount}
          product={product}
          disabled={!isInStock}
        />
        <BuyNowSingleProductBtn
          quantityCount={quantityCount}
          product={product}
          disabled={!isInStock}
        />
      </div>
    </>
  );
};

export default SingleProductDynamicFields;
