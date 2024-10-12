"use client";
import {
    useMotionValueEvent,
    useScroll,
    useTransform,
    motion,
} from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Search } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Spotlight } from "../micros/Spotlight";

interface TimelineEntry {
    title: string;
    content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className="w-full bg-ransparent font-sans md:px-10"
            ref={containerRef}
        >
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />
            <div className="grid grid-cols-2">
                <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 space-y-5">

                    <div className="flex justify-center items-center w-14 h-14 bg-slate-950 rounded-full">
                        <Image src="/helsinki-icon.png" alt="logo" width={50} height={50} />
                    </div>

                    <h2 className="text-lg md:text-4xl text-white max-w-4xl">
                        Events happening around you
                    </h2>
                    <p className="text-neutral-100 text-sm md:text-base max-w-sm">
                        Discover events happening around you, everyday theres a new bubble that pops up. Be part of it today! or create your own Bubble!
                    </p>
                    <div className="w-full max-w-md relative flex items-center">
                        <Input type="email" placeholder="Enter Your Email" className="bg-transparent py-4 pl-4 placeholder:text-white/50 rounded-3xl h-12 flex-grow focus:ring-indigo-800 border border-slate-300 focus:border-white text-white" />
                        <Button type="submit" className="ml-1 sm:ml-3 bg-slate-950/80 text-white rounded-3xl h-12 flex items-center justify-center">Subscribe</Button>
                    </div>
                </div>
                <Image src="/sssurface.svg" className="justify-self-end" width={500} height={400} alt="" />
            </div>

            <div className="flex justify-between items-center px-16 mb-4">
                <h3 className="font-semibold text-4xl">
                    Events
                </h3>
                <div className="inline-flex items-center gap-2">
                    <Button className="rounded bg-slate-950/80 text-gray-300 hover:bg-slate-600">
                        <Plus className="mr-2 h-4 w-4" /> Submit Event
                    </Button>
                    <Button className="bg-slate-950/80 rounded text-gray-300 hover:bg-slate-600" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>


            <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-start pt-10 md:pt-40 md:gap-10"
                    >
                        <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                            <div className="h-7 absolute left-3 md:left-5 w-7 rounded-full bg-white dark:bg-black flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                            </div>
                            <h3 className="hidden md:block text-xl md:pl-20 md:text-2xl font-bold text-white ">
                                {item.title}
                            </h3>
                        </div>

                        <div className="relative pl-20 pr-4 md:pl-4 w-full">
                            <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white">
                                {item.title}
                            </h3>
                            {item.content}{" "}
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
