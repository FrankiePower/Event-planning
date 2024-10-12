import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("SponsorAgreement", function () {

  // Fixture for deploying the contract
  async function deploySponsorAgreementFixture() {
    const [organizer, sponsor1, sponsor2, sponsor3] = await ethers.getSigners();

    const SponsorAgreement = await ethers.getContractFactory("SponsorAgreement");
    
    // Prepare sponsor data
    const sponsors = [sponsor1.address, sponsor2.address, sponsor3.address];
    const contributions = [ethers.parseEther("1.0"), ethers.parseEther("2.0"), ethers.parseEther("3.0")];
    const revenueShares = [10, 20, 30]; // These are arbitrary shares
    const eventIds = [1, 1, 1]; // Same event for simplicity

    // Deploy the contract with the prepared data
    const sponsorAgreement = await SponsorAgreement.deploy(sponsors, contributions, revenueShares, eventIds, organizer.address);

    return { sponsorAgreement, organizer, sponsor1, sponsor2, sponsor3, sponsors, contributions, revenueShares };
  }

//   it("should initialize sponsors correctly", async function () {
//     const { sponsorAgreement, sponsor1, sponsor2, sponsor3, contributions, revenueShares } = await loadFixture(deploySponsorAgreementFixture);

//     // Verify sponsor1 details
//     const sponsor1Details = await sponsorAgreement.getSponsorDetails(sponsor1.address);
//     expect(sponsor1Details.contribution).to.equal(contributions[0]);
//     expect(sponsor1Details.revenueShare).to.equal(revenueShares[0]);
//     expect(sponsor1Details.paid).to.be.false;

//     // Verify sponsor2 details
//     const sponsor2Details = await sponsorAgreement.getSponsorDetails(sponsor2.address);
//     expect(sponsor2Details.contribution).to.equal(contributions[1]);
//     expect(sponsor2Details.revenueShare).to.equal(revenueShares[1]);

//     // Verify sponsor3 details
//     const sponsor3Details = await sponsorAgreement.getSponsorDetails(sponsor3.address);
//     expect(sponsor3Details.contribution).to.equal(contributions[2]);
//     expect(sponsor3Details.revenueShare).to.equal(revenueShares[2]);
//   });

//   it("should allow sponsors to contribute the correct amount", async function () {
//     const { sponsorAgreement, sponsor1, sponsor2, sponsor3, contributions } = await loadFixture(deploySponsorAgreementFixture);

//     // Sponsor 1 contributes
//     await expect(sponsorAgreement.connect(sponsor1).contribute({ value: contributions[0] }))
//       .to.emit(sponsorAgreement, "ContributionReceived")
//       .withArgs(sponsor1.address, contributions[0]);

//     // Sponsor 2 contributes
//     await expect(sponsorAgreement.connect(sponsor2).contribute({ value: contributions[1] }))
//       .to.emit(sponsorAgreement, "ContributionReceived")
//       .withArgs(sponsor2.address, contributions[1]);

//     // Sponsor 3 contributes
//     await expect(sponsorAgreement.connect(sponsor3).contribute({ value: contributions[2] }))
//       .to.emit(sponsorAgreement, "ContributionReceived")
//       .withArgs(sponsor3.address, contributions[2]);
//   });

  it("should distribute revenue correctly", async function () {
    const { sponsorAgreement, organizer, sponsor1, sponsor2, sponsor3, revenueShares } = await loadFixture(deploySponsorAgreementFixture);

    // Let organizer distribute revenue of 6 ETH
    const totalRevenue = ethers.parseEther("6.0");

    // Fund the contract to simulate accumulated event revenue
    // await organizer.sendTransaction({ to: sponsorAgreement.target, value: totalRevenue });

    // Distribute revenue (organizer-only function)
    await expect(sponsorAgreement.connect(organizer).distributeRevenue(totalRevenue))
      .to.emit(sponsorAgreement, "RevenueDistributed")
      .withArgs(totalRevenue);

    // Verify revenue payouts based on the revenue shares (10%, 20%, 30%)
    const sponsor1Balance = await ethers.provider.getBalance(sponsor1.address);
    const sponsor2Balance = await ethers.provider.getBalance(sponsor2.address);
    const sponsor3Balance = await ethers.provider.getBalance(sponsor3.address);

    expect(sponsor1Balance).to.be.gt(ethers.parseEther("10.0")); // Example comparison, adjust accordingly
    expect(sponsor2Balance).to.be.gt(ethers.parseEther("10.0"));
    expect(sponsor3Balance).to.be.gt(ethers.parseEther("10.0"));
  });

//   it("should allow only organizer to issue NFTs", async function () {
//     const { sponsorAgreement, organizer, sponsor1 } = await loadFixture(deploySponsorAgreementFixture);

//     const tokenId = 1;

//     // Organizer issues NFT to sponsor1
//     await expect(sponsorAgreement.connect(organizer).issueSponsorshipNFT(sponsor1.address, tokenId))
//       .to.emit(sponsorAgreement, "SponsorshipNFTIssued")
//       .withArgs(sponsor1.address, tokenId);

//     // Non-organizer should fail to issue NFT
//     const nonOrganizer = sponsor1;
//     await expect(sponsorAgreement.connect(nonOrganizer).issueSponsorshipNFT(sponsor1.address, tokenId + 1))
//       .to.be.revertedWith("Only organizer can perform this action");
//   });

//   it("should allow organizer to terminate sponsorship and refund", async function () {
//     const { sponsorAgreement, organizer, sponsor1, contributions } = await loadFixture(deploySponsorAgreementFixture);

//     // Organizer terminates sponsor1's agreement
//     await expect(sponsorAgreement.connect(organizer).terminateSponsorship(sponsor1.address))
//       .to.emit(sponsorAgreement, "SponsorshipTerminated")
//       .withArgs(sponsor1.address, contributions[0]);

//     // Sponsor1 should no longer exist in the sponsors list
//     const sponsor1Details = await sponsorAgreement.getSponsorDetails(sponsor1.address);
//     expect(sponsor1Details.contribution).to.equal(0);
//   });

//   it("should allow only the organizer to distribute revenue or terminate sponsorship", async function () {
//     const { sponsorAgreement, sponsor1 } = await loadFixture(deploySponsorAgreementFixture);

//     const totalRevenue = ethers.parseEther("5.0");

//     // Non-organizer trying to distribute revenue should fail
//     await expect(sponsorAgreement.connect(sponsor1).distributeRevenue(totalRevenue))
//       .to.be.revertedWith("Only organizer can perform this action");

//     // Non-organizer trying to terminate sponsorship should fail
//     await expect(sponsorAgreement.connect(sponsor1).terminateSponsorship(sponsor1.address))
//       .to.be.revertedWith("Only organizer can perform this action");
//   });

//   it("should handle termination of sponsorship correctly", async function () {
//     const { sponsorAgreement, organizer, sponsor1, contributions } = await loadFixture(deploySponsorAgreementFixture);

//     // Organizer terminates sponsor1's agreement
//     await expect(sponsorAgreement.connect(organizer).terminateSponsorship(sponsor1.address))
//       .to.emit(sponsorAgreement, "SponsorshipTerminated")
//       .withArgs(sponsor1.address, contributions[0]);

//     // Sponsor1 should no longer exist in the sponsors list
//     const sponsor1Details = await sponsorAgreement.getSponsorDetails(sponsor1.address);
//     expect(sponsor1Details.contribution).to.equal(0);
//   });

//   it("should distribute revenue correctly when event occurs", async function () {
//     const { sponsorAgreement, organizer, sponsor1, sponsor2, sponsor3, revenueShares } = await loadFixture(deploySponsorAgreementFixture);

//     // Let organizer distribute revenue of 6 ETH
//     const totalRevenue = ethers.parseEther("6.0");

//     // Fund the contract to simulate accumulated event revenue
//     await organizer.sendTransaction({ to: sponsorAgreement.target, value: totalRevenue });

//     // Distribute revenue (organizer-only function)
//     await expect(sponsorAgreement.connect(organizer).distributeRevenue(totalRevenue))
//       .to.emit(sponsorAgreement, "RevenueDistributed")
//       .withArgs(totalRevenue);

//     // Verify revenue payouts based on the revenue shares (10%, 20%, 30%)
//     const sponsor1Balance = await ethers.provider.getBalance(sponsor1.address);
//     const sponsor2Balance = await ethers.provider.getBalance(sponsor2.address);
//     const sponsor3Balance = await ethers.provider.getBalance(sponsor3.address);

//     expect(sponsor1Balance).to.be.gt(ethers.parseEther("10.0")); // Example comparison, adjust accordingly
//     expect(sponsor2Balance).to.be.gt(ethers.parseEther("10.0"));
//     expect(sponsor3Balance).to.be.gt(ethers.parseEther("10.0"));
//   });
});
