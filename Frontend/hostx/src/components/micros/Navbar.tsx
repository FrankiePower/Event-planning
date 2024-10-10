import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <>
        <header className='flex justify-between items-center px-4 py-2'>
            {/* <Link href="/" className='inline-flex items-center text-stone-400'>
                <Image src="/logo.png" alt="logo" width={50} height={50} />
                <span className="font-semibold pt-0.5">
                    hostx
                </span>
            </Link> */}
            <Link href="/" className=''>
                <Image src="/logo.png" alt="logo" width={50} height={50} />
            </Link>
            <nav>
                <div className="flex items-center gap-5 text-stone-300/70 textsm font-semibold">
                    <p>2:09 PM GMT+1</p>
                    <Link href="/events" className='inline-flex items-center gap-2 hover:text-stone-200'>
                        Explore Events
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    </Link>
                    <button className='py-2 px-4 bg-stone-700 rounded-3xl text-sm text-stone-300 hover:bg-stone-400 hover:text-stone-700'>Connect wallet</button>
                </div>
            </nav>
        </header>
    </>
  )
}

export default Navbar