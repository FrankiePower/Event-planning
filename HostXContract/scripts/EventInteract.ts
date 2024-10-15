import { ethers } from "hardhat";

async function interaction() {
    const [signer] = await ethers.getSigners();

    const contractAddress = "0x6b62501Fb412081f65D6752c80860F8A86378E7C"; // Your deployed contract address
    const eventContract = await ethers.getContractAt("EventContract", contractAddress);

    // Event creation parameters
    

}

interaction().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
