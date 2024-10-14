"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    ChevronsUpDownIcon,
    CreditCard,
    Settings,
    Smile,
    User,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import Image from "next/image"

export function EventCommand() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <div className="inline-flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>J
                    </kbd>
                </p>
                <button onClick={() => setOpen(true)} className="inline-flex w-full items-center gap-2 py-2 px-3 bg-stone-900 text-white hover:bg-stone-700 rounded-xl">
                    <Image src={"/profile.svg"} width={14} height={14} className={"rounded-full"} alt={"profile"} />
                    <p className="text-sm">nwachukwu's event</p>
                    <ChevronsUpDownIcon size={16} />
                </button>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Your Events">
                        <CommandItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Web3Lagos Conference</span>
                        </CommandItem>
                        <CommandItem>
                            {/* <Smile className="mr-2 h-4 w-4" /> */}
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Rust Monday Classes</span>
                        </CommandItem>
                        <CommandItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Scroll Hackathon</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
