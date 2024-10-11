// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Utils/Errors.sol";
import "./EventManagerFactory.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Ticket is ERC721, ERC721URIStorage {
    address public organizer;
    uint256 public totalTickets;
    uint256 public totalTicketsSold;
    uint256 public eventId;
    TicketTier[] public ticketTiers; // Array of ticket tiers
    bool public isEventTerminated;

    struct TicketInfo {
        string[] tierNames;
        uint256[] tierPrices;
        string[] ticketTierIpfshash;
        uint256[] tierAvailability;
    }

    struct TicketTier {
        uint256 ticketId;
        string tierName;
        uint256 price;
        uint256 totalAvailable;
        string ticketTierIpfshash;
        uint256 ticketsSold;
    }

    struct Attendee {
        address attendee;
        uint256 amountPaid;
        uint256 ticketId;
        bool hasClaimedRefund;
    }

    // Mappings
    mapping(address => Attendee) public attendees;
    mapping(uint256 => Attendee[]) public eventToAttendees;

    event TicketPurchased(
        address indexed attendee,
        uint256 amountPaid,
        uint256 ticketId
    );

    constructor(
        uint256 _eventId,
        uint256 _totalTickets,
        EventManagerFactory.TicketInfo memory ticketInfo,
        address _organizer
    ) ERC721("HostX", "HTX") {
        organizer = _organizer;
        eventId = _eventId;
        totalTickets = _totalTickets;

        // Check that all tier-related data is consistent
        require(
            ticketInfo.tierNames.length == ticketInfo.tierPrices.length &&
                ticketInfo.tierNames.length ==
                ticketInfo.tierAvailability.length &&
                ticketInfo.tierNames.length ==
                ticketInfo.ticketTierIpfshash.length,
            "Tier data length mismatch"
        );

        // Initialize each ticket tier
        for (uint256 i = 0; i < ticketInfo.tierNames.length; i++) {
            ticketTiers.push(
                TicketTier({
                    ticketId: i,
                    tierName: ticketInfo.tierNames[i],
                    price: ticketInfo.tierPrices[i],
                    totalAvailable: ticketInfo.tierAvailability[i],
                    ticketTierIpfshash: ticketInfo.ticketTierIpfshash[i],
                    ticketsSold: 0
                })
            );
        }
    }

    // Modifier to check that the caller is the event organizer
    modifier onlyOrganizer() {
        require(
            msg.sender == organizer,
            "Only the event organizer can perform this action"
        );
        _;
    }

    modifier eventTerminated() {
        require(isEventTerminated, "Event is not terminated");
        _;
    }

    modifier hasPurchasedTicket() {
        require(attendees[msg.sender].amountPaid > 0, "No ticket purchased");
        _;
    }

    modifier ownsNFT(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Caller does not own the NFT");
        _;
    }

    function buyTicket(uint256 tierIndex) external payable {
        if (msg.sender == address(0)) {
            revert Error.ZeroAddressDetected();
        }
        if (tierIndex >= ticketTiers.length) {
            revert Error.InvalidTicketTier();
        }
        TicketTier storage tier = ticketTiers[tierIndex];
        if (tier.ticketsSold >= tier.totalAvailable) {
            revert Error.NoAvailableTierForTier();
        }
        if (msg.value != tier.price) {
            revert Error.IncorrectPaymentAmount();
        }
        if (totalTicketsSold >= totalTickets) {
            revert Error.AllTicketSoldOut();
        }

        tier.ticketsSold++;
        totalTicketsSold++;

        attendees[msg.sender] = Attendee(
            msg.sender,
            msg.value,
            tierIndex,
            false
        );
        eventToAttendees[eventId].push(attendees[msg.sender]);
        emit TicketPurchased(msg.sender, msg.value, tierIndex);
        mintTickets(msg.sender, tier.ticketId, tier.ticketTierIpfshash);
    }

    function getAvailableTickets(
        uint256 tierIndex
    ) external view returns (uint256 availableTickets) {
        if (msg.sender == address(0)) {
            revert Error.ZeroAddressDetected();
        }
        require(tierIndex < ticketTiers.length, "Invalid Ticket Tier");
        TicketTier storage tier = ticketTiers[tierIndex];
        availableTickets = tier.totalAvailable - tier.ticketsSold;

        return availableTickets;
    }

    function getTicketTierInfo(
        uint256 tierIndex
    )
        external
        view
        returns (
            uint256 ticketId,
            string memory tierName,
            uint256 price,
            uint256 totalAvailable,
            string memory ticketTierIpfshash,
            uint256 ticketsSold
        )
    {
        require(tierIndex < ticketTiers.length, "Invalid Ticket Tier");
        TicketTier storage tier = ticketTiers[tierIndex];
        return (
            tier.ticketId,
            tier.tierName,
            tier.price,
            tier.totalAvailable,
            tier.ticketTierIpfshash,
            tier.ticketsSold
        );
    }

    function terminateEvent() external onlyOrganizer {
        isEventTerminated = true;
    }

    function claimRefundTicket()
        external
        payable
        hasPurchasedTicket
        eventTerminated
    {
        require(msg.sender != address(0), "Invalid Address");
        Attendee storage attendee = attendees[msg.sender];

        require(!attendee.hasClaimedRefund, "Refund already claimed");
        uint256 refundAmount = attendee.amountPaid;
        require(refundAmount > 0, "No funds to refund");
        attendee.hasClaimedRefund = true;

        // Refund the amount
        (bool sent, ) = msg.sender.call{value: refundAmount}("");
        require(sent, "Refund failed.");
    }

    function validateTicket(
        uint256 ticketId
    )
        external
        view
        hasPurchasedTicket
        ownsNFT(ticketId)
        returns (TicketTier memory)
    {
        require(!isEventTerminated, "Event is terminated");
        return ticketTiers[ticketId];
    }

    function mintTickets(
        address _ticketBuyer,
        uint256 _ticketId,
        string memory ticketIpfsHash
    ) private {
        _safeMint(_ticketBuyer, _ticketId);
        _setTokenURI(
            _ticketId,
            string(abi.encodePacked("ipfs://", ticketIpfsHash))
        );
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
