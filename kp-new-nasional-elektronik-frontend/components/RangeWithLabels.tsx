"use client";

import React, { useState } from "react";

const RangeWithLabels = () => {
  const [currentRangeWLabelsValue, setCurrentRangeWLabelsValue] =
    useState<number>(200000);

  // function for handling range change
  const handleRangeWLabelsValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentRangeWLabelsValue(parseInt(e.target.value));
  };

  // Format currency to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <span className="label-text text-lg text-black">Harga filter:</span>
      <input
        type="range"
        min={200000}
        max={3400000}
        value={currentRangeWLabelsValue}
        onChange={(e) => handleRangeWLabelsValue(e)}
        className="range range-warning"
        step="200000"
      />
      <div className="w-full flex justify-between text-xs px-2">
        <span>Rp 200.000</span>
        <span>Rp 1.200.000</span>
        <span>Rp 2.200.000</span>
        <span>Rp 3.000.000</span>
        <span>Rp 3.400.000</span>
      </div>
    </div>
  );
};

export default RangeWithLabels;
