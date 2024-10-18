"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CustomConnectButton from "./ConnectButton";
import { DashboardIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  return (
    <>
      <header className="flex justify-between items-center px-2 sm:px-4 py-2">
        <Link href="/" className="">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
        </Link>
        <nav>
          <div className="flex items-center gap-5 text-stone-300/70 textsm font-semibold">
            <p className="block uppercase">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}{" "}
              GMT +1
            </p>
            <Link
              href="/manage-event"
              className="inline-flex items-center gap-1.5 hover:text-stone-200 text-sm sm:text-base"
            >
              Manage Events
              <DashboardIcon />
            </Link>
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
            <CustomConnectButton />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
