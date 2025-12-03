import React from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/currencyFormatter";

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

interface InvoiceTemplateProps {
  order: Order;
  orderProducts: OrderProduct[];
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order, orderProducts }, ref) => {
    const subtotal = order?.total || 0;
    const tax = subtotal / 5;
    const shipping = 5;
    const total = subtotal + tax + shipping;

    return (
      <div ref={ref} className="p-8 bg-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-600 mt-2">Order ID: #{order?.id}</p>
            <p className="text-gray-600">Date: {new Date(Date.parse(order?.dateTime)).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">Nasional Elektronik</h2>
            <p className="text-gray-600">Diamond Electronic Shop</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">BILL TO:</h3>
            <p className="text-gray-700">{order?.name} {order?.lastname}</p>
            <p className="text-gray-600">{order?.email}</p>
            <p className="text-gray-600">{order?.phone}</p>
            {order?.company && <p className="text-gray-600">{order?.company}</p>}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">SHIP TO:</h3>
            <p className="text-gray-700">{order?.adress}</p>
            {order?.apartment && <p className="text-gray-600">{order?.apartment}</p>}
            <p className="text-gray-600">{order?.city}, {order?.postalCode}</p>
            <p className="text-gray-600">{order?.country}</p>
          </div>
        </div>

        {/* Order Status */}
        <div className="mb-6">
          <p className="text-gray-700">
            <span className="font-bold">Status: </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order?.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order?.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order?.status.toUpperCase()}
            </span>
          </p>
        </div>

        {/* Products Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2">Product</th>
              <th className="text-center py-3 px-2">Quantity</th>
              <th className="text-right py-3 px-2">Unit Price</th>
              <th className="text-right py-3 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderProducts?.map((product) => (
              <tr key={product?.id} className="border-b border-gray-200">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={product?.product?.mainImage ? `/${product?.product?.mainImage}` : "/product_placeholder.jpg"}
                        alt={product?.product?.title}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product?.product?.title}</p>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-2">{product?.quantity}</td>
                <td className="text-right py-3 px-2">Rp. {formatCurrency(product?.product?.price)}</td>
                <td className="text-right py-3 px-2">Rp. {formatCurrency(product?.product?.price * product?.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">Rp. {formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Pajak (20%):</span>
              <span className="font-semibold">Rp. {formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Pengiriman:</span>
              <span className="font-semibold">Rp. {formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
              <span className="text-xl font-bold text-gray-800">TOTAL:</span>
              <span className="text-xl font-bold text-gray-800">Rp. {formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Order Notice */}
        {order?.orderNotice && (
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <h3 className="font-bold text-gray-800 mb-2">Order Notice:</h3>
            <p className="text-gray-700">{order?.orderNotice}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
          <p>Thank you for your business!</p>
          <p className="mt-1">For any questions, please contact us at support@nasional-elektronik.com</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";
