import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <>
      <header className="flex justify-between items-center px-2 sm:px-4 py-2">
        <Link href="/" className="">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
        </Link>
        <nav>
          <div className="flex items-center gap-5 text-stone-300/70 textsm font-semibold">
            <p className="hidden sm:block">2:09 PM GMT+1</p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 hover:text-stone-200 text-sm sm:text-base"
            >
              Explore Events
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>
            {/*   <button className="py-2 px-3 sm:px-4 bg-stone-700 rounded-3xl text-sm text-stone-300 hover:bg-stone-400 hover:text-stone-700"></button> */}
            <ConnectButton />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
