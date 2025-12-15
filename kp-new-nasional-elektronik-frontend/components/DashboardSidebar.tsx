"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200
          ${isActive
            ? "bg-custom-red text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        <div className={`text-xl ${isActive ? "text-white" : "text-gray-600"}`}>
          {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
    </Link>
  );
};

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: "/admin", icon: <MdDashboard />, label: "Dashboard" },
    { href: "/admin/orders", icon: <FaBagShopping />, label: "Orders" },
    { href: "/admin/products", icon: <FaTable />, label: "Products" },
    { href: "/admin/categories", icon: <MdCategory />, label: "Categories" },
    { href: "/admin/users", icon: <FaRegUser />, label: "Users" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </h2>
        </div>

        {/* Navigation Items */}
        <nav className="py-4">
          {menuItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            v1.0.0 © 2025 Nasional Elektronik
          </p>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-6 right-6 lg:hidden z-50 bg-custom-red text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </>
  );
};

export default DashboardSidebar;
