import { ethers } from "hardhat";

async function addTicketTier() {
    const [signer, account1] = await ethers.getSigners();

    // const contractAddress = "0x492B26eA652135c6472279798Ec83B7339509a7C"; // Your deployed contract address
    const contractAddress = "0x4513B046E4C036E90a064120c5fA62C07Cd66aF7"; // Your deployed contract address
    const eventContract = await ethers.getContractAt("EventContract", contractAddress);

    const ticketName  = "Vvip";
    const ticketPrice = ethers.parseEther("0.0015");
    const totalAvail = 5;
    const ticketUri = "QmefYCLShjGNRP1f9qTRhBPUTrL3xXmVhpg49nRofyyad3"


    // const ticketName  = "Vip";
    // const ticketPrice = ethers.parseEther("0.0009");
    // const totalAvail = 5;
    // const ticketUri = "QmTRbD9HNgydKGUDYGSfMEQXpty8ruETmxd3ktd6cX9tGc"

    // const ticketName  = "Regular";
    // const ticketPrice = ethers.parseEther("0.0003");
    // const totalAvail = 5;
    // const ticketUri = "QmbMRYxMedzGqfzhpv1PXM5iZbwj5i9n3TnRjdpftQVMm3"

    const signerAddress = await signer.getAddress();
    
    // const txs = await eventContract.connect(signer).totalTicketAvailable();
    // // const receipts = txs.wait();
    // console.log(txs);
    

    //Create ticket tier.
    // const tx = await eventContract.connect(signer).addTicketTier(ticketName, ticketPrice, totalAvail, ticketUri);
    // console.log(tx.hash);
    // const receipt = await tx.wait();
    // console.log(receipt);

    //Buy Ticket
    // console.log(signerAddress);
    const tx2 = await eventContract.ticketTierIdToTicket(1);
    // console.log(tx2.hash);
    // const receipt2 = await tx2.wait();
    console.log(tx2);
    
}

addTicketTier().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
