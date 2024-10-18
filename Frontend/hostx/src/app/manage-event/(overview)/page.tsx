"use client"

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useFetchEvents from "@/hooks/useAllEvents";
import { EventItem } from "@/components/micros/EventCard";

const Skeleton = () => (
    <div className="flex w-40 justify-end items-end h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

export default function AllUserEvents() {
    // const { address } = useAccount(); // Get connected wallet address
    const staticAddress = "0x575109e921C6d6a1Cb7cA60Be0191B10950AfA6C";
    const { events, loading, fetchEvents } = useFetchEvents();
    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

    // Filter events where organizer matches the connected wallet address
    useEffect(() => {

        const fetchAndFilterEvents = async () => {
            await fetchEvents();
            if (events && staticAddress) {
                console.log(events);
                const userEvents = events.filter((event: any) => event.organizerAddress === staticAddress);
                setFilteredEvents(userEvents);
            }
        };

        fetchAndFilterEvents();
        
    }, [events, staticAddress]);


    return (
        <main className="p-8 space-y-8">
            <h1 className="font-bold text-3xl text-stone-300">
                {filteredEvents.length > 0
                    ? "You've Been Busy Champ, Here's What You've Been Up To"
                    : "You Haven't Created Any Events Yet, Start Creating One!"}
            </h1>

            <div className="grid grid-cols-3 gap-4">
                {filteredEvents.length > 0 ? (
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
                )}
            </div>
        </main>
    );
}
