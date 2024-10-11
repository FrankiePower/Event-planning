"use client";

import NestedDate from '@/components/registerComps/NestedDate'
import Image from 'next/image'
import { CiLocationOn } from "react-icons/ci";
import DialogDemo from '@/components/registerComps/DialogDemo';
import { useState } from 'react';

const Register = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div
        className="h-screen sm:p-8 gap-16 px-4 sm:pt-16 sm:px-6 font-[family-name:var(--font-geist-sans)] text-white"
    >
       <div
        className='w-full f-full flex justify-center items-center'
       >
            
            <div
                className='rounded-xl w-7/12'
            >
                <div
                    className='flex flex-row items-center mb-4'
                >
                    <div>
                        <Image 
                            src={"/moon-cake.jpg"}
                            height={500}
                            width={500}
                            alt='moon cake'
                            className='rounded-xl'
                        />
                    </div>

                    <div
                        className='p-2 pl-10 w-full'
                    >

                        <p
                            className='text-5xl font-bold mb-2'
                        >
                            Event Title
                        </p>

                        <NestedDate />

                        <div
                            className='flex flex-row items-center mb-4'
                        >
                            <CiLocationOn 
                                className='mr-8 font-bold text-base'
                            />

                            <p
                                className='font-bold text-base'
                            >
                                Register to See Address
                            </p>
                        </div>

                        <p
                            className='text-[#f7f5f2] mb-2'
                        >
                            Registration
                        </p>

                        <p
                            className='font-semibold mb-4'
                        >
                            Welcome! To join the event, please register below.
                        </p>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='cursor-pointer w-full outline-none border-none rounded-xl p-2 bg-black text-base font-semibold text-center'
                        >
                            Register
                        </button>

                    </div>
                </div>

                <div
                    className='p-2'
                >

                    <p
                        className='font-regular text-[#f7f5f2] mb-2'
                    >
                        Hosted By
                    </p>

                    <p
                        className='font-bold text-lg/'
                    >
                        Ejezie Franklin
                    </p>

                </div>
            </div>

            <DialogDemo 
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

       </div>
    </div>
  )
}

export default Register