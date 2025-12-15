"use client";
import { DashboardSidebar } from "@/components";
import { InvoiceTemplate } from "@/components/InvoiceTemplate";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import { formatCurrency } from "@/utils/currencyFormatter";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${order?.id}`,
  });

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await apiClient.get(
        `/api/orders/${params?.id}`
      );
      const data: Order = await response.json();
      setOrder(data);
    };

    const fetchOrderProducts = async () => {
      const response = await apiClient.get(
        `/api/order-product/${params?.id}`
      );
      const data: OrderProduct[] = await response.json();
      // Ensure data is always an array to prevent "map is not a function" errors
      setOrderProducts(Array.isArray(data) ? data : []);
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      order?.name?.length > 0 &&
      order?.lastname?.length > 0 &&
      order?.phone?.length > 0 &&
      order?.email?.length > 0 &&
      order?.adress?.length > 0 &&
      order?.city?.length > 0 &&
      order?.country?.length > 0 &&
      order?.postalCode?.length > 0
    ) {
      if (!isValidNameOrLastname(order?.name)) {
        toast.error("Format nama yang Anda masukkan tidak valid");
        return;
      }

      if (!isValidNameOrLastname(order?.lastname)) {
        toast.error("Format nama belakang yang Anda masukkan tidak valid");
        return;
      }

      if (!isValidEmailAddressFormat(order?.email)) {
        toast.error("Format email yang Anda masukkan tidak valid");
        return;
      }

      apiClient.put(`/api/orders/${order?.id}`, order)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Pesanan berhasil diperbarui");
          } else {
            throw Error("There was an error while updating a order");
          }
        })
        .catch((error) =>
          toast.error("Terjadi kesalahan saat memperbarui pesanan")
        );
    } else {
      toast.error("Silakan isi semua field");
    }
  };

  const deleteOrder = async () => {
    const requestOptions = {
      method: "DELETE",
    };

    apiClient.delete(
      `/api/order-product/${order?.id}`,
      requestOptions
    ).then((response) => {
      apiClient.delete(
        `/api/orders/${order?.id}`,
        requestOptions
      ).then((response) => {
        toast.success("Pesanan berhasil dihapus");
        router.push("/admin/orders");
      });
    });
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Order details</h1>
        <div className="mt-5">
          <label className="w-full">
            <div>
              <span className="text-xl font-bold">Order ID:</span>
              <span className="text-base"> {order?.id}</span>
            </div>
          </label>
        </div>
        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Nama Depan:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.name || ""}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Nama Belakang:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.lastname || ""}
                onChange={(e) =>
                  setOrder({ ...order, lastname: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Phone number:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.phone || ""}
              onChange={(e) => setOrder({ ...order, phone: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email adress:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={order?.email || ""}
              onChange={(e) => setOrder({ ...order, email: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Company (optional):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.company || ""}
              onChange={(e) => setOrder({ ...order, company: e.target.value })}
            />
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Address:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.adress || ""}
                onChange={(e) => setOrder({ ...order, adress: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Apartment, suite, etc. :</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.apartment || ""}
                onChange={(e) =>
                  setOrder({ ...order, apartment: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">City:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.city || ""}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Country:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.country || ""}
                onChange={(e) =>
                  setOrder({ ...order, country: e.target.value })
                }
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Postal Code:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.postalCode || ""}
                onChange={(e) =>
                  setOrder({ ...order, postalCode: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Order status</span>
            </div>
            <select
              className="select select-bordered"
              value={order?.status || "processing"}
              onChange={(e) =>
                setOrder({
                  ...order,
                  status: e.target.value as
                    | "processing"
                    | "delivered"
                    | "canceled",
                })
              }
            >
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Order notice:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={order?.orderNotice || ""}
              onChange={(e) =>
                setOrder({ ...order, orderNotice: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        <div className="flex gap-x-6 items-start">
          {/* Left Side - Product Images */}
          <div className="flex flex-col gap-y-4">
            {orderProducts?.map((product) => (
              <Image
                key={product?.id}
                src={
                  product?.product?.mainImage
                    ? product?.product?.mainImage.startsWith('http')
                      ? product?.product?.mainImage
                      : `/${product?.product?.mainImage}`
                    : "/product_placeholder.jpg"
                }
                alt={product?.product?.title}
                width={120}
                height={120}
                className="object-cover rounded-lg"
                unoptimized={product?.product?.mainImage?.startsWith('http')}
              />
            ))}
          </div>

          {/* Right Side - Product Details and Pricing */}
          <div className="flex-1">
            {/* Product Details */}
            {orderProducts?.map((product) => (
              <div key={product?.id} className="mb-4">
                <Link href={`/product/${product?.product?.slug}`} className="text-lg font-semibold hover:text-custom-red">
                  {product?.product?.title}
                </Link>
                <p className="text-gray-600 mt-1">
                  Rp. {formatCurrency(product?.product?.price)} * {product?.quantity} items
                </p>
              </div>
            ))}

            {/* Pricing Summary */}
            <div className="flex flex-col gap-y-2 mt-6 pt-6 border-t border-gray-200">
              <p className="text-xl">Subtotal: Rp. {formatCurrency(order?.total)}</p>
              <p className="text-xl">Pajak 20%: Rp. {formatCurrency(order?.total / 5)}</p>
              <p className="text-xl">Pengiriman: Rp. {formatCurrency(5)}</p>
              <p className="text-2xl font-semibold mt-2 pt-2 border-t border-gray-300">
                Total: Rp. {formatCurrency(order?.total + order?.total / 5 + 5)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-x-2 max-sm:flex-col mt-5">
          <button
            type="button"
            className="uppercase bg-blue-600 px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2"
            onClick={handlePrint}
          >
            Print Invoice
          </button>
          <button
            type="button"
            className="uppercase bg-custom-red px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={updateOrder}
          >
            Update order
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteOrder}
          >
            Delete order
          </button>
        </div>
      </div>

      {/* Hidden Invoice Template for Printing */}
      <div className="hidden">
        <InvoiceTemplate
          ref={invoiceRef}
          order={order}
          orderProducts={orderProducts || []}
        />
      </div>
    </div>
  );
};

export default AdminSingleOrder;
