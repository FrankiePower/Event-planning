import { ethers } from "hardhat";

async function interaction() {
    const [signer] = await ethers.getSigners();

    const contractAddress = "0x38063b78DD44a5533a6A4496c2DF46bC1106056b"; // Your deployed contract address
    const eventContract = await ethers.getContractAt("EventManagerFactory", contractAddress);

    // Event creation parameters
    const paymentTokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT
    const NftTokenName = "Traders Fair 2025 Token";
    const NftSymbol = "TF2025";
    const name = "Traders Fair 2025 - Nigeria, 8 FEB, LAGOS (Financial Event)";
    const description = "Stocks, Forex, Futures, Cryptocurrency and Options, Investing and Brokers - all in one trading educational event!";
    const venue = "Lagos Continental Hotel 52a Kofo Abayomi Street Lagos, LA 101241";
    const image = "QmZF4CAM1YFQDrCmdgR37t2aGjrTXYHek7H5YWJ6DWA6hC";
    const startDate = 1732957200;
    const endDate = 1756116000;
    const totalTicketAvailable = 20;

    // Send the transaction to create an event
    const tx = await eventContract.createEvent(
        paymentTokenAddress,
        NftTokenName,
        NftSymbol,
        name,
        description,
        venue,
        image,
        startDate,
        endDate,
        totalTicketAvailable
    );

    console.log("Transaction Hash:", tx.hash);

    const receipt = await tx.wait(); // Wait for transaction to be mined
    console.log("Transaction Receipt:", receipt);

    // Check the length of the events array after the event is created
    const eventsLength = await eventContract.events.length;
    console.log("Total events after creation:", eventsLength.toString());

    // Retrieve the created event from the events array
    for (let i = 0; i < eventsLength; i++) {
        const eventAddress = await eventContract.events(i);
        console.log(`Event ${i}:`, eventAddress);
    }

    // Check the events for the organizer (signer)
    // const organizerEvents = await eventContract.eventOrganizers(signer.address);
    // console.log(`Events created by organizer ${signer.address}:`, organizerEvents);

    // // Loop through the organizer's events
    // for (let i = 0; i < organizerEvents.length; i++) {
    //     console.log(`Organizer Event ${i}:`, organizerEvents[i]);
    // }
}

interaction().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
