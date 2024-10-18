import { readContract } from "@wagmi/core";
import { useState, useCallback } from "react";
import { config } from "../wagmi";

const useFetchEvents = () => {
  const eventManagerFactoryABI = [
    {
      inputs: [],
      name: "getEvents",
      outputs: [
        {
          internalType: "contract EventContract[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const eventContractABI = [
    {
      inputs: [],
      name: "eventName",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "eventDescription",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "eventImage",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "organizer",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "eventVenue",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "startDate",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "endDate",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalTicketAvailable",
      outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalTicketSold",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalRevenue",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    // Add other properties you want to retrieve from the EventContract
  ] as const;

  const [events, setEvents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to get all events and their details
  const fetchEvents = useCallback(async () => {
    try {
      const eventAddresses = (await readContract(config, {
        address: "0x92c721f2Db5fA4Cb0a77338bB6076aadF00237a8",
        abi: eventManagerFactoryABI,
        functionName: "getEvents",
      })) as `0x${string}`[];

      const eventDetails = await Promise.all(
        eventAddresses.map(async (address) => {
          const name = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "eventName",
          })) as string;

          const description = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "eventDescription",
          })) as string;

          const image = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "eventImage",
          })) as string;

          const eventVenue = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "eventVenue",
          })) as string;

          const startDate = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "startDate",
          })) as bigint;

          const endDate = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "endDate",
          })) as bigint;

          const totalTicketAvailable = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "totalTicketAvailable",
          })) as number;

          const totalTicketSold = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "totalTicketSold",
          })) as bigint;

          const totalRevenue = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "totalRevenue",
          })) as bigint;

          const organizer = (await readContract(config, {
            address,
            abi: eventContractABI,
            functionName: "organizer",
          })) as `0x${string}`; // Fetch as address

          // Convert address to a readable string if necessary
          const organizerAddress = organizer.toString();

          setLoading(false);

          return {
            address,
            name,
            description,
            image,
            organizerAddress,
            eventVenue,
            startDate,
            endDate,
            totalTicketAvailable,
            totalTicketSold,
            totalRevenue,
          };
        })
      );

      setEvents(eventDetails);
      console.log("Fetched events:", eventDetails);
      console.log(events);
    } catch (error) {
      console.log("Error fetching events: ", error);
    }
  }, []);

  return { events, loading, fetchEvents };
};

export default useFetchEvents;
