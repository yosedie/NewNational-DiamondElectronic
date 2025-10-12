import dynamic from "next/dynamic";
import { CategoryMenu, Hero, Incentives, Newsletter } from "@/components";

// Dynamically import heavy components
const ScrollableProductCards = dynamic(() => import("@/components/ScrollableProductCards"), {
  loading: () => <div className="min-h-[200px] flex items-center justify-center">Loading products...</div>,
  ssr: true,
});

const ProductsSection = dynamic(() => import("@/components/ProductsSection"), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center">Loading products...</div>,
  ssr: true,
});

const IntroducingSection = dynamic(() => import("@/components/IntroducingSection"), {
  loading: () => <div className="min-h-[200px] flex items-center justify-center">Loading...</div>,
  ssr: true,
});

export default function Home() {
  return (
    <>
    <Hero />
    <IntroducingSection />
    <ScrollableProductCards />
    <CategoryMenu />
    <ProductsSection />
    </>
  );
}
