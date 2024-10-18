"use client";

import React, { useState, useContext, useEffect } from "react";
import { CONTRACT_ADDRESS, FactoryABI } from "@/lib/createEvent";
import { useWriteContract, useAccount, useSimulateContract } from "wagmi";
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
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

interface EventOptionProps {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
}

const EventOption: React.FC<EventOptionProps> = ({
  icon: IconElement,
  label,
  children,
}) => (
  <div className="flex items-center justify-between rounded-xl p-3">
    <div className="flex items-center">
      <IconElement className="mr-2" size={20} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {children}
  </div>
);

const Page = () => {
  //const router = useRouter();

  const { url, nftName, nftSymbol, selectedToken } = useContext(UrlContext);

  const { address } = useAccount();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 8, 14),
    to: addDays(new Date(2024, 8, 25), 2),
  });

  console.log(date?.from, date?.to);

  const [formData, setFormData] = useState({
    paymentTokenAddress: selectedToken,
    nftTokenName: nftName,
    nftSymbol: nftSymbol,
    eventName: "",
    description: "",
    venue: "",
    image: url,
    startDate: date!.from?.getTime(),
    endDate: date!.to?.getTime(),
    totalTicketAvailable: "",
    requireApproval: false,
    calendar: "Personal Calendar",
    visibility: "Public",
    isVirtual: false,
  });

  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: FactoryABI,
    functionName: "createEvent",
    args: [
      selectedToken,
      nftName,
      nftSymbol,
      formData.eventName,
      formData.description,
      formData.venue,
      url,
      date!.from?.getTime(),
      date!.to?.getTime(),
      parseInt(formData.totalTicketAvailable) || 0,
    ],
    account: address,
  });

  const {
    writeContract,
    error: writeError,
    isPending,
    isSuccess,
  } = useWriteContract();

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEventHandler<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: keyof typeof formData) => {
    setFormData((prevState) => ({ ...prevState, [name]: !prevState[name] }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    if (!formData.eventName || !formData.venue || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (simulateError) {
      console.error("Simulation error:", simulateError);
      return;
    }

    try {
      writeContract(simulateData!.request);
    } catch (error) {
      console.error("Error creating event:", error);
    }
    console.log("Form submitted:", formData);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      paymentTokenAddress: selectedToken,
      nftTokenName: nftName,
      nftSymbol: nftSymbol,
      image: url,
    }));
  }, [selectedToken, nftName, nftSymbol, url]);

  return (
    <div className="flex m-auto max-w-[960px] gap-8 p-4">
      <div className="flex">
        <CardWithForm />
      </div>
      <form className="w-auto max-w-2xl">
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

          <div className="flex justify-between bg-white bg-opacity-10 rounded-xl p-3">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>

          <div className="grid grid-cols-1 gap-2 bg-white bg-opacity-10 rounded-xl p-3">
            <div className="flex items-center justify-between bg-none p-3 w-80">
              <span>Offline Location</span>
              <button
                type="button"
                onClick={() => handleToggle("isVirtual")}
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
                name="venue"
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
              value={url!}
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
            <EventOption icon={Users} label="Require Approval">
              <button
                type="button"
                onClick={() => handleToggle("requireApproval")}
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
            </EventOption>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-white text-purple-900 hover:bg-gray-200 py-3 rounded-xl font-semibold mt-6"
          >
            {isPending ? "Creating Event..." : "Create Event"}
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
