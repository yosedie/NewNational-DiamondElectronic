"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Header />}
      <main className={isAdminPath ? "" : "mt-44"}>
        {children}
      </main>
      {!isAdminPath && <Footer />}
    </>
  );
}
