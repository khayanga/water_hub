import React from 'react'

const Card = ({title, content}) => {
  return (
    <div className="bg-blue-500 hover:bg-blue-700 text-gray-200 shadow-md rounded-lg p-4 m-2 md:w-[230px]">
      <h2 className="text-[14px] font-medium mb-2">{title}</h2>
      <p className='text-2xl font-bold'>{content}</p>
    </div>
  )
}

export default Card