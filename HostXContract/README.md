# Event Manager Factory

This project provides an Ethereum-based smart contract system for creating and managing events with NFT-gated ticketing. The **EventManagerFactory** contract allows organizers to create their own events, each represented by an instance of the **EventContract**. Attendees can purchase tickets that are minted as NFTs, and the system leverages blockchain technology to handle ticketing, payment, and event management in a trustless way.

## Overview

This project allows event organizers to create and manage events on the Ethereum blockchain. Each event is represented by an NFT-based contract, and tickets are minted as NFTs, ensuring transparency and eliminating the need for intermediaries. Users can interact with the system to view event details, buy tickets, and check the availability of tickets.

## Features

- **Create Event**: Organizers can create events by specifying details such as name, description, venue, image, and ticket availability.
- **NFT Ticketing**: Each ticket is an NFT that attendees can mint, representing ownership and access to the event.
- **Multiple Payment Options**: Event payments can be made using ERC-20 tokens.
- **Event Management**: Event organizers can view all their created events, and users can retrieve details of all available events.

## Project Structure

```
/contracts
  ├── EventContract.sol         # Manages individual event details and ticketing
  └── EventManagerFactory.sol   # Factory contract to create and manage events
/hardhat.config.ts              # Hardhat configuration for deployment and testing
/scripts
  └── deploy.ts                 # Deployment script for deploying the factory contract
/test
  └── Event.test.ts  # Unit tests for EventManagerFactory contract
```

## Smart Contracts

### EventManagerFactory.sol

The `EventManagerFactory` contract allows event organizers to create new events, each with its own unique contract. The factory stores a mapping of all created events by ID and allows for querying event details.

### EventContract.sol

The `EventContract` is instantiated by the factory for each event. It manages event details such as ticket availability, payment, and minting tickets as NFTs. Users can purchase tickets by interacting with this contract.


## Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)
- [Ethereum Wallet (Metamask)](https://metamask.io/)


## Installing Dependencies

First, clone the project and install the necessary dependencies:

```bash
git clone https://github.com/FrankiePower/Event-planning.git

cd Event-planning/HostXContract

npm install
```

### Environment Variables

Create a `.env` file in the root of your project and include the following variables:

```
PRIVATE_KEY=<your-private-key>
SEPOLIA_RPC_URL=<your-sepolia-rpc-url>
LISK_RPC_URL=<your-lisk-sepolia-rpc-url>
ETHERSCAN_API_KEY=<your-etherscan-api-key>
```

## Compilation

To compile the smart contracts, run:

```bash
npx hardhat compile
```

## Running Tests

Unit tests for the smart contracts are located in the `/test` directory. You can run them using:

```bash
npx hardhat test
```

## Deployment

You can deploy the `EventManagerFactory` contract to Sepolia or Lisk-Sepolia networks.

### Deploy to Lisk-Sepolia

```bash
npx hardhat ignition deploy ./ignition/modules/EventManagerFactory.ts --network lisk-sepolia
```

## Verification

After deploying, you can verify the contract using the following command:

### Verify on Lisk-Sepolia

```bash
npx hardhat verify --network lisk-sepolia <deployed_contract_address>
```
