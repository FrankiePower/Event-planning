import { useState, useEffect } from "react";

// Define the type for event details
type EventDetails = {
  eventName: string;
  eventDescription: string;
  eventVenue: string;
  startDate: bigint;
  totalTicketSold: bigint;
} | null;

// Modify useFetchEventDetails hook (you should update this in your hooks file)
const useFetchEventDetails = (contractAddress: string | null) => {
  const [eventDetails, setEventDetails] = useState<EventDetails>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (contractAddress) {
      const fetchEventDetails = async () => {
        try {
          // Your existing fetch logic here
          // Update setEventDetails with the fetched data
          setEventDetails({
            eventName: "Fetched Event Name",
            eventDescription: "Fetched Event Description",
            eventVenue: "Fetched Venue",
            startDate: BigInt(Date.now()),
            totalTicketSold: BigInt(100),
          });
        } catch (err) {
          console.error("Error fetching event details:", err);
          setError(
            err instanceof Error ? err : new Error("An unknown error occurred")
          );
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    } else {
      setLoading(false);
      setError(new Error("No contract address provided"));
    }
  }, [contractAddress]);

  return { loading, eventDetails, error };
};

export default useFetchEventDetails;
