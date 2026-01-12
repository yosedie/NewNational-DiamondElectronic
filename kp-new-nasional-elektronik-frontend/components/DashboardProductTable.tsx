"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { formatCurrency } from "@/utils/currencyFormatter";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiClient.get("/api/products?mode=admin", { cache: "no-store" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      });
  }, []);

  return (
    <div className="w-full p-4">
      <div className="flex justify-end mb-5">
        <Link href="/admin/products/new">
          <CustomButton
            buttonType="button"
            customWidth="110px"
            paddingX={10}
            paddingY={5}
            textSize="base"
            text="Add new product"
          />
        </Link>
      </div>

      <div className="overflow-x-auto max-h-[70vh]">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>Product</th>
              <th>Ketersediaan Stock</th>
              <th>Harga</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {products &&
              products.map((product) => (
                <tr key={nanoid()}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <Image
                            width={48}
                            height={48}
                            src={
                              product?.mainImage
                                ? product.mainImage.startsWith("http")
                                  ? product.mainImage
                                  : product.mainImage.startsWith("//")
                                    ? `https:${product.mainImage}`
                                    : product.mainImage.startsWith("/")
                                      ? product.mainImage
                                      : `/${product.mainImage}`
                                : "/product_placeholder.jpg"
                            }
                            alt={sanitize(product?.title) || "Product image"}
                            className="w-auto h-auto"
                            unoptimized={
                              product?.mainImage?.startsWith("http") ||
                              product?.mainImage?.startsWith("//")
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{sanitize(product?.title)}</div>
                        <div className="text-sm opacity-50">
                          {sanitize(product?.manufacturer)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {!product.inStock ? (<span className="badge badge-success text-white badge-sm">
                      Stock tersedia
                    </span>) : (<span className="badge badge-error text-white badge-sm">
                      Stock habis
                    </span>)}

                  </td>
                  <td>Rp {formatCurrency(product?.price)}</td>
                  <th>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      Edit
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Product</th>
              <th>Ketersediaan Stock</th>
              <th>Harga</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DashboardProductTable;
