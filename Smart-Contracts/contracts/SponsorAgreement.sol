// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SponsorAgreement is ReentrancyGuard {
    struct Sponsor {
        uint256 contribution;
        uint256 revenueShare;
        bool paid;
        uint256 eventId;
    }

    mapping(address => Sponsor) public sponsors;
    address[] public sponsorAddresses;
    uint256 public totalContributions;
    uint256 public totalRevenueShares;
    address public organizer;
    bool public isTerminated;

    event SponsorshipAgreementCreated(address[] sponsors, uint256[] contributions, uint256[] revenueShares, address organizer);
    event ContributionReceived(address indexed sponsor, uint256 amount);
    event RevenueDistributed(uint256 totalRevenue);
    event SponsorshipNFTIssued(address indexed sponsor, uint256 tokenId);
    event SponsorshipTerminated(address indexed sponsor, uint256 refundedAmount);

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can perform this action");
        _;
    }

    constructor(
        address[] memory _sponsors,
        uint256[] memory _contributions,
        uint256[] memory _revenueShares,
        uint256[] memory _eventIds, 
        address _organizer
    ) {
        require(_sponsors.length == _contributions.length, "Mismatched sponsors and contributions");
        require(_sponsors.length == _revenueShares.length, "Mismatched sponsors and revenue shares");
        require(_sponsors.length == _eventIds.length, "Mismatched sponsors and event IDs"); // New check

        for (uint256 i = 0; i < _sponsors.length; i++) {
            sponsors[_sponsors[i]] = Sponsor(_contributions[i], _revenueShares[i], false, _eventIds[i]); // Updated
            sponsorAddresses.push(_sponsors[i]);
            totalContributions += _contributions[i];
            totalRevenueShares += _revenueShares[i];
        }

        organizer = _organizer;
        emit SponsorshipAgreementCreated(_sponsors, _contributions, _revenueShares, _organizer);
    }

    function contribute() external payable nonReentrant {
        require(!isTerminated, "Sponsorship has been terminated");
        Sponsor storage sponsor = sponsors[msg.sender];
        require(sponsor.contribution > 0, "Not a valid sponsor");
        require(msg.value == sponsor.contribution, "Contribution amount mismatch");

        emit ContributionReceived(msg.sender, msg.value);
    }

    function distributeRevenue(uint256 totalRevenue) external onlyOrganizer nonReentrant {
        require(!isTerminated, "Sponsorship has been terminated");
        require(totalRevenue > 0, "Revenue must be greater than zero");

        for (uint256 i = 0; i < sponsorAddresses.length; i++) {
            address sponsorAddress = sponsorAddresses[i];
            Sponsor storage sponsor = sponsors[sponsorAddress];

            if (!sponsor.paid) {
                uint256 sponsorRevenue = (totalRevenue * sponsor.revenueShare) / totalRevenueShares;
                (bool success, ) = sponsorAddress.call{value: sponsorRevenue}("");
                require(success, "Revenue transfer failed");
                sponsor.paid = true;
            }
        }

        emit RevenueDistributed(totalRevenue);
    }

    function issueSponsorshipNFT(address sponsor, uint256 tokenId) external onlyOrganizer {
        require(!isTerminated, "Sponsorship has been terminated");
        Sponsor memory s = sponsors[sponsor];
        require(s.contribution > 0, "Invalid sponsor");

        // Logic to mint or assign NFT (could be an external ERC721 contract)
        emit SponsorshipNFTIssued(sponsor, tokenId);
    }

    function terminateSponsorship(address sponsor) external onlyOrganizer nonReentrant {
        require(!isTerminated, "Sponsorship has already been terminated");
        Sponsor memory s = sponsors[sponsor];
        require(s.contribution > 0, "Invalid sponsor");

        // Refund contribution
        (bool success, ) = sponsor.call{value: s.contribution}("");
        require(success, "Refund transfer failed");

        emit SponsorshipTerminated(sponsor, s.contribution);
        delete sponsors[sponsor]; 
    }

    function withdrawContribution() external nonReentrant {
        require(isTerminated, "Sponsorship is still active");
        Sponsor storage sponsor = sponsors[msg.sender];
        require(sponsor.contribution > 0, "No contribution to withdraw");

        uint256 amount = sponsor.contribution;
        sponsor.contribution = 0; // Reset contribution to prevent re-entrancy

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function getSponsorDetails(address sponsor)
        external
        view
        returns (uint256 contribution, uint256 revenueShare, bool paid, uint256 eventId) // Updated return values
    {
        Sponsor memory s = sponsors[sponsor];
        return (s.contribution, s.revenueShare, s.paid, s.eventId);
    }
}
