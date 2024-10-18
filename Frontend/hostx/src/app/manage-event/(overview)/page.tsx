"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useFetchEvents, { IEventDetails } from "@/hooks/useAllEvents";
import { EventItem } from "@/components/micros/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const EventSkeleton = () => (
  <div className="flex w-40 justify-end items-end h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

export default function AllUserEvents() {
  const { address } = useAccount(); // Get connected wallet address
  // const staticAddress = "0x40feacdeee6f017fA2Bc1a8FB38b393Cf9022d71";
  const { events, loading, fetchEvents } = useFetchEvents();
  const [filteredEvents, setFilteredEvents] = useState<IEventDetails[]>([]);

  // Filter events where organizer matches the connected wallet address
  useEffect(() => {
    const fetchAndFilterEvents = async () => {
      await fetchEvents();
      if (events && address) {
        console.log(events);
        const userEvents = events.filter(
          (event: IEventDetails) => event.organizerAddress === address
        );
        setFilteredEvents(userEvents);
      }
    };

    fetchAndFilterEvents();
  }, [events, address, fetchEvents]);

  return (
    <main className="p-8 space-y-8">
      <h1 className="font-bold text-3xl text-stone-300">
        {loading
          ? "Hold your horses, we are working on fetching your events..."
          : filteredEvents.length > 0
          ? "You've Been Busy Champ, Here's What You've Been Up To"
          : "You Haven't Created Any Events Yet, Start Creating One!"}
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          Array(6)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="w-full h-72">
                <Skeleton className="h-full w-full rounded-3xl" />
              </div>
            ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link
              href={`/manage-event/manage/${event.address}`}
              key={event.address}
            >
              <EventItem
                className={"bg-transparent border shadow-sm"}
                title={event.name}
                description={event.description}
                header={<EventSkeleton />}
                active={true}
                venue={event.eventVenue}
              />
            </Link>
          ))
        ) : (
          <div className="p-6 bg-stone-700/30 rounded-3xl h-full">
            <div className="flex flex-col justify-center items-center h-full w-full">
              <p className="text-2xl">No events available.</p>
            </div>
          </div>
        )}

        {/* {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventItem
                            key={event.address}
                            className={"bg-transparent border shadow-sm"}
                            title={event.name}
                            description={event.description}
                            header={<Skeleton />}
                            active={true}
                            venue={event.eventVenue}
                        />
                    ))
                ) : (
                    <p className="col-span-3 text-center text-gray-400">
                        No events found for this account.
                    </p>
                )} */}
      </div>
    </main>
  );
}
