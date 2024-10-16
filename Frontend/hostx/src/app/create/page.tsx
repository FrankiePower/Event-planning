"use client";

import React, { useState, useContext } from "react";
import { useWriteContract, useAccount, useSimulateContract } from "wagmi";
import { parseUnits } from "viem";
import { UrlContext } from "@/context/UrlContext";
import { DatePickerWithRange } from "@/components/fragments/DatePicker";
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
import { CardWithForm } from "@/components/fragments/NFTCard";

const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "paymentTokenAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_NftTokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_NftSymbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_venue",
        type: "string",
      },
      {
        internalType: "string",
        name: "_image",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endDate",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "_totalTicketAvailable",
        type: "uint16",
      },
    ],
    name: "createEvent",
    outputs: [
      {
        internalType: "contract EventContract",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const CONTRACT_ADDRESS = "0xE604Dbf839c5f69116CFB5303E5f0f604F8562ad";

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
  const { url, nftName, nftSymbol, selectedToken } = useContext(UrlContext);
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    paymentTokenAddress: "",
    nftTokenName: "",
    nftSymbol: "",
    eventName: "",
    description: "",
    venue: "",
    image: url,
    startDate: null,
    endDate: null,
    totalTicketAvailable: "",
    requireApproval: false,
    calendar: "Personal Calendar",
    visibility: "Public",
    isVirtual: false,
  });

  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "createEvent",
    args: [
      selectedToken,
      nftName,
      nftSymbol,
      formData.eventName,
      formData.description,
      formData.venue,
      formData.image,
      formData.startDate ? Math.floor(formData.startDate.getTime() / 1000) : 0,
      formData.endDate ? Math.floor(formData.endDate.getTime() / 1000) : 0,
      parseInt(formData.totalTicketAvailable) || 0,
    ],
    account: address,
  });

  const {
    writeContract,
    error: writeError,
    isLoading,
    isSuccess,
  } = useWriteContract();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.venue || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (simulateError) {
      console.error("Simulation error:", simulateError);
      return;
    }

    try {
      await writeContract(simulateData.request);
    } catch (error) {
      console.error("Error creating event:", error);
    }
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex m-auto max-w-[960px] gap-8 p-4">
      <div className="flex">
        <CardWithForm />
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
            name="paymentTokenAddress"
            value={selectedToken}
            onChange={handleInputChange}
            type="text"
            placeholder="Payment Token Address"
            className="bg-white bg-opacity-10 rounded-xl p-3"
          />
          <input
            name="nftTokenName"
            value={nftName}
            onChange={handleInputChange}
            type="text"
            placeholder="NFT Token Name"
            className="bg-white bg-opacity-10 rounded-xl p-3"
          />

          {/* NFT Symbol */}
          <input
            name="nftSymbol"
            value={nftSymbol}
            onChange={handleInputChange}
            type="text"
            placeholder="NFT Symbol"
            className="bg-white bg-opacity-10 rounded-xl p-3"
          />

          <input
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            type="text"
            placeholder="Event Name"
            className="text-4xl bg-transparent border-none outline-none"
          />

          <div className="flex justify-between bg-white bg-opacity-10 rounded-xl p-3">
            <DatePickerWithRange
              onChange={(dates) => {
                setFormData((prev) => ({
                  ...prev,
                  startDate: dates.from,
                  endDate: dates.to,
                }));
              }}
            />
          </div>

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
                value={formData.venue}
                onChange={handleInputChange}
                type="text"
                placeholder="Add Event Venue or Paste Zoom Link"
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
              className="bg-transparent text-white text-lg border-none focus:ring-0"
            />
          </div>
          <div className="flex items-center bg-white bg-opacity-10 rounded-xl p-3">
            <input
              name="image"
              value={url}
              onChange={handleInputChange}
              type="text"
              placeholder="Image URL"
              className="text-base bg-transparent border-none outline-none"
            />
            <input
              name="Image-URL"
              value={nftSymbol}
              onChange={handleInputChange}
              type="text"
              placeholder="Image URL"
              className="text-base bg-transparent border-none outline-none"
            />
          </div>

          <div className="flex items-center bg-white bg-opacity-10 rounded-xl p-3">
            <Ticket className="mr-2" size={20} />
            <input
              name="totalTicketAvailable"
              value={formData.totalTicketAvailable}
              onChange={handleInputChange}
              type="number"
              placeholder="Total Tickets Available"
              className="bg-transparent outline-none w-full"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Event Options</h3>
            <EventOptionItem icon={Ticket} label="Tickets">
              <span>{formData.tickets}</span>
              <input
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                type="number"
                className="bg-transparent w-24 text-right"
                placeholder="Unlimited"
              />
              {/* <TicketDropdown onTicketChange={undefined} /> */}
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
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
          {isSuccess && (
            <div className="text-green-500 mt-2">
              {" "}
              Event created successfully!
            </div>
          )}
          {writeError && (
            <div className="text-red-500 mt-2">Error:{writeError.message}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Page;
