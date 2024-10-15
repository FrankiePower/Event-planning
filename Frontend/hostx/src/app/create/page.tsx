"use client";

import React, { useState } from "react";
import { ImageSelector } from "@/components/fragments/ImageSelector";
//import { useRouter } from "next/router";
import {
  MapPin,
  FileText,
  Ticket,
  Users,
  ChevronDown,
  GlobeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

const EventOptionItem = ({ icon: Icon, label, children }) => (
  <div className="flex items-center justify-between rounded-xl p-3">
    <div className="flex items-center">
      <Icon className="mr-2" size={20} />
      <span>{label}</span>
    </div>
    {children}
  </div>
);

const Page = () => {
  //const router = useRouter();
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    description: "",
    tickets: "Free",
    requireApproval: false,
    capacity: "",
    calendar: "Personal Calendar",
    visibility: "Public",
    isVirtual: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.location || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Form submitted:", formData);
    //router.push(`/events/${encodeURIComponent(formData.eventName)}`);
  };

  return (
    <div className="flex m-auto max-w-[960px] gap-8 p-4">
      <div>
        <ImageSelector />
      </div>
      <form onSubmit={handleSubmit} className="w-auto max-w-2xl">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white bg-opacity-10 text-white rounded-xl">
                  {formData.calendar} <ChevronDown className="ml-2" size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black bg-opacity-80">
                <DropdownMenuItem
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      calendar: "Personal Calendar",
                    }))
                  }
                >
                  Personal Calendar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      calendar: "Work Calendar",
                    }))
                  }
                >
                  Work Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white bg-opacity-10 text-white rounded-xl">
                  <GlobeIcon className="mr-2" size={20} /> {formData.visibility}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black bg-opacity-80">
                <DropdownMenuItem
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, visibility: "Public" }))
                  }
                >
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, visibility: "Private" }))
                  }
                >
                  Private
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <input
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            type="text"
            placeholder="Event Name"
            className="text-4xl bg-transparent border-none outline-none"
          />

          <div className="grid grid-cols-1 gap-2 bg-white bg-opacity-10 rounded-xl p-3">
            <div className="flex items-center justify-between bg-none p-3 w-80">
              <span>Offline Location</span>
              <button
                type="button"
                onClick={() => handleToggleChange("isVirtual")}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                  formData.isVirtual ? "bg-blue-600" : "bg-blue-400"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                    formData.isVirtual ? "translate-x-6" : ""
                  }`}
                />
              </button>
              <span>Virtual Link</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" size={20} />
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                type="text"
                placeholder="Add Event Location"
                className="bg-transparent outline-none w-full"
              />
            </div>
          </div>
          <div className="flex items-center bg-white bg-opacity-10 rounded-xl p-3">
            <FileText className="mr-2" size={20} />
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add Description"
              className="bg-transparent text-white rounded-lg w-full border-none outline-none"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Event Options</h3>
            <EventOptionItem icon={Ticket} label="Tickets">
              <span>{formData.tickets}</span>
            </EventOptionItem>

            <EventOptionItem icon={Users} label="Require Approval">
              <button
                type="button"
                onClick={() => handleToggleChange("requireApproval")}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                  formData.requireApproval ? "bg-blue-600" : "bg-blue-400"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                    formData.requireApproval ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </EventOptionItem>

            <EventOptionItem icon={Users} label="Capacity">
              <input
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                type="number"
                className="bg-transparent w-24 text-right"
                placeholder="Unlimited"
              />
            </EventOptionItem>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-purple-900 hover:bg-gray-200 py-3 rounded-xl font-semibold mt-6"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
