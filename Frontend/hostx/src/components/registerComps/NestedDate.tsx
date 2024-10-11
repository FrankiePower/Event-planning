import React from 'react'

const NestedDate = () => {
  return (
    <div
        className='flex flex-row items-center mb-2'
    >
        <div
            className='mr-8'
        >
            <p
                className='text-xs font-regular text-[#f7f5f2]'
            >
                OCT
            </p>

            <p
                className='text-md font-regular text-[#f7f5f2]'
            >
                11
            </p>
        </div>

        <div>
            <p
                className='font-bold text-white'
            >
                Friday, October 11
            </p>

            <p
                className='font-regular text-[#f7f5f2]'
            >
                11:00 AM - 12:00 PM
            </p>
        </div>
    </div>
  )
}

export default NestedDate