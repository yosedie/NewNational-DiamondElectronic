"use client";
import React from "react";
import { useSortStore } from "@/app/_zustand/sortStore";

const SortBy = () => {
  // getting values from Zustand sort store
  const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-x-5 max-lg:flex-col max-lg:w-full max-lg:items-start">
      <h3 className="text-xl">Urutkan bedasarkan:</h3>
      <select
        defaultValue={sortBy}
        onChange={(e) => changeSortBy(e.target.value)}
        className="select border-gray-400 py-2 px-2 text-base border-2 select-bordered w-40 focus:outline-none outline-none max-lg:w-full bg-white"
        name="sort"
      >
        <option value="defaultSort">Default</option>
        <option value="titleAsc">Urutkan A-Z</option>
        <option value="titleDesc">Urutkan Z-A</option>
        <option value="lowPrice">Lowest Harga</option>
        <option value="highPrice">Highest Harga</option>
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>
  );
};

export default SortBy;
