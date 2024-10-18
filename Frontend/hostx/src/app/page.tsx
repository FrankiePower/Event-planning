"use client";
import Link from "next/link";
import { useEffect } from "react";
import LandingEventCard from "@/components/micros/LandingEventCard";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchEvents from "@/hooks/useAllEvents";
import { CircleChevronRight } from "lucide-react";

export default function Home() {
  const { events, loading, fetchEvents } = useFetchEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
    if (events.length > 0) {
      console.log("Updated events state: ", events);
    }
  }, [events]);

  return (
    <div className="hscreen sm:p-8 gap-16 px-4 sm:pt-16 sm:px-6 font-[family-name:var(--font-geist-sans)] text-white">

      <button onClick={fetchEvents}>click me</button>

      <h1 className="text-5xl sm:text-9xl text-stone-200 font-bold text-left fontmono tracking-tighter mt-6 sm:mt-0">
        hostX.
      </h1>

      <div className="p-6 bg-stone-700/30 rounded-3xl h-full mt-6 sm:hidden">
        <div className="flex flex-col justify-between items-start h-full">
          <p className="text-xl font-light">
            Join the hostX community to discover the most epic events, meet like-minded thrill-seekers, and create unforgettable experiences. Sig     </p>

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
                Join the hostX community to discover the most epic events, meet like-minded thrill-seekers, and create unforgettable experiences!
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

        {loading ? (
          Array(3).fill(null).map((_, i) => (
            <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl sm:w-[44%] md:w-[30%] hidden sm:block">
              <Skeleton key={i} className="h-full w-full rounded-3xl" />
            </div>
          ))
        ) : (
          events.length > 0 ? (
            events.slice(0, 6).map((event) => (
              <LandingEventCard
                key={event.address}
                title={event.name}
                organizer={event.organizerAddress || "Unknown Organizer"} // Handle undefined organizer
              />
            ))
          ) : (
            <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl sm:w-[44%] md:w-[30%] hidden sm:block">
              <div className="p-6 bg-stone-700/30 rounded-3xl h-full">
                <div className="flex flex-col justify-center items-center h-full w-full">
                  <p className="text-2xl">No events available.</p>
                </div>
              </div>
            </div>
          )
        )}

        <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl sm:w-[44%] md:w-[30%] group">
          <Link href={'/events'}>
            <div className="p-6 bg-stone-700/30 group-hover:bg-stone-600 rounded-3xl h-full">
              <div className="flex flex-col justify-center items-center w-full h-full gap-4">
                <CircleChevronRight size={50} className="text-stone-600 group-hover:text-stone-400" />
                <p className="text-2xl font-semibold text-stone-600 group-hover:text-stone-400">Explore More events</p>
              </div>
            </div>
          </Link>
        </div>


        {/* {events.map((event) => (
          <LandingEventCard 
            key={event.address} 
            title={event.name} 
            organizer={event.organizerAddress || "Unknown Organizer"} // Handle undefined organizer
          />
        ))} */}

        {/* <div className="md:2/3 relative aspect-[3/3] w-[90%] shrink-0 snap-start snap-always rounded-3xl bg-green-100 sm:w-[44%] md:w-[30%]">
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
        </div> */}

      </div>


    </div>
  );
}
