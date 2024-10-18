import { ethers } from "hardhat";

async function addTicketTier() {
    const [signer, account1] = await ethers.getSigners();

    const contractAddress = "0x4A4d54c5477da5D9EA4e2A92e8bEe217363b4801"; // Your deployed contract address
    const eventContract = await ethers.getContractAt("EventContract", contractAddress);

    // const ticketName  = "Vvip";
    // const ticketPrice = ethers.parseEther("0.00015");
    // const totalAvail = 5;
    // const ticketUri = "QmefYCLShjGNRP1f9qTRhBPUTrL3xXmVhpg49nRofyyad3"

    // const ticketName  = "Vip";
    // const ticketPrice = ethers.parseEther("0.00010");
    // const totalAvail = 5;
    // const ticketUri = "QmTRbD9HNgydKGUDYGSfMEQXpty8ruETmxd3ktd6cX9tGc"

    // const ticketName  = "Regular";
    // const ticketPrice = ethers.parseEther("0.00006");
    // const totalAvail = 10;
    // const ticketUri = "QmbMRYxMedzGqfzhpv1PXM5iZbwj5i9n3TnRjdpftQVMm3"

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

    // const tokenAddress = await eventContract.connect(signer).token();
    // console.log(tokenAddress);
    // console.log("=========================================================================")
    // const tx2 = await eventContract.connect(signer).buyTicket(1);
    // console.log(tx2.hash);
    // const receipt2 = await tx2.wait();
    // console.log(receipt2);
    
}

addTicketTier().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
