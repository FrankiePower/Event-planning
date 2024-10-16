import { ethers } from "hardhat";

async function addTicketTier() {
    const [signer] = await ethers.getSigners();

    const contractAddress = "0xE6Ab26edc1cC6D9e2173C39F6fe7ea5B5aC1E52c"; // Your deployed contract address
    const eventContract = await ethers.getContractAt("EventContract", contractAddress);

    const ticketName  = "Vvip";
    const ticketPrice = ethers.parseEther("0.0004");
    const totalAvail = 5;
    const ticketUri = "QmTRbD9HNgydKGUDYGSfMEQXpty8ruETmxd3ktd6cX9tGc"

    const signerAddress = await signer.getAddress();
    
    const txs = await eventContract.connect(signer).totalTicketAvailable;
    const receipts = txs.wait();
    console.log(receipts);
    

    //Create ticket tier.
    const tx = await eventContract.connect(signer).addTicketTier(ticketName, ticketPrice, totalAvail, ticketUri);
    console.log(tx.hash);
    const receipt = tx.wait();
    console.log(receipt);


    
    

}

addTicketTier().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
