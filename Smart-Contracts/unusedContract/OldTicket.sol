// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Utils/Errors.sol";
import "./EventManagerFactory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Ticket is ERC721, ERC721URIStorage {
    address public organizer;
    uint public totalTickets;
    uint public totalTicketsSold;
    uint32 public eventId;
    TicketTier[] public ticketTiers; // Array of ticket tiers
    uint public ticketTierCount;
    bool public isEventTerminated;
    bool public eventFinalized;
    uint public stakeholdersCount;
    address[] public stakeholderAddresses;
    uint totalEtherRevenue;
    uint totalTokenRevenue;

    IERC20 public token;

    enum PaymentMethod {
        Ether,
        ERC20TOKEN
    }

    struct TicketInfo {
        string[] tierNames;
        uint[] tierPrices;
        string[] ticketTierIpfshash;
        uint[] tierAvailability;
    }

    struct TicketTier {
        uint ticketId;
        string tierName;
        uint price;
        uint totalAvailable;
        string ticketTierIpfshash;
        uint ticketsSold;
    }

    struct Attendee {
        address attendee;
        uint amountPaid;
        uint ticketId;
        bool hasClaimedRefund;
        PaymentMethod paidWith;
    }
    struct Stakeholder {
        uint share;
        uint amountReceived;
        bool isPaid;
    }

    // Mappings
    mapping(address => Attendee) public attendees;
    mapping(uint => Attendee[]) public eventToAttendees;
    mapping(address => Stakeholder) public stakeholders;

    event TicketPurchased(
        address indexed attendee,
        uint amountPaid,
        uint ticketId
    );

    constructor(
        uint32 _eventId,
        uint _totalTickets,
        EventManagerFactory.TicketInfo memory ticketInfo,
        EventManagerFactory.RevenueInfo memory revenueInfo,
        address _organizer,
        address _paymentTokenAddress
    ) ERC721("HostX", "HTX") {
        organizer = _organizer;
        eventId = _eventId;
        totalTickets = _totalTickets;
        token = IERC20(_paymentTokenAddress);

        ticketTierCount = ticketInfo.tierNames.length;

        require(
            ticketTierCount == ticketInfo.tierPrices.length &&
                ticketTierCount == ticketInfo.tierAvailability.length &&
                ticketTierCount == ticketInfo.ticketTierIpfshash.length,
            "Tier data length mismatch"
        );
        stakeholdersCount = revenueInfo.stakeholders.length;

        require(
            stakeholdersCount == revenueInfo.sharingPercentage.length,
            "Stakeholder data mismatch."
        );

        // Initialize each ticket tier
        for (uint i = 0; i < ticketInfo.tierNames.length; i++) {
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

        for (uint i = 0; i < stakeholdersCount; i++) {
            uint sharePercentage = revenueInfo.sharingPercentage[i];

            require(
                sharePercentage > 0 && sharePercentage <= 100,
                "Invalid share percentage."
            );

            address stakeholderAddress = revenueInfo.stakeholders[i];
            stakeholders[stakeholderAddress] = Stakeholder({
                share: sharePercentage,
                amountReceived: 0,
                isPaid: false
            });

            stakeholderAddresses.push(stakeholderAddress);
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

    modifier ownsNFT(uint tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Caller does not own the NFT");
        _;
    }

    modifier eventNotFinalized() {
        require(!eventFinalized, "Event has been finalized.");
        _;
    }

    function buyTicket(uint tierIndex, uint tokenAmount) external payable {
        uint amountPaid;
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
        if (totalTicketsSold >= totalTickets) {
            revert Error.AllTicketSoldOut();
        }
        PaymentMethod method = PaymentMethod.Ether;
        // If the user wants to pay with Ether
        if (msg.value > 0) {
            if (msg.value != tier.price) {
                revert Error.IncorrectPaymentAmount();
            }
            // Increase revenue by Ether value
            amountPaid = msg.value;
            totalEtherRevenue += msg.value;
        }
        // If the user wants to pay with ERC-20 tokens
        else if (tokenAmount > 0) {
            method = PaymentMethod.ERC20TOKEN;
            if (tokenAmount != tier.price) {
                revert Error.IncorrectPaymentAmount();
            }
            bool success = token.transferFrom(
                msg.sender,
                address(this),
                tokenAmount
            );
            if (!success) {
                revert Error.TokenTransferFailed();
            }
            totalTokenRevenue += tokenAmount;
            amountPaid = tokenAmount;
        } else {
            revert Error.IncorrectPaymentAmount(); // Neither Ether nor tokens provided
        }

        tier.ticketsSold++;
        totalTicketsSold++;

        attendees[msg.sender] = Attendee(
            msg.sender,
            amountPaid,
            tierIndex,
            false,
            method
        );
        eventToAttendees[eventId].push(attendees[msg.sender]);
        emit TicketPurchased(msg.sender, msg.value, tierIndex);
        mintTickets(msg.sender, tier.ticketId, tier.ticketTierIpfshash);
    }

    function getAvailableTickets(
        uint tierIndex
    ) external view returns (uint availableTickets) {
        if (msg.sender == address(0)) {
            revert Error.ZeroAddressDetected();
        }
        require(tierIndex < ticketTiers.length, "Invalid Ticket Tier");
        TicketTier storage tier = ticketTiers[tierIndex];
        availableTickets = tier.totalAvailable - tier.ticketsSold;

        return availableTickets;
    }

    function getTicketTierInfo(
        uint tierIndex
    )
        external
        view
        returns (
            uint ticketId,
            string memory tierName,
            uint price,
            uint totalAvailable,
            string memory ticketTierIpfshash,
            uint ticketsSold
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
        uint refundAmount = attendee.amountPaid;
        PaymentMethod method = attendee.paidWith;
        require(refundAmount > 0, "No funds to refund");
        attendee.hasClaimedRefund = true;

        // Refund the amount
        if (method == PaymentMethod.Ether) {
            (bool sent, ) = msg.sender.call{value: refundAmount}("");
            require(sent, "Refund failed.");
        } else if (method == PaymentMethod.ERC20TOKEN) {
            require(
                token.balanceOf(address(this)) >= refundAmount,
                "Insufficient token balance"
            );
            bool success = token.transfer(msg.sender, refundAmount);
            require(success, "Token transfer failed");
        }
    }

    function validateTicket(
        uint ticketId
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

    //REVENUE MANAGEMENT HERE.

    function distributeRevenue(
        uint totalRevenue,
        PaymentMethod _method
    ) external onlyOrganizer eventNotFinalized {
        require(totalRevenue > 0, "No revenue to distribute");
        for (uint i = 0; i < stakeholderAddresses.length; i++) {
            address stakeholderAddress = stakeholderAddresses[i];
            Stakeholder storage stakeholder = stakeholders[stakeholderAddress];
            if (!stakeholder.isPaid) {
                uint payment = (totalRevenue * stakeholder.share) / 100;
                if (_method == PaymentMethod.Ether) {
                    payable(stakeholderAddress).transfer(payment);
                } else if (_method == PaymentMethod.ERC20TOKEN) {
                    require(
                        token.balanceOf(address(this)) >= payment,
                        "Insufficient token balance"
                    );
                    bool success = token.transfer(stakeholderAddress, payment);
                    require(success, "ERC20 token transfer failed");
                }
                stakeholder.amountReceived += payment;
                stakeholder.isPaid = true;
            }
        }
    }

    function mintTickets(
        address _ticketBuyer,
        uint _ticketId,
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
        uint tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
