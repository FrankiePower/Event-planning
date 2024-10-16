const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventContract", function () {
    let EventContract: any, eventContract: any, organizer: any, user1: any, user2: any, user3: any, vendor: any, vendor2: any, token: any;


    before(async function () {
        [organizer, user1, user2, user3, vendor, vendor2] = await ethers.getSigners();

        // Deploying ERC20 token for ticket payments
        const Token = await ethers.getContractFactory("SmartDevToken"); // Use a mock ERC20 for testing
        token = await Token.deploy();

        // Deploying EventContract
        const EventContractFactory = await ethers.getContractFactory("EventContract");
        eventContract = await EventContractFactory.deploy(
            organizer.address,
            token.target,
            "EventNFT",
            "ENFT",
            "Sample Event",
            "A sample event description.",
            "Sample Venue",
            "sample_image_url",
            Math.floor(Date.now() / 1000) + 3600, // Start time (1 hour in future)
            Math.floor(Date.now() / 1000) + 7200, // End time (2 hours in future)
            100 // Total tickets available
        );
    });

describe("Deployment", function () {
    it("Should deploy the EventContract with correct parameters", async function () {
        const deployedOrganizer = await eventContract.organizer();
        const deployedTokenAddress = await eventContract.token();
        const deployedEventName = await eventContract.eventName();

        expect(deployedOrganizer).to.equal(organizer.address);
        expect(deployedTokenAddress).to.equal(token.target);
        expect(deployedEventName).to.equal("Sample Event");
    });
});

 describe("Add Ticket Tier", function () {
        it("Should allow organizer to add a ticket tier", async function () {
            const price = ethers.parseUnits("10", 18);
            await eventContract.addTicketTier("VIP", price, 50, "vip_ticket_uri");
            const ticketTier = await eventContract.ticketTierIdToTicket(1);
            console.log("Ticket Tier:", ticketTier);
            expect(ticketTier.tierName).to.equal("VIP");
            expect(ticketTier.price.toString()).to.equal(price.toString());
            expect(ticketTier.totalTicketAvailable).to.equal(50);

            // Check that total tickets do not exceed the limit
            const totalTickets = await eventContract.totalTicketAvailable();
            expect(totalTickets).to.be.at.most(100); // Assuming 100 is the max limit
            console.log("Total Tickets:", totalTickets);
            const totalTicketAvailable = await eventContract.totalTicketAvailable();
            console.log("Total Ticket Available:", totalTicketAvailable);
            expect(totalTicketAvailable).to.equal(50);
        });

        it("Should not allow non-organizer to add a ticket tier", async function () {
            await expect(eventContract.connect(user3).addTicketTier("Regular", ethers.parseUnits("5", 18), 50, "regular_ticket_uri"))
                .to.be.revertedWith("Only organizer");
        });

        it("Should not allow adding a ticket tier that exceeds total ticket limit", async function () {
            await eventContract.addTicketTier("Standard", 10, 90, "standard_ticket_uri");
            await expect(eventContract.addTicketTier("Extra", 10, 20, "extra_ticket_uri"))
                .to.be.revertedWith("Exceeds total ticket limit");
        });
    });

 describe("Buy Ticket", function () {
        before(async function () {
            await token.transfer(user1.address, ethers.parseUnits("50", 18));
            console.log("Token transferred to user1");
            await token.connect(user1).approve(eventContract.target, ethers.parseUnits("10", 18));
            console.log("Token approved for event contract");
            await eventContract.addTicketTier("VIP", ethers.parseUnits("10", 18), 50, "vip_ticket_uri");
            console.log("Ticket tier added");
        });

        it("Should allow user to buy a ticket", async function () {
            await eventContract.connect(user1).buyTicket(1);
            const ticket = await eventContract.tickets(1);
            console.log("Ticket bought");
            expect(ticket.buyer).to.equal(user1.address);
        });

        it("Should not allow user to buy a ticket with insufficient funds", async function () {
            await expect(eventContract.connect(user2).buyTicket(1)).to.be.revertedWith("Insufficient token balance");
        });
    });

    describe("Validate Ticket", function () {
        it("Should allow user to validate their ticket", async function () {
            await eventContract.connect(user1).validateTicket(1);
            // Here, you may check events or states to confirm validation
        });

        it("Should not allow ticket validation for unowned tickets", async function () {
            await expect(eventContract.connect(user2).validateTicket(1)).to.be.revertedWith("Address does not have NFT.");
        });
    });

    describe("Refund Ticket", function () {
        it("Should not allow refund if event is not terminated", async function () {
            await expect(eventContract.connect(user1).claimRefund(1)).to.be.revertedWith("Event is still on-going.");
        });

        it("Should allow user to claim a refund", async function () {
            await eventContract.connect(organizer).terminateEvent();
            console.log("Event terminated");
            await eventContract.connect(user1).claimRefund(1);
            console.log("Refund claimed");
            const ticket = await eventContract.tickets(1);
            console.log("Tickets:", ticket);
            console.log("Ticket is refunded:", ticket.isRefund);
            expect(ticket.isRefund).to.be.true;
        });
    });

    describe("Vendor Management", function () {
        it("Should allow organizer to add a vendor", async function () {
            await eventContract.connect(organizer).addVendor(vendor.address, "Vendor Name", "vendor_image_url", "Catering", ethers.parseUnits("20", 18));
            const addedVendor = await eventContract.vendors(vendor.address);
            expect(addedVendor.name).to.equal("Vendor Name");
        });

        it("Should not allow non-organizer to add a vendor", async function () {
            await expect(eventContract.connect(user1).addVendor(vendor.address, "Vendor Name", "vendor_image_url", "Catering", ethers.parseUnits("20", 18)))
                .to.be.revertedWith("Only organizer");
        });
    });

    describe("Event Status Transitions", function () {
        it("Should transition from Upcoming to Ongoing", async function () {
            // Fast forward time to event start
            await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
            await ethers.provider.send("evm_mine", []);
            
            // Assuming there's a function to update status based on time
            await eventContract.updateEventStatus();
            const status = await eventContract.status();
            expect(status).to.equal(1); // Ongoing
        });

        it("Should transition from Ongoing to Completed", async function () {
            // Fast forward time to event end
            await ethers.provider.send("evm_increaseTime", [7200]); // 2 hours
            await ethers.provider.send("evm_mine", []);
            
            await eventContract.updateEventStatus();
            const status = await eventContract.status();
            expect(status).to.equal(2); // Completed
        });
    });

    describe("Vendor Management", function () {
        it("Should allow organizer to confirm vendor service delivery", async function () {
            await token.transfer(eventContract.target, ethers.parseUnits("30", 18));
            console.log("Token transferred to vendor");
            await token.approve(eventContract.target, ethers.parseUnits("20", 18));
            console.log("Token approved for event contract");
            await eventContract.connect(organizer).comfirmVendorServiceDelivery(vendor.address);
            const vendorData = await eventContract.vendors(vendor.address);
            expect(vendorData.serviceDelivered).to.be.true;
            expect(vendorData.isPaid).to.be.true;
        });

        it("Should allow organizer to terminate vendor agreement", async function () {
            await eventContract.connect(organizer).addVendor(vendor2.address, "Vendor Name 2", "vendor_image_url", "Catering", ethers.parseUnits("20", 18));
            await eventContract.connect(organizer).terminateVendorAgreement(vendor2.address);
            const vendorData = await eventContract.vendors(vendor2.address);
            expect(vendorData.status).to.equal(1); 
        });
    });


    describe("Refund Logic", function () {
        it("Should not process refund if event is not terminated", async function () {
            await expect(eventContract.connect(user1).claimRefund(1)).to.be.revertedWith("Event is still on-going.");
        });

        it("Should process refund correctly when event is terminated", async function () {
            await eventContract.connect(organizer).terminateEvent();
            await expect(eventContract.connect(user1).claimRefund(1)).to.revertedWith("Token refunded");
        });
    });

});
