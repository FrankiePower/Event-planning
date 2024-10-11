"use client";

import React, { useState } from "react";
import {
  MapPin,
  FileText,
  Ticket,
  Users,
  ChevronDown,
  GlobeIcon,
} from "lucide-react";
import { zoro } from "@/asset";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Create = () => {
  const [position, setPosition] = useState("");
  const [requireApproval, setRequireApproval] = useState(false);
  return (
    <div className="flex justify-center place-content-center p-10 gap-6 bg-gradient-to-r from-blue-800 to-indigo-900">
      <div className="flex flex-col gap-4">
        <Image
          src={zoro}
          alt="zoro"
          width={330}
          height={330}
          className="rounded-xl"
        />
        <Image
          src={zoro}
          alt="zoro"
          width={330}
          height={330}
          className="rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Personal Calendar <ChevronDown className="mr-2" size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">
                  Bottom
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">
                  Right
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <GlobeIcon className="mr-2" size={20} /> Public
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">
                  Bottom
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">
                  Right
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <input
            type="text"
            placeholder="Event Name"
            className="text-4xl bg-transparent border-none outline-none"
          />
        </div>
        <div className=" grid grid-cols-1 gap-2 bg-white bg-opacity-10 rounded-xl p-3">
          <div className="flex items-center">
            <MapPin className="mr-2" size={20} />
            <input
              type="text"
              placeholder="Add Event Location"
              className="bg-transparent w-full outline-none placeholder-white placeholder-opacity-70"
            />
          </div>
          <p className="ml-6">Offline Location or Virtual Link</p>
        </div>
        <div className="flex items-center bg-white bg-opacity-10 rounded-xl p-3">
          <FileText className="mr-2" size={20} />
          <input
            type="text"
            placeholder="Add Description"
            className="bg-transparent text-white rounded-lg w-full outline-none"
          />
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Event Options</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-xl p-3">
              <div className="flex items-center">
                <Ticket className="mr-2" size={20} />
                <span>Tickets</span>
              </div>
              <span>Free</span>
            </div>

            <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-xl p-3">
              <span>Require Approval</span>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                  requireApproval ? "bg-blue-600" : "bg-blue-400"
                }`}
                onClick={() => setRequireApproval(!requireApproval)}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                    requireApproval ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between bg-white bg-opacity-10 rounded-xl p-3">
              <div>
                <div className="flex items-center">
                  <Users className="mr-2" size={20} />
                  <span>Capacity</span>
                </div>
              </div>
              <input
                type="text"
                className="bg-transparent w-full outline-none ml-4"
              />
            </div>
          </div>
        </div>

        <button className="w-full bg-white text-purple-900 py-3 rounded-xl font-semibold mt-6">
          Create Event
        </button>
      </div>
    </div>
  );
};

export default Create;
