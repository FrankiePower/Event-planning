import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { EventItem } from "../micros/EventCard";
import {
    IconArrowWaveRightUp,
    IconBoxAlignRightFilled,
    IconBoxAlignTopLeft,
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from "@tabler/icons-react";

const Skeleton = () => (
    <div className="flex w-40 justify-end items-end h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const items = [
    {
        title: "The Dawn of Innovation",
        description: "Explore the birth of groundbreaking ideas and inventions.",
        header: <Skeleton />,
        icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Digital Revolution",
        description: "Dive into the transformative power of technology.",
        header: <Skeleton />,
        icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Art of Design",
        description: "Discover the beauty of thoughtful and functional design.",
        header: <Skeleton />,
        icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Power of Communication",
        description:
            "Understand the impact of effective communication in our lives.",
        header: <Skeleton />,
        icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
];
export function Events() {
    const data = [
        {
            title: "Today Friday",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4">
                        <EventItem title={items[0].title} description={items[0].description} icon={items[0].icon} header={items[0].header} />
                        <EventItem title={items[1].title} description={items[1].description} icon={items[1].icon} header={items[1].header} />
                    </div>
                </div>
            ),
        },
        {
            title: "Oct 12 Saturday",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4">
                        <EventItem title={items[0].title} description={items[0].description} icon={items[0].icon} header={items[0].header} />
                        <EventItem title={items[1].title} description={items[1].description} icon={items[1].icon} header={items[1].header} />
                        <EventItem title={items[1].title} description={items[1].description} icon={items[1].icon} header={items[1].header} />
                        <EventItem title={items[0].title} description={items[0].description} icon={items[0].icon} header={items[0].header} />
                    </div>
                </div>
            ),
        },
        {
            title: "Oct 13 Sunday",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4">
                        <EventItem title={items[0].title} description={items[0].description} icon={items[0].icon} header={items[0].header} />
                        <EventItem title={items[1].title} description={items[1].description} icon={items[1].icon} header={items[1].header} />
                    </div>
                </div>
            ),
        },

    ];
    return (
        <div className="w-full">
            <Timeline data={data} />
        </div>
    );
}
