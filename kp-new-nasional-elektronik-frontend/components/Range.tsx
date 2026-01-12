"use client";
import React, { useState } from 'react'

interface RangeProps {
    min: number;
    max: number;
    priceValue: number;
    setInputCategory: any;
}

const Range = ({ min, max, priceValue, setInputCategory } : RangeProps) => {
    const [ currentRangeValue, setCurrentRangeValue ] = useState<number>(priceValue);

    const handleRange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCurrentRangeValue(parseInt(e.target.value));
    }

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
        <input type="range" min={min} max={max} value={priceValue} className="range range-warning" />
        <span>{ `Harga maksimal: ${formatPrice(currentRangeValue)}` }</span>
    </div>
  )
}

export default Range