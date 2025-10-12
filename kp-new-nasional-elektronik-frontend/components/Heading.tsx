import React from 'react'

const Heading = ({ title } : { title: string }) => {
  return (
    <h2 className="text-white text-3xl font-bold text-center mt-20 max-xl:text-2xl max-md:text-xl max-sm:text-lg">{ title }</h2>
  )
}

export default Heading