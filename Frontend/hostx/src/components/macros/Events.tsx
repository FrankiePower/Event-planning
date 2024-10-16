"use client";
import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import { EventItem } from "../micros/EventCard";
import useFetchEvents from "@/hooks/useAllEvents";
import { format } from "date-fns";
import Link from "next/link";

const Skeleton = () => (
    <div className="flex w-40 justify-end items-end h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

export function Events() {
    const { events, loading, fetchEvents } = useFetchEvents();
    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

    // Helper function to group events by date
    const groupEventsByDate = (events: any[]) => {
        // Sort events by startDate (earliest first)
        const sortedEvents = events.sort((a, b) => Number(a.startDate) - Number(b.startDate));

        // Group sorted events by their formatted startDate
        return sortedEvents.reduce((acc: any, event: any) => {
            const startDate = new Date(Number(event.startDate) * 1000); // Convert startDate to milliseconds
            const formattedDate = format(startDate, "MMMM dd, yyyy"); // Format to readable date

            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(event);
            return acc;
        }, {});
    };

    // Filter for events that are happening today or in the future
    const filterUpcomingEvents = (events: any[]) => {
        const currentTime = Date.now(); // Current timestamp in milliseconds
        return events.filter(
            (event) => Number(event.endDate) * 1000 >= currentTime // Convert endDate to milliseconds
        );
    };

    // Fetch events and filter by date
    useEffect(() => {
        const fetchAndFilterEvents = async () => {
            await fetchEvents();
            const upcomingEvents = filterUpcomingEvents(events);
            const groupedEvents = groupEventsByDate(upcomingEvents);
            setFilteredEvents(groupedEvents);
        };

        fetchAndFilterEvents();
    }, [events, fetchEvents]);

    // Create timeline data based on the filtered events
    const timelineData = Object.keys(filteredEvents).map((date) => ({
        title: date,
        content: (
            <div className="grid sm:grid-cols-2 sm:gap-4">
                {filteredEvents[date].map((event: any, index: number) => (
                    <Link
                        href={`/register?contract=${event.address}&url=${event.eventImage}`}
                        key={index}  // Use the index as the key for this component
                    >
                        <EventItem
                            key={index}
                            title={event.name}
                            description={event.description}
                            header={<Skeleton />}
                            active={new Date(Number(event.startDate) * 1000).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)}
                        />
                    </Link>
                ))}
            </div>
        ),
    }));

    return (
        <div className="w-full">

            <Timeline data={timelineData} loading={loading} />

        </div>
    );
}
