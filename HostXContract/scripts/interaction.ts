import { ethers } from "hardhat";

async function interaction() {

    const [signer] = await ethers.getSigners();

    const contractAddress = "0x5a7dCbd040Ba618f62B028a7C9ef599AA64713D7"; // Your deployed contract address
    const eventContract = await ethers.getContractAt("EventManagerFactory", contractAddress);

    // Event creation parameters

    
    const events = [
        // {
        //     paymentTokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT,
        //     NftTokenName :"Traders Fair 2",
        //     NftSymbol: "TF2025",
        //     name :"Traders Fair 2025 - Nigeria, 8 FEB, LAGOS (Financial Event)",
        //     description: "Stocks, Forex, Futures, Cryptocurrency and Options, Investing and Brokers - all in one trading educational event!",
        //     venue :"Lagos Continental Hotel 52a Kofo Abayomi Street Lagos, LA 101241",
        //     image: "Qmcn7W15StwAjt5njGNM5s9ybHK81nsFUyvbDQcRtXbBiP",
        //     startDate :1732957200,
        //     endDate: 1756116000,
        //     totalTicketAvailable: 20,
        // },
        // {
        //     paymentTokenAddress:"0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
        //     NftTokenName:"Africa Startup Festival Token",
        //     NftSymbol:"AFST24",
        //     name:"Africa Startup Festival 2024",
        //     description:"Africa's foremost deal-making and networking event.",
        //     venue:"Balmoral Convention Center, Victoria Island 6-8 Ahmadu Bello Way Lagos, LA 101241",
        //     image:"QmZF4CAM1YFQDrCmdgR37t2aGjrTXYHek7H5YWJ6DWA6hC",
        //     startDate:1729460882,
        //     endDate:1729720082,
        //     totalTicketAvailable: 20
        // }, 
        // {
        //     paymentTokenAddress:"0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
        //     NftTokenName:"Anambra Techies Token",
        //     NftSymbol:"ATT",
        //     name:"Road to Web3 in Anambra",
        //     description:"More about Web3, AI, Blockchain, Crypto, NFTs, and more.",
        //     venue:"Awka Anambra State, Nigeria",
        //     image:"QmYrrZ9wEsPZUKcSAM3EDXQnz6iA47DdTM9sTumW9CNgQZ",
        //     startDate:1729720082,
        //     endDate:1729892882,
        //     totalTicketAvailable: 20
        // },
        // {
        //     paymentTokenAddress:"0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
        //     NftTokenName:"Reactive Token",
        //     NftSymbol:"RAH",
        //     name:"Reactive Hackathon",
        //     description:"Starting on September 9th and running for 8 weeks, developers will have the chance to compete for a Hackathon prize pool of $50,000.",
        //     venue:"Online",
        //     image:"QmSc96ndQJwmvGUQr3m7zYSNGan5KG2UPn5Y9m7wnPH3yL",
        //     startDate:1730584082,
        //     endDate:1732225682,
        //     totalTicketAvailable: 20
        // },
        {
            paymentTokenAddress:"0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
            NftTokenName:"Certified Ethical Hacker Token",
            NftSymbol:"CEHv12",
            name:"Certified Ethical Hacker CEHv12 Training and certification OCTOBER(₦950K)",
            description:"Starting on September 9th and running for 8 weeks, developers will have the chance to compete for a Hackathon prize pool of $50,000.",
            venue:"1st Avenue Abuja, Federal Capital Territory 900108",
            image:"QmTMUGSKmyU2L8BdhGvwesegH5fCvK57rdQMb98U2QFtPB",
            startDate:1730670482,
            endDate:1731016082,
            totalTicketAvailable: 20
        },
    ];
    
    events.map(async (event) => {
        const tx = await eventContract.createEvent(
            event.paymentTokenAddress,
            event.NftTokenName,
            event.NftSymbol,
            event.name,
            event.description,
            event.venue,
            event.image,
            event.startDate,
            event.endDate,
            event.totalTicketAvailable
        )
        console.log("Transaction Hash:", tx.hash);
        const receipt = await tx.wait(); 
    });
    // Send the transaction to create an event
    // const tx = await eventContract.createEvent();

    

    // Wait for transaction to be mined
    // console.log("Transaction Receipt:", receipt);

    // Check the length of the events array after the event is created
    // const eventsLength = await eventContract.events.length;
    // console.log("Total events after creation:", eventsLength.toString());

    // Retrieve the created event from the events array
    // for (let i = 0; i < eventsLength; i++) {
    //     const eventAddress = await eventContract.events(i);
    //     console.log(`Event ${i}:`, eventAddress);
    // }

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
