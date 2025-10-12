"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { sanitize } from "@/lib/sanitize";
import apiClient from "@/lib/api";

interface Product {
  id: string;
  title: string;
  slug: string;
  mainImage?: string;
  price: number;
}

const ScrollableProductCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoScrollRef = useRef<number|null>(null);
  const [duplicatedProducts, setDuplicatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.get("/api/products");
        const productsData = await data.json();
        const validProducts = Array.isArray(productsData) ? productsData : [];
        setProducts(validProducts);

        // Duplicate products for seamless scrolling
        setDuplicatedProducts([...validProducts, ...validProducts]);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setDuplicatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const autoScroll = useCallback(() => {
    if (!containerRef.current || isDragging || isHovered) return;

    const container = containerRef.current;
    const scrollSpeed = 0.5; // Constant speed in pixels per frame

    // Continuously scroll to the right with constant speed
    container.scrollLeft += scrollSpeed;

    // When we reach the halfway point (end of first set), smoothly reset
    if (products.length > 0 && container.scrollLeft >= (container.scrollWidth / 2)) {
      // Use CSS transition for smooth reset
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = 0;
      // Reset to smooth scrolling after a brief delay
      setTimeout(() => {
        container.style.scrollBehavior = 'smooth';
      }, 50);
    }
  }, [isDragging, isHovered, products.length]);

  useEffect(() => {
    if (!loading && duplicatedProducts.length > 0) {
      // Set initial smooth scrolling behavior
      if (containerRef.current) {
        containerRef.current.style.scrollBehavior = 'smooth';
      }
      
      let lastTime = 0;
      const scrollInterval = 16; // ~60fps for consistent speed
      
      const animate = (currentTime: number) => {
        if (currentTime - lastTime >= scrollInterval) {
          autoScroll();
          lastTime = currentTime;
        }
        autoScrollRef.current = requestAnimationFrame(animate);
      };
      
      autoScrollRef.current = requestAnimationFrame(animate);

      return () => {
        if (autoScrollRef.current) {
          cancelAnimationFrame(autoScrollRef.current);
        }
      };
    }
  }, [autoScroll, loading, duplicatedProducts]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    if (!containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    // Reduced speed multiplier for slower mouse dragging
    const walk = (x - startX) * 0.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return (
      <div className="bg-white py-10">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="text-center text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white py-10">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="text-center text-gray-600">No products available at the moment.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-10">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab -mx-10 px-10"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="w-full h-48 relative overflow-hidden rounded-lg">
                  <Image
                    src={
                      product.mainImage
                        ? product.mainImage.startsWith('http')
                          ? product.mainImage
                          : `/${product.mainImage}`
                        : "/product_placeholder.jpg"
                    }
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300 p-2"
                    alt={sanitize(product?.title) || "Product image"}
                    unoptimized={product.mainImage?.startsWith('http')}
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link
                  href={`/product/${product.slug}`}
                  className="text-lg font-semibold text-gray-800 hover:text-custom-red transition-colors duration-200"
                >
                  {sanitize(product.title)}
                </Link>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ScrollableProductCards;