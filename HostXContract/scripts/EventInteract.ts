import { ethers } from "hardhat";

async function addTicketTier() {
    const [signer, account1] = await ethers.getSigners();

    const contractAddress = "0x4DcADAf51107d44Bd3b173ECE292833021bFE53F"; // Your deployed contract address
    const eventContract = await ethers.getContractAt("EventContract", contractAddress);

    const ticketName  = "Vvip";
    const ticketPrice = ethers.parseEther("0.00015");
    const totalAvail = 5;
    const ticketUri = "QmWqg6CJd18qazfMSz9XvGyYyVcrbrxrphT8AVwHbEbAPb"

    // const ticketName  = "Vip";
    // const ticketPrice = ethers.parseEther("0.00010");
    // const totalAvail = 5;
    // const ticketUri = "QmcymocDH1tQs3Dt7PmBsGNBhn6UBikCi75Wfux8K8jmjF"

    // const ticketName  = "Regular";
    // const ticketPrice = ethers.parseEther("0.00006");
    // const totalAvail = 10;
    // const ticketUri = "QmeuGt59sSt6bJQQaAHxoxGjZYfikr1HMjobtS5FCb6ezC"

    // const signerAddress = await signer.getAddress();
    
    const txs = await eventContract.connect(signer).totalTicketTierAdded();
    // const receipts = txs.wait();
    console.log(txs);
    

    // Create ticket tier.
    // const tx = await eventContract.connect(signer).addTicketTier(ticketName, ticketPrice, totalAvail, ticketUri);
    // console.log(tx.hash);
    // const receipt = await tx.wait();
    // console.log(receipt);

    //Buy Ticket
    // console.log(signerAddress);

    const tokenAddress = await eventContract.connect(signer).token();
    console.log(tokenAddress);
    console.log("=========================================================================")
    const tx2 = await eventContract.connect(signer).buyTicket(1, 1, { value: ethers.parseEther("0.00015") });
    console.log(tx2.hash);
    const receipt2 = await tx2.wait();
    console.log(receipt2);
}

addTicketTier().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
