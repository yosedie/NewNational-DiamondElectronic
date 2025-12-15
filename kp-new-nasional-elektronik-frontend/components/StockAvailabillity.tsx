import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import { FaXmark } from "react-icons/fa6";


const StockAvailabillity = ({ stock, inStock } : { stock: number, inStock: number }) => {
  return ( 
    <>
      { inStock > 0 ? <span className='text-success flex items-center gap-x-1'>Stok tersedia</span> :  <span className='text-error flex items-center gap-x-1'>Stok habis</span>}
    </>
  )
}

export default StockAvailabillity