// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./EventManagerFactory.sol";
import {Error} from "./Utils/Errors.sol";
import "hardhat/console.sol";

contract SponsorAgreement is ReentrancyGuard {
    struct Sponsor {
        uint256 contribution;
        uint256 revenueShare;
        bool paid;
        bool active;
        uint256 eventId;
    }

    mapping(address => Sponsor) public sponsors;
    uint256 public totalContributions;
    uint256 public totalRevenueShares;
    address public organizer;
    bool public isTerminated;
    uint256 public eventId;
    address[] public sponsorAddresses; // Array to store sponsor addresses

    // Add a mapping to track issued NFTs
    mapping(address => uint256) public sponsorNFTs;

    event SponsorshipAgreementCreated(
        uint256 eventId,
        address[] sponsors,
        uint256[] contributions,
        uint256[] revenueShares,
        address organizer
    );
    event ContributionReceived(address indexed sponsor, uint256 amount);
    event RevenueDistributed(uint256 totalRevenue);
    event SponsorshipNFTIssued(address indexed sponsor, uint256 tokenId);
    event SponsorshipTerminated(
        address indexed sponsor,
        uint256 refundedAmount
    );
    event Withdrawal(address indexed sponsor, uint256 amount);

    modifier onlyOrganizer() {
        require(
            msg.sender == organizer,
            "Only organizer can perform this action"
        );
        _;
    }

    constructor(
        EventManagerFactory.SponsorInfo memory sponsorInfo,
        uint256 _eventId,
        address _organizer
    ) {
        require(
            sponsorInfo.sponsors.length ==
                sponsorInfo.sponsorContributions.length,
            "Mismatched sponsors and contributions"
        );
        require(
            sponsorInfo.sponsors.length ==
                sponsorInfo.sponsorRevenueShares.length,
            "Mismatched sponsors and revenue shares"
        );

        eventId = _eventId;
        organizer = _organizer;

        for (uint256 i = 0; i < sponsorInfo.sponsors.length; i++) {
            address sponsorAddress = sponsorInfo.sponsors[i];
            sponsors[sponsorAddress] = Sponsor(
                sponsorInfo.sponsorContributions[i],
                sponsorInfo.sponsorRevenueShares[i],
                false,
                true, // Sponsor is active by default
                eventId
            );
            sponsorAddresses.push(sponsorAddress); // Add sponsor address to array
            totalContributions += sponsorInfo.sponsorContributions[i];
            totalRevenueShares += sponsorInfo.sponsorRevenueShares[i];
        }

        emit SponsorshipAgreementCreated(
            eventId,
            sponsorInfo.sponsors,
            sponsorInfo.sponsorContributions,
            sponsorInfo.sponsorRevenueShares,
            organizer
        );
    }

    function contribute() external payable nonReentrant {
        require(!isTerminated, "Sponsorship has been terminated");
        Sponsor storage sponsor = sponsors[msg.sender];
        require(
            sponsor.contribution > 0 && sponsor.active,
            "Not a valid sponsor"
        );
        require(
            msg.value == sponsor.contribution,
            "Contribution amount mismatch"
        );

        emit ContributionReceived(msg.sender, msg.value);
    }


    function issueSponsorshipNFT(address sponsor, uint256 tokenId) external onlyOrganizer {
        Sponsor storage s = sponsors[sponsor];
        require(s.contribution > 0 && s.active, "Invalid sponsor");
        require(sponsorNFTs[sponsor] == 0, "NFT already issued");

        sponsorNFTs[sponsor] = tokenId; // Assign the NFT tokenId to the sponsor
        emit SponsorshipNFTIssued(sponsor, tokenId);
    }

    function terminateSponsorship(address sponsor) external onlyOrganizer nonReentrant {
        require(!isTerminated, "Sponsorship has already been terminated");
        Sponsor storage s = sponsors[sponsor];
        require(s.contribution > 0 && s.active, "Invalid sponsor");

        // Ensure contract has enough balance to refund
        require(address(this).balance >= s.contribution, "Not enough balance for refund");

        // Refund contribution
        (bool success, ) = sponsor.call{value: s.contribution}("");
        require(success, "Refund transfer failed");

        s.contribution = 0;
        s.active = false; // Mark the sponsor as inactive
        emit SponsorshipTerminated(sponsor, s.contribution);
    }

    //Only Organizer Should Withdraw Total Contribution
    function withdrawContribution(
        uint256 _amount
    ) external payable onlyOrganizer nonReentrant {
        if (_amount <= 0) {
            revert Error.ZeroValueNotAllowed();
        }
        if (_amount > totalContributions) {
            revert Error.InsufficientFunds();
        }

        (bool success, ) = organizer.call{value: _amount}("");
        require(success, "Withdrawal failed");
        emit Withdrawal(organizer, _amount);
    }

    function getSponsorDetails(
        address sponsor
    )
        external
        view
        returns (
            uint256 contribution,
            uint256 revenueShare,
            bool paid,
            bool active, // Added active status to returned values
            uint256 event_Id
        )
    {
        Sponsor memory s = sponsors[sponsor];
        return (s.contribution, s.revenueShare, s.paid, s.active, s.eventId);
    }

    receive() external payable {}

}
