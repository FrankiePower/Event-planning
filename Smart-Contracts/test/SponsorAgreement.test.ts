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
    const totalRevenueShares = revenueShares.reduce((a, b) => a + b, 0);

    // Create the SponsorInfo struct
    const sponsorInfo = {
        sponsors: sponsors,
        sponsorContributions: contributions,
        sponsorRevenueShares: revenueShares
    };
    const eventId = 1;
    // Deploy the contract with the SponsorInfo struct
    const sponsorAgreement = await SponsorAgreement.deploy(sponsorInfo, eventId, organizer.address);

    return { sponsorAgreement, organizer, sponsor1, sponsor2, sponsor3, sponsors, contributions, revenueShares, totalRevenueShares };
  }

  it("should initialize sponsors correctly", async function () {
    const { sponsorAgreement, sponsor1, sponsor2, sponsor3, contributions, revenueShares } = await loadFixture(deploySponsorAgreementFixture);

    // Verify sponsor1 details
    const sponsor1Details = await sponsorAgreement.getSponsorDetails(sponsor1.address);
    expect(sponsor1Details.contribution).to.equal(contributions[0]);
    expect(sponsor1Details.revenueShare).to.equal(revenueShares[0]);
    expect(sponsor1Details.paid).to.be.false;

    // Verify sponsor2 details
    const sponsor2Details = await sponsorAgreement.getSponsorDetails(sponsor2.address);
    expect(sponsor2Details.contribution).to.equal(contributions[1]);
    expect(sponsor2Details.revenueShare).to.equal(revenueShares[1]);

    // Verify sponsor3 details
    const sponsor3Details = await sponsorAgreement.getSponsorDetails(sponsor3.address);
    expect(sponsor3Details.contribution).to.equal(contributions[2]);
    expect(sponsor3Details.revenueShare).to.equal(revenueShares[2]);
  });

  it("should allow sponsors to contribute the correct amount", async function () {
    const { sponsorAgreement, sponsor1, sponsor2, sponsor3, contributions } = await loadFixture(deploySponsorAgreementFixture);

    // Sponsor 1 contributes
    await expect(sponsorAgreement.connect(sponsor1).contribute({ value: contributions[0] }))
      .to.emit(sponsorAgreement, "ContributionReceived")
      .withArgs(sponsor1.address, contributions[0]);

    // Sponsor 2 contributes
    await expect(sponsorAgreement.connect(sponsor2).contribute({ value: contributions[1] }))
      .to.emit(sponsorAgreement, "ContributionReceived")
      .withArgs(sponsor2.address, contributions[1]);

    // Sponsor 3 contributes
    await expect(sponsorAgreement.connect(sponsor3).contribute({ value: contributions[2] }))
      .to.emit(sponsorAgreement, "ContributionReceived")
      .withArgs(sponsor3.address, contributions[2]);
  });

  // it("should distribute revenue correctly", async function () {
  //   const { sponsorAgreement, organizer, sponsor1, sponsor2, sponsor3, revenueShares, totalRevenueShares } = await loadFixture(deploySponsorAgreementFixture);

  //   // Let organizer distribute revenue of 6 ETH
  //   const totalRevenue = ethers.parseEther("6.0");

  //   // Fund the contract to simulate accumulated event revenue
  //   await organizer.sendTransaction({ to: sponsorAgreement.target, value: totalRevenue });

  //   const sponsor1BalanceBefore = await ethers.provider.getBalance(sponsor1.address);
  //   const sponsor2BalanceBefore = await ethers.provider.getBalance(sponsor2.address);
  //   const sponsor3BalanceBefore = await ethers.provider.getBalance(sponsor3.address);


  //   // Distribute revenue (organizer-only function)
  //   await expect(sponsorAgreement.connect(organizer).distributeRevenue(totalRevenue))
  //     .to.emit(sponsorAgreement, "RevenueDistributed")
  //     .withArgs(totalRevenue);

  //   // Calculate expected payouts
  //   const expectedSponsor1Payout = (totalRevenue * BigInt(revenueShares[0])) / BigInt(totalRevenueShares);
  //   const expectedSponsor2Payout = (totalRevenue * BigInt(revenueShares[1])) / BigInt(totalRevenueShares);
  //   const expectedSponsor3Payout = (totalRevenue * BigInt(revenueShares[2])) / BigInt(totalRevenueShares);

  //   // Verify revenue payouts
  //   const sponsor1BalanceAfter = await ethers.provider.getBalance(sponsor1.address);
  //   const sponsor2BalanceAfter = await ethers.provider.getBalance(sponsor2.address);
  //   const sponsor3BalanceAfter = await ethers.provider.getBalance(sponsor3.address);

  //   expect(sponsor1BalanceAfter).to.equal(sponsor1BalanceBefore + expectedSponsor1Payout);
  //   expect(sponsor2BalanceAfter).to.equal(sponsor2BalanceBefore + expectedSponsor2Payout);
  //   expect(sponsor3BalanceAfter).to.equal(sponsor3BalanceBefore + expectedSponsor3Payout);
  // });

  // it("should only allow organizer to distribute revenue", async function () {
  //   const { sponsorAgreement, sponsor1 } = await loadFixture(deploySponsorAgreementFixture);

  //   const totalRevenue = ethers.parseEther("5.0");

  //   // Non-organizer trying to distribute revenue should fail
  //   await expect(sponsorAgreement.connect(sponsor1).distributeRevenue(totalRevenue))
  //     .to.be.revertedWith("Only organizer can perform this action");
  // });

  // it("should handle insufficient funds gracefully", async function () {
  //   const { sponsorAgreement, organizer } = await loadFixture(deploySponsorAgreementFixture);

  //   const totalRevenue = ethers.parseEther("100.0"); // More than the contract balance

  //   // Attempt to distribute more revenue than available
  //   await expect(sponsorAgreement.connect(organizer).distributeRevenue(totalRevenue))
  //     .to.be.revertedWith("Insufficient funds for distribution");
  // });

  it("should allow only organizer to issue NFTs", async function () {
    const { sponsorAgreement, organizer, sponsor1 } = await loadFixture(deploySponsorAgreementFixture);

    const tokenId = 1;

    // Organizer issues NFT to sponsor1
    await expect(sponsorAgreement.connect(organizer).issueSponsorshipNFT(sponsor1.address, tokenId))
      .to.emit(sponsorAgreement, "SponsorshipNFTIssued")
      .withArgs(sponsor1.address, tokenId);

    // Non-organizer should fail to issue NFT
    const nonOrganizer = sponsor1;
    await expect(sponsorAgreement.connect(nonOrganizer).issueSponsorshipNFT(sponsor1.address, tokenId + 1))
      .to.be.revertedWith("Only organizer can perform this action");
  });

  it("should allow organizer to terminate sponsorship and refund", async function () {
    const { sponsorAgreement, organizer, sponsor1, contributions } = await loadFixture(deploySponsorAgreementFixture);
  
    // Fund the contract with Ether before attempting the refund
    await organizer.sendTransaction({
      to: sponsorAgreement.target,
      value: contributions[0],  // Ensure this matches the contribution amount
    });
  
    // Organizer terminates sponsor1's agreement
    await expect(sponsorAgreement.connect(organizer).terminateSponsorship(sponsor1.address))
      .to.emit(sponsorAgreement, "SponsorshipTerminated")
      .withArgs(sponsor1.address, 0);
  
    // Sponsor1 should no longer exist in the sponsors list
    const sponsor1Details = await sponsorAgreement.getSponsorDetails(sponsor1.address);
    expect(sponsor1Details.contribution).to.equal(0);
  });
  

  // it("should allow only the organizer to distribute revenue or terminate sponsorship", async function () {
  //   const { sponsorAgreement, sponsor1 } = await loadFixture(deploySponsorAgreementFixture);

  //   const totalRevenue = ethers.parseEther("5.0");

  //   // Non-organizer trying to distribute revenue should fail
  //   await expect(sponsorAgreement.connect(sponsor1).distributeRevenue(totalRevenue))
  //     .to.be.revertedWith("Only organizer can perform this action");

  //   // Non-organizer trying to terminate sponsorship should fail
  //   await expect(sponsorAgreement.connect(sponsor1).terminateSponsorship(sponsor1.address))
  //     .to.be.revertedWith("Only organizer can perform this action");
  // });

  it("should allow organizer to withdraw contributions", async function () {
    const { sponsorAgreement, organizer, sponsor1, contributions } = await loadFixture(deploySponsorAgreementFixture);

    // Fund the contract with Ether to simulate contributions
    await sponsorAgreement.connect(sponsor1).contribute({ value: contributions[0] });

    const organizerBalanceBefore = await ethers.provider.getBalance(organizer.address);
    const withdrawAmount = ethers.parseEther("0.5");

    // Organizer withdraws a portion of the contributions
    await expect(sponsorAgreement.connect(organizer).withdrawContribution(withdrawAmount))
      .to.emit(sponsorAgreement, "Withdrawal")
      .withArgs(organizer.address, withdrawAmount);

    const organizerBalanceAfter = await ethers.provider.getBalance(organizer.address);
    expect(organizerBalanceAfter).to.be.greaterThan(organizerBalanceBefore);
  });

  it("should revert withdrawal of zero amount", async function () {
    const { sponsorAgreement, organizer } = await loadFixture(deploySponsorAgreementFixture);

    await expect(sponsorAgreement.connect(organizer).withdrawContribution(0))
      .to.be.revertedWithCustomError(sponsorAgreement, "ZeroValueNotAllowed");
  });

  it("should revert withdrawal of amount greater than total contributions", async function () {
    const { sponsorAgreement, organizer } = await loadFixture(deploySponsorAgreementFixture);

    const excessiveAmount = ethers.parseEther("10.0");

    await expect(sponsorAgreement.connect(organizer).withdrawContribution(excessiveAmount))
      .to.be.revertedWithCustomError(sponsorAgreement, "InsufficientFunds");
  });


  


});
