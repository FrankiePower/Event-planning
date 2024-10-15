"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Activity,
    CreditCard,
    DollarSign,
    Menu,
    Package2,
    Plus,
    Smile,
    Globe,
    Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import EventStatCard from "@/components/micros/EventStatCard"
import InfoComponent from "@/components/micros/InfoComponent"
import Image from "next/image"
import { EventCommand } from "@/components/micros/EventCommand"

// Define a type for the keys of tabContent
type TabKeys = 'overview' | 'guests' | 'insight' | 'more';

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState<TabKeys>("overview")

    const handleTabClick = (tab: TabKeys) => (event: React.MouseEvent) => {
        event.preventDefault()
        setActiveTab(tab)
    }

    const tabContent = {
        overview: <OverviewContent />,
        guests: <GuestsContent />,
        insight: <InsightContent />,
        more: <MoreContent />,
    }

    return (
        <>
            <h1 className="font-bold text-3xl text-stone-300 pl-6 py-4">Lorem ipsum dolor sit</h1>
            <div className="flex min-h-screen w-full flex-col">
                <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold md:text-base"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                            href="#"
                            className={`transition-colors hover:text-foreground ${activeTab === "overview" ? "text-foreground" : "text-muted-foreground"
                                }`}
                            onClick={handleTabClick("overview")}
                        >
                            Overview
                        </Link>
                        <Link
                            href="#"
                            className={`transition-colors hover:text-foreground ${activeTab === "guests" ? "text-foreground" : "text-muted-foreground"
                                }`}
                            onClick={handleTabClick("guests")}
                        >
                            Guests
                        </Link>
                        <Link
                            href="#"
                            className={`transition-colors hover:text-foreground ${activeTab === "insight" ? "text-foreground" : "text-muted-foreground"
                                }`}
                            onClick={handleTabClick("insight")}
                        >
                            Insight
                        </Link>
                        <Link
                            href="#"
                            className={`transition-colors hover:text-foreground ${activeTab === "more" ? "text-foreground" : "text-muted-foreground"
                                }`}
                            onClick={handleTabClick("more")}
                        >
                            more
                        </Link>

                    </nav>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <Package2 className="h-6 w-6" />
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                                <Link
                                    href="#"
                                    className={`hover:text-foreground ${activeTab === "overview" ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                    onClick={(event) => {
                                        handleTabClick("overview")(event)

                                    }}
                                >
                                    Overview
                                </Link>
                                <Link
                                    href="#"
                                    className={`hover:text-foreground ${activeTab === "guests" ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                    onClick={(event) => {
                                        handleTabClick("guests")(event)

                                    }}
                                >
                                    Guests
                                </Link>
                                <Link
                                    href="#"
                                    className={`hover:text-foreground ${activeTab === "insight" ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                    onClick={(event) => {
                                        handleTabClick("insight")(event)

                                    }}
                                >
                                    Insight
                                </Link>
                                <Link
                                    href="#"
                                    className={`hover:text-foreground ${activeTab === "more" ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                    onClick={(event) => {
                                        handleTabClick("more")(event)

                                    }}
                                >
                                    More
                                </Link>

                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="flex justify-between gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <EventCommand />
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    {tabContent[activeTab]}
                </main>
            </div>
        </>
    )
}

function OverviewContent() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">

                <EventStatCard title="Total Revenue" value="$45,231.89" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />

                <EventStatCard title="Registrations" value="+2350" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />

                <EventStatCard title="Speakers" value="12" icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />

                <EventStatCard title="Sponsors" value="53" icon={<Activity className="h-4 w-4 text-muted-foreground" />} />

            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">

                <div className="xl:col-span-2 bg-transparent">
                    <InfoComponent title="Total Revenue" date="2023-06-23" time="10:00 AM" host={{ name: "Olivia Martin", email: "olivia.martin@email.com" }} eventLink="hjfhg" />
                </div>

                <div className="grid gap-3">    
                    <div className="w-full p-4 border rounded-xl space-y-5">
                        <div className="flex justify-between items-center w-full">
                            <h4 className="font-semibold text-md">Hosts</h4>
                            <Button className="rounded bg-stone-950/60 text-gray-300 hover:bg-stone-600">
                                <Plus className="mr-2 h-4 w-4" /> Add Host
                            </Button>
                        </div>

                        <div className="font-light text-md">
                            Add hosts, special guests, and event managers.
                        </div>
                    </div>

                    <div className="w-full p-4 border rounded-xl space-y-5">
                        <div className="flex justify-between items-center w-full">
                            <h4 className="font-semibold text-md">Guests</h4>
                            <Button className="rounded bg-stone-950/60 text-gray-300 hover:bg-stone-600">
                                <Plus className="mr-2 h-4 w-4" /> Add Guest
                            </Button>
                        </div>

                        <div className="font-light text-md">
                            Add hosts, special guests, and event managers.
                        </div>
                    </div>

                    <div className="w-full p-4 border rounded-xl space-y-5">
                        <div className="flex items-start gap-4">
                            <Smile className="h-8 w-8" />
                            <div className="flex flex-col items-start w-full gap-3">
                                <div>
                                    <p className="text-stone-400 text-xs">Manage Event Visibility</p>
                                    <h4 className="text-xl font-sem">Lorem ipsum dolor sit</h4>
                                </div>
                                <div className="inline-flex items-center gap-1 text-sm">
                                    <span className="inline-flex items-center text-lime-600 gap-1">
                                        <Globe size={15} /> Public 
                                    </span>
                                    - Event is visible to sponsors.
                                </div>
                                <Button className="rounded bg-stone-800 text-gray-300 hover:bg-stone-600">
                                    <Eye className="mr-2 h-4 w-4" /> Change Visibility
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}

function GuestsContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>guests</CardTitle>
                <CardDescription>Here you can manage your guests.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>guests content goes here.</p>
            </CardContent>
        </Card>
    )
}

function InsightContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>insight</CardTitle>
                <CardDescription>Manage your product inventory here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>insight content goes here.</p>
            </CardContent>
        </Card>
    )
}

function MoreContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>more</CardTitle>
                <CardDescription>View and manage your customer base.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>more content goes here.</p>
            </CardContent>
        </Card>
    )
}