import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config();

const private_key = process.env.PRIVATE_KEY || "";
if (!process.env.PRIVATE_KEY) {
  throw new Error('Environment variable PRIVATE_KEY is required but not set.');
}

if (!process.env.SEPOLIA_RPC_URL) {
  throw new Error('Environment variable SEPOLIA_RPC_URL is required but not set.');
}

if (!process.env.ETHERSCAN_API_KEY) {
  throw new Error('Environment variable ETHERSCAN_API_KEY is required but not set.');
}


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Try adjusting the number of runs
      },
      // viaIR: true, // Enable IR-based compilation
    },
  },
  etherscan: {
    apiKey: {
      "lisk-sepolia": "123",
      "sepolia" : process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com/",
        },
      },
    ], 
  },
  networks: {
    "sepolia": {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    "lisk-sepolia": {
      url: process.env.LISK_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1000000000,
    },
  },
  
};

export default config;
