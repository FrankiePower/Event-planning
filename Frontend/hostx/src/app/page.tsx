"use client";
import RegisterButton from "@/components/fragments/RegisterButton";
import Image from "next/image";
import Link from "next/link";
import { readContract } from '@wagmi/core'
import abi from "../../abi.json";
import { useCallback, useState } from "react";
import { config } from "../wagmi";
import { type ReadContractReturnType } from '@wagmi/core'

export default function Home() {

  const [events, SetEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {

      const eventCount = Number(await readContract(config, {
        abi,
        address: '0x38063b78DD44a5533a6A4496c2DF46bC1106056b',
        functionName: 'eventCount',
      }))

      const eventIds = Array.from(
        { length: eventCount - 1 },
        (_, i) => i + 1
      );

      // Loop through eventIds and fetch totalSupply for each id
      const results = await Promise.all(eventIds.map(async (id) => {
        return await readContract(config, {
          abi,
          address: '0x38063b78DD44a5533a6A4496c2DF46bC1106056b',
          functionName: 'totalSupply',
          args: [id]
        });
      })); // Added closing parenthesis and bracket here

       // Set the fetched results to the events state
       SetEvents(results as never[]);

       console.log(events);

    } catch (error) {
      console.log("error fetching proposals: ", error);
    }
  }, []);

  return (
    <div className="hscreen sm:p-8 gap-16 px-4 sm:pt-16 sm:px-6 font-[family-name:var(--font-geist-sans)] text-white">
      <button onClick={fetchEvents}>click me</button>
      <h1 className="text-5xl sm:text-9xl text-stone-200 font-bold text-left fontmono tracking-tighter mt-6 sm:mt-0">
        hostX.
      </h1>

      <div className="p-6 bg-stone-700/30 rounded-3xl h-full mt-6 sm:hidden">
        <div className="flex flex-col justify-between items-start h-full">
          <p className="text-xl font-light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            temporibus, obcaecati sed vero nobis velit.
          </p>

          <div className="flex items-center justify-between mt-5 w-full">
            <div className="inline-flex items-center gap-3">
              <Link href={"/"} className="underline underline-offset-4">
                Privacy
              </Link>
              <Link href={"/"} className="underline underline-offset-4">
                Terms
              </Link>
            </div>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="/create"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create An Event
            </Link>
          </div>
        </div>
      </div>

      <div className="scrollbar-hide my-10 sm:mt-14 sm:mb-0 flex w-full snap-x snap-mandatory scroll-px-10 gap-5 overflow-x-scroll scroll-smooth px0">
        <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl sm:w-[44%] md:w-[30%] hidden sm:block">
          <div className="p-6 bg-stone-700/30 rounded-3xl h-full">
            <div className="flex flex-col justify-between items-start h-full">
              <p className="text-xl font-light">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                temporibus, obcaecati sed vero nobis velit.
              </p>

              <div className="flex items-center justify-between mt-5 w-full">
                <div className="inline-flex items-center gap-3">
                  <Link href={"/"} className="underline underline-offset-4">
                    Privacy
                  </Link>
                  <Link href={"/"} className="underline underline-offset-4">
                    Terms
                  </Link>
                </div>
                <Link
                  className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                  href="/create"
                  rel="noopener noreferrer"
                >
                  Create An Event
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl bg-green-100 sm:w-[44%] md:w-[30%]">
          <div className="rounded-3xl h-full">
            <div className="h-full relative">
              <img
                src="/flow-bubble.webp"
                alt="logo"
                className="objectfill h-full rounded-3xl"
              />

              <div className="p-4 sm:p-6 flex flex-col justify-between items-start h-full w-full absolute bg-stone-600/40 rounded-3xl top-0 left-0 text-stone-800">
                <p className="text-3xl sm:text-5xl font-semibold">
                  Web3Lasgos Conference
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                  <div className="flex flex-col items-start">
                    <p className="text-md font-semibold">Hosted By</p>
                    <p className="text-md font-semibold">Mihails Rizakovs</p>
                  </div>
                  <Link
                    className="rounded-full hover:border border-solid border-white/[.145] transition-colors flex items-center justify-center bg-stone-800 text-stone-200 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register For Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl bg-green-100 sm:w-[44%] md:w-[30%]">
          <div className="p-4 sm:p-6 bg-[#017dda] rounded-3xl h-full">
            <div className="flex flex-col justify-between items-start h-full">
              <p className="text-xl font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                temporibus, obcaecati sed vero nobis velit.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 w-full gap-5 sm:gap-0">
                <div className="flex flex-col items-start">
                  <p className="text-md font-semibold">Hosted By</p>
                  <p className="text-md font-semibold">Mihails Rizakovs</p>
                </div>

                <RegisterButton />
              </div>
            </div>
          </div>
        </div>

        <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl sm:w-[44%] md:w-[30%]">
          <div className="p-4 sm:p-6 bg-stone-700/30 rounded-3xl h-full">
            <div className="flex flex-col justify-between items-start h-full">
              <p className="text-xl font-light">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                temporibus, obcaecati sed vero nobis velit.
              </p>

              <div className="flex items-center justify-between mt-5 w-full">
                <div className="inline-flex items-center gap-3">
                  <Link href={"/"} className="underline underline-offset-4">
                    Privacy
                  </Link>
                  <Link href={"/"} className="underline underline-offset-4">
                    Terms
                  </Link>
                </div>
                <Link
                  className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create An Event
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl bg-green-100 sm:w-[44%] md:w-[30%]">
          <div className="rounded-3xl h-full">
            <div className="h-full relative">
              <img
                src="/flow-bubble.webp"
                alt="logo"
                className="objectfill h-full rounded-3xl"
              />
              <div className="p-4 sm:p-6 flex flex-col justify-between items-start h-full w-full absolute bg-stone-600/40 rounded-3xl top-0 left-0 text-stone-800">
                <p className="text-3xl sm:text-5xl font-semibold">
                  Web3Lasgos Conference
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                  <div className="flex flex-col items-start">
                    <p className="text-md font-semibold">Hosted By</p>
                    <p className="text-md font-semibold">Mihails Rizakovs</p>
                  </div>
                  <Link
                    className="rounded-full hover:border border-solid border-white/[.145] transition-colors flex items-center justify-center bg-stone-800 text-stone-200 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register For Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
