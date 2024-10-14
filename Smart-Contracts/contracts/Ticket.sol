// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./TicketBase.sol";
import "./Libraries/EventCreationLib.sol";
import "./Libraries/TicketLib.sol";
import "./Libraries/TicketPurchaseLib.sol";
import "./Libraries/RefundLib.sol";
import "./Libraries/RevenueDistributionLib.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ticket is TicketBase, ERC721URIStorage {
    using TicketPurchaseLib for *;
    using RefundLib for *;
    using RevenueDistributionLib for *;

    IERC20 public token;
    bool public eventFinalized;
    uint public totalEtherRevenue;
    uint public totalTokenRevenue;

    mapping(uint => TicketLib.TicketTier) public ticketTiers;
    mapping(address => TicketPurchaseLib.Attendee) public ticketAttendees; // For ticket purchases
    mapping(address => RefundLib.Attendee) public refundAttendees; // For refunds
    mapping(address => RevenueDistributionLib.Stakeholder) public stakeholders;
    mapping(uint => address) public stakeholderAddresses;

    uint8[] public currentTicketShares;

    uint public ticketTierCount;
    uint public stakeholdersCount;

    struct RevenueInfo {
        address[] stakeholders;
        uint[] sharingPercentage;
    }

    event StakeHolderAdded(address stakeholder, uint8 sharegiven);

    constructor(
        uint16 _eventId,
        address _organizer,
        uint16 _totalTickets,
        address _paymentTokenAddress
    ) TicketBase(_eventId, _totalTickets, _organizer) {
        token = IERC20(_paymentTokenAddress);
    }

    function addTicketTier(
        uint tierIndex,
        string memory _tierName,
        uint16 price,
        uint16 totalAvailable,
        string memory ticketTierIpfshash
    ) external onlyOrganizer {
        TicketLib.addTicketTier(
            ticketTiers,
            tierIndex,
            _tierName,
            price,
            totalAvailable,
            ticketTierIpfshash
        );
    }

    function buyTicket(uint tierIndex, uint tokenAmount) external payable {
        (
            totalTicketsSold,
            totalEtherRevenue,
            totalTokenRevenue
        ) = TicketPurchaseLib.buyTicket(
            ticketTiers,
            ticketAttendees,
            token,
            tierIndex,
            tokenAmount,
            msg.value,
            totalTickets,
            totalTicketsSold,
            totalEtherRevenue,
            totalTokenRevenue
        );

        _mintTicket(
            msg.sender,
            tierIndex,
            ticketTiers[tierIndex].ticketTierIpfshash
        );
    }

    function claimRefundTicket() external eventTerminated {
        // Ensure the attendee has a valid amount paid before claiming a refund
        require(
            refundAttendees[msg.sender].amountPaid > 0,
            "No amount to refund"
        );
        RefundLib.claimRefund(refundAttendees, token); // Pass the correct mapping
    }

    function addStakeHolderToEvent(
        address _stakeholderAddress,
        uint8 sharePercent
    ) external onlyOrganizer {
        RevenueDistributionLib.addStakeholderToEvent(
            _stakeholderAddress,
            sharePercent,
            currentTicketShares,
            stakeholders,
            stakeholderAddresses
        );

        emit StakeHolderAdded(_stakeholderAddress, sharePercent);
    }

    function distributeRevenue(
        uint totalRevenue,
        TicketBase.PaymentMethod method
    ) external onlyOrganizer {
        eventFinalized = RevenueDistributionLib.distributeRevenue(
            stakeholders,
            stakeholderAddresses,
            stakeholdersCount,
            totalRevenue,
            eventFinalized,
            method,
            token
        );
    }

    function _mintTicket(
        address buyer,
        uint ticketId,
        string memory ticketIpfsHash
    ) internal {
        _safeMint(buyer, ticketId); // Mint the ticket in the contract itself
        _setTokenURI(
            ticketId,
            string(abi.encodePacked("ipfs://", ticketIpfsHash))
        );
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
