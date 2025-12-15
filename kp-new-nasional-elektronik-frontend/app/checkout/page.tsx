"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { formatCurrency } from "@/utils/currencyFormatter";
import PaymentMethods from "@/components/PaymentMethods";
import Script from "next/script";

// Declare Midtrans Snap type
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

const CheckoutPage = () => {
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    adress: "",
    city: "",
    country: "",
    postalCode: "",
    orderNotice: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [snapLoaded, setSnapLoaded] = useState(false);
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  // Add validation functions that match server requirements
  const validateForm = () => {
    const errors: string[] = [];
    
    // Name validation
    if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    
    // Lastname validation
    if (!checkoutForm.lastname.trim() || checkoutForm.lastname.trim().length < 2) {
      errors.push("Lastname must be at least 2 characters");
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!checkoutForm.email.trim() || !emailRegex.test(checkoutForm.email.trim())) {
      errors.push("Please enter a valid email address");
    }
    
    // Phone validation (must be at least 10 digits)
    const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, '');
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10) {
      errors.push("Phone number must be at least 10 digits");
    }
    
    // Address validation
    if (!checkoutForm.adress.trim() || checkoutForm.adress.trim().length < 5) {
      errors.push("Address must be at least 5 characters");
    }
    
    // City validation
    if (!checkoutForm.city.trim() || checkoutForm.city.trim().length < 5) {
      errors.push("City must be at least 5 characters");
    }
    
    // Country validation
    if (!checkoutForm.country.trim() || checkoutForm.country.trim().length < 5) {
      errors.push("Country must be at least 5 characters");
    }
    
    // Postal code validation
    if (!checkoutForm.postalCode.trim() || checkoutForm.postalCode.trim().length < 3) {
      errors.push("Postal code must be at least 3 characters");
    }
    
    return errors;
  };

  const makePurchase = async () => {
    // Client-side validation first
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    // Basic client-side checks for required fields (UX only)
    const requiredFields = [
      'name', 'lastname', 'phone', 'email', 
      'adress', 'city', 'country', 'postalCode'
    ];
    
    const missingFields = requiredFields.filter(field => 
      !checkoutForm[field as keyof typeof checkoutForm]?.trim()
    );

    if (missingFields.length > 0) {
      toast.error("Silakan isi semua field yang diperlukan");
      return;
    }

    if (products.length === 0) {
      toast.error("Keranjang Anda kosong");
      return;
    }

    if (total <= 0) {
      toast.error("Total pesanan tidak valid");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Silakan pilih metode pembayaran");
      return;
    }

    // Check if Snap is loaded
    if (!snapLoaded || !window.snap) {
      toast.error("Payment system is loading, please wait...");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Starting Midtrans transaction...");
      
      // Prepare the order data
      const orderData = {
        name: checkoutForm.name.trim(),
        lastname: checkoutForm.lastname.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim().toLowerCase(),
        adress: checkoutForm.adress.trim(),
        postalCode: checkoutForm.postalCode.trim(),
        status: "pending",
        total: total,
        city: checkoutForm.city.trim(),
        country: checkoutForm.country.trim(),
        orderNotice: checkoutForm.orderNotice.trim(),
      };

      // Prepare items for Midtrans
      const items = products.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: product.amount
      }));

      console.log("📋 Transaction data being sent:", { orderData, items });

      // Create Midtrans transaction
      const response = await apiClient.post("/api/midtrans/transaction", {
        orderData,
        items
      });

      console.log("📡 Midtrans API Response:", response);
      
      if (!response.ok) {
        console.error("❌ Response not OK:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);
          
          if (errorData.details && Array.isArray(errorData.details)) {
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "Gagal membuat transaksi");
          }
        } catch (parseError) {
          toast.error("Gagal membuat transaksi");
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Transaction created:", data);
      
      const { snapToken, orderId } = data;

      if (!snapToken) {
        console.error("❌ Snap token is missing!");
        throw new Error("Snap token not received from server");
      }

      console.log("🎫 Snap token received, opening payment popup...");

      // Open Midtrans Snap popup
      window.snap.pay(snapToken, {
        onSuccess: function(result: any) {
          console.log("✅ Payment success:", result);
          toast.success("Pembayaran berhasil!");
          
          // Clear form and cart
          setCheckoutForm({
            name: "",
            lastname: "",
            phone: "",
            email: "",
            adress: "",
            city: "",
            country: "",
            postalCode: "",
            orderNotice: "",
          });
          clearCart();
          
          // Redirect to success page
          setTimeout(() => {
            router.push(`/payment/success?order_id=${orderId}`);
          }, 1000);
        },
        onPending: function(result: any) {
          console.log("⏳ Payment pending:", result);
          toast.success("Pembayaran pending! Silakan selesaikan pembayaran Anda.");
          
          // Clear cart but keep form
          clearCart();
          
          // Redirect to pending page
          setTimeout(() => {
            router.push(`/payment/pending?order_id=${orderId}`);
          }, 1000);
        },
        onError: function(result: any) {
          console.error("❌ Payment error:", result);
          toast.error("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: function() {
          console.log("⚠️ Payment popup closed");
          toast.error("Anda menutup popup pembayaran sebelum menyelesaikan transaksi.");
        }
      });

    } catch (error: any) {
      console.error("💥 Error in makePurchase:", error);
      
      if (error.response?.status === 400) {
        console.log("❌ Handling 400 error...");
        try {
          const errorData = await error.response.json();
          console.log("Error data:", errorData);
          if (errorData.details && Array.isArray(errorData.details)) {
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "Validation failed");
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          toast.error("Validasi gagal");
        }
      } else if (error.response?.status === 409) {
        toast.error("Terdeteksi pesanan duplikat. Silakan tunggu sebelum membuat pesanan lain.");
      } else {
        console.log("🔍 Handling generic error...");
        toast.error("Gagal membuat pesanan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      toast.error("Anda tidak memiliki item di keranjang");
      router.push("/cart");
    }
  }, []);

  return (
    <div className="bg-white">
      {/* Load Midtrans Snap script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
        onLoad={() => {
          console.log("✅ Midtrans Snap script loaded");
          setSnapLoaded(true);
        }}
        onError={() => {
          console.error("❌ Failed to load Midtrans Snap script");
          toast.error("Failed to load payment system");
        }}
      />
      
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />
      
      <div className="hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
      <div className="hidden h-full w-1/2 bg-gray-50 lg:block" aria-hidden="true" />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Informasi pesanan</h1>

        {/* Order Summary */}
        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Ringkasan pesanan
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {products.map((product) => (
                <li key={product?.id} className="flex items-start space-x-4 py-6">
                  <Image
                    src={
                      product?.image
                        ? product.image.startsWith('http')
                          ? product.image
                          : `/${product.image}`
                        : "/product_placeholder.jpg"
                    }
                    alt={product?.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-lg object-cover object-center"
                    unoptimized={product?.image?.startsWith('http')}
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product?.title}</h3>
                    <p className="text-gray-500">x{product?.amount}</p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    Rp {formatCurrency(product?.price)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>Rp {formatCurrency(total)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Pengiriman</dt>
                <dd>Rp {formatCurrency(5)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>Rp {formatCurrency(total / 5)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  Rp {formatCurrency(total === 0 ? 0 : Math.round(total + total / 5 + 5))}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
          <div className="mx-auto max-w-lg lg:max-w-none">
            {/* Contact Information */}
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
              >
                Contact information
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Depan * (min 2 characters)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.name}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        name: e.target.value,
                      })
                    }
                    type="text"
                    id="name-input"
                    name="name-input"
                    autoComplete="given-name"
                    required
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="lastname-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Belakang * (min 2 characters)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.lastname}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        lastname: e.target.value,
                      })
                    }
                    type="text"
                    id="lastname-input"
                    name="lastname-input"
                    autoComplete="family-name"
                    required
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="phone-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number * (min 10 digits)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        phone: e.target.value,
                      })
                    }
                    type="tel"
                    id="phone-input"
                    name="phone-input"
                    autoComplete="tel"
                    required
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Alamat email *
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="mt-10">
              <PaymentMethods
                onSelectPayment={setSelectedPaymentMethod}
                selectedPayment={selectedPaymentMethod}
              />
            </section>

            {/* Shipping Address */}
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2
                id="shipping-heading"
                className="text-lg font-medium text-gray-900"
              >
                Alamat pengiriman
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      required
                      disabled={isSubmitting}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.adress}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          adress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      required
                      disabled={isSubmitting}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.city}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="region"
                      name="region"
                      autoComplete="address-level1"
                      required
                      disabled={isSubmitting}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.country}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      name="postal-code"
                      autoComplete="postal-code"
                      required
                      disabled={isSubmitting}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-red focus:ring-custom-red sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.postalCode}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="order-notice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Order notice
                  </label>
                  <div className="mt-1">
                    <textarea
                      className="textarea textarea-bordered textarea-lg w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                      id="order-notice"
                      name="order-notice"
                      autoComplete="order-notice"
                      disabled={isSubmitting}
                      value={checkoutForm.orderNotice}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          orderNotice: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 ml-0">
              <button
                type="button"
                onClick={makePurchase}
                disabled={isSubmitting}
                className="w-full rounded-md border border-transparent bg-custom-red px-16 py-2 text-base font-medium text-white shadow-sm hover:bg-custom-red focus:outline-none focus:ring-2 focus:ring-custom-red focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
