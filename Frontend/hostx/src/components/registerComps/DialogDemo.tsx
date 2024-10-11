import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
	HamburgerMenuIcon,
	DotFilledIcon,
	CheckIcon,
	ChevronRightIcon,
} from "@radix-ui/react-icons";

const DialogDemo = ({isOpen, setIsOpen}:{isOpen:boolean, setIsOpen:(arg:boolean) => void}) => {
	return(
		<Dialog.Root
		open={isOpen}
	>
		<Dialog.Portal>
			<Dialog.Overlay className="w-full h-screen fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
			<Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-black p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
				<Dialog.Title className="mb-8 text-lg font-medium text-white">
					Buy Your Ticket
				</Dialog.Title>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button
							className="py-2 px-4 border border-slate-300 rounded-xl text-lg items-center justify-center rounded-full bg-transparent text-white"
							aria-label="Customise options"
						>
							Ticket
						</button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Portal>
						<DropdownMenu.Content
							className="min-w-[220px] text-white rounded-md bg-black p-[5px] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
							sideOffset={5}
						>
							<DropdownMenu.Item className="group relative flex cursor-pointer h-[35px] mb-2 select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
								VIP
							</DropdownMenu.Item>
							<DropdownMenu.Item className="group relative flex cursor-pointer h-[35px] mb-2 h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
								VVIP
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className="group relative flex cursor-pointer h-[35px] mb-2 select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
								disabled
							>
								VVVIP
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>

				</DropdownMenu.Root>

				<Dialog.Close asChild>
					<button
						onClick={() => setIsOpen(false)}
						className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
						aria-label="Close"
					>
						<Cross2Icon />
					</button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	)
}

export default DialogDemo;
