"use client";

import NestedDate from "@/components/registerComps/NestedDate";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import DialogDemo from "@/components/registerComps/DialogDemo";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {abi} from "@/lib/contractABI";
import {eventContractAbi} from "@/lib/eventContractAbi";
import {config} from "@/wagmi"
import { readContract } from '@wagmi/core'
import { decodeFunctionData } from 'viem'
import { Interface } from "ethers";


const Register = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("id");
  const [eventData, setEventData] = useState<any>({
    eventName: "",
    eventStartTime: "",
    eventEndTime: "",
    eventVenue: "",
    eventDescription: "",
    eventImage: ""
  }) 

  const fetchEvent = async(contract:any) => {
    // console.log("passed contract", contract)
    setIsLoading(true)

    const itf = new Interface(eventContractAbi);

    try {
      const ticketTierId = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'ticketTierCount',
      })

      const eventName = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'eventName',
      })

      const eventDescription = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'eventDescription',
      })

      const eventVenue = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'eventVenue',
      })

      const eventImage = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'eventImage',
      })

      const startDate:any = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'startDate',
      })

      const endDate:any = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'endDate',
      })

      const ticketTier:any = await readContract(config, {
        abi: eventContractAbi,
        address: contract[0],
        functionName: 'ticketTierIdToTicket',
        args: [1]
      })
      
      setEventData({
        eventName: eventName,
        eventStartTime:new Date(Number(startDate) * 1000).toLocaleString(),
        eventEndTime: new Date(Number(endDate) * 1000).toLocaleString(),
        eventVenue: eventVenue,
        eventDescription: eventDescription,
        eventImage: eventImage
      })
      // console.log("event name ", eventName)
      // console.log("event desc ", eventDescription)
      // console.log("event venue ", eventVenue)
      // console.log("event image ", eventImage)
      // console.log("event start date  ", new Date(Number(startDate) * 1000).toLocaleString())
      // console.log("event end date  ", new Date(Number(endDate) * 1000).toLocaleString())
      // console.log("ticket tiers ", ticketTier)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("error fetching event ", error)
    }  
  }

  const fetchEvents = useCallback(async() => {
    setIsLoading(true)

    try {
      const allEvents:any = await readContract(config, {
        abi,
        address: '0x54025fe4a47A012526666068F6C451aAa92fe72e',
        functionName: 'getEvents',
      })
  
      fetchEvent([allEvents[0]])
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("error fetching all events ", error)
    }  
  }, [])

  // console.log("url id ", urlParam?.split("?")[0]);
  // console.log("url url ", urlParam?.split("?")[1].split("=")[1])

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div className="h-screen sm:p-8 gap-16 px-4 sm:pt-16 sm:px-6 font-[family-name:var(--font-geist-sans)] text-white">

      <DialogDemo isOpen={isOpen} setIsOpen={setIsOpen} />
     {
      !isLoading ? (
          <div className="w-full f-full flex justify-center items-center">
          <div className="rounded-xl w-7/12">
            <div className="flex flex-row items-center mb-4">
              <div>
                <Image
                  src={"/moon-cake.jpg"}
                  height={500}
                  width={500}
                  alt="moon cake"
                  className="rounded-xl"
                />
              </div>

              <div className="p-2 pl-10 w-full">
                <p className="text-5xl font-bold mb-2">{eventData.eventName}</p>

                <NestedDate 
                  startTime={eventData.eventStartTime}
                  endTime={eventData.eventEndTime}
                />

                <div className="flex flex-row items-center mb-4">
                  <CiLocationOn className="mr-8 font-bold text-base" />

                  <p className="font-bold text-base">Register to See Address</p>
                </div>

                <p className="text-[#f7f5f2] mb-2">Registration</p>

                <p className="font-semibold mb-4">
                  Welcome! To join the event, please register below.
                </p>

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer w-full outline-none border-none rounded-xl p-2 bg-black text-base font-semibold text-center"
                >
                  Register
                </button>
              </div>
            </div>

            <div className="p-2">
              <p className="font-regular text-[#f7f5f2] mb-2">Event Venue</p>

              <p className="font-bold text-lg mb-8">{eventData.eventVenue}</p>

              <p className="font-regular text-[#f7f5f2] mb-2">Event Description</p>

              <p className="font-bold text-lg/">{eventData.eventDescription}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-screen fixed bg-gray-400 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <span className="relative flex h-8 w-8">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-white"></span>
        </span>
      </div>
      )
     }
    </div>
  );
};

export default Register;
