// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Utils/Errors.sol";
import "./Libraries/EventCreationLib.sol";
// import "./EventManagerFactory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

library TicketLib {
    function safeTransferEther(address recipient, uint amount) internal {
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Ether transfer failed");
    }

    function safeTransferToken(
        address recipient,
        uint amount,
        IERC20 token
    ) internal {
        bool success = token.transferFrom(msg.sender, recipient, amount);
        require(success, "Token transfer failed");
    }

    function safeTransferTokenFromContract(
        address recipient,
        uint amount,
        IERC20 token
    ) internal {
        bool success = token.transfer(recipient, amount);
        require(success, "Token transfer failed");
    }
}

abstract contract TicketBase is ERC721 {
    address public organizer;
    bool public isEventTerminated;
    uint32 public eventId;
    uint public totalTickets;
    uint public totalTicketsSold;

    constructor(
        uint32 _eventId,
        uint _totalTickets,
        address _organizer
    ) ERC721("HostX", "HTX") {
        organizer = _organizer;
        eventId = _eventId;
        totalTickets = _totalTickets;
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer");
        _;
    }

    modifier eventTerminated() {
        require(isEventTerminated, "Event not terminated");
        _;
    }

    function terminateEvent() external onlyOrganizer {
        isEventTerminated = true;
    }
}

contract Ticket is TicketBase, ERC721URIStorage {
    using TicketLib for address;
    using TicketLib for IERC20;

    IERC20 public token;
    bool public eventFinalized;
    uint public totalEtherRevenue;
    uint public totalTokenRevenue;

    mapping(uint => TicketTier) public ticketTiers;
    mapping(address => Attendee) public attendees;
    mapping(address => Stakeholder) public stakeholders;
    mapping(uint => address) public stakeholderAddresses;

    uint public ticketTierCount;
    uint public stakeholdersCount;

    struct TicketTier {
        uint price;
        uint totalAvailable;
        uint ticketsSold;
        bytes32 ticketTierIpfshash;
    }

    struct Attendee {
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

    enum PaymentMethod {
        Ether,
        ERC20TOKEN
    }

    event TicketPurchased(
        address indexed attendee,
        uint amountPaid,
        uint ticketId
    );

    constructor(
        uint32 _eventId,
        uint _totalTickets,
        EventCreationLib.TicketInfo memory ticketInfo,
        EventCreationLib.RevenueInfo memory revenueInfo,
        address _organizer,
        address _paymentTokenAddress
    ) TicketBase(_eventId, _totalTickets, _organizer) {
        token = IERC20(_paymentTokenAddress);

        ticketTierCount = ticketInfo.tierNames.length;
        stakeholdersCount = revenueInfo.stakeholders.length;

        for (uint i = 0; i < ticketTierCount; i++) {
            ticketTiers[i] = TicketTier({
                price: ticketInfo.tierPrices[i],
                totalAvailable: ticketInfo.tierAvailability[i],
                ticketsSold: 0,
                ticketTierIpfshash: bytes32(ticketInfo.ticketTierIpfshash[i])
            });
        }

        for (uint i = 0; i < stakeholdersCount; i++) {
            stakeholders[revenueInfo.stakeholders[i]] = Stakeholder({
                share: revenueInfo.sharingPercentage[i],
                amountReceived: 0,
                isPaid: false
            });

            stakeholderAddresses[i] = revenueInfo.stakeholders[i];
        }
    }

    function buyTicket(uint tierIndex, uint tokenAmount) external payable {
        TicketTier storage tier = ticketTiers[tierIndex];
        require(tier.ticketsSold < tier.totalAvailable, "No tickets available");
        require(totalTicketsSold < totalTickets, "All tickets sold");

        uint amountPaid;
        PaymentMethod method;

        if (msg.value > 0) {
            require(msg.value == tier.price, "Incorrect Ether amount");
            totalEtherRevenue += msg.value;
            amountPaid = msg.value;
            method = PaymentMethod.Ether;
        } else if (tokenAmount > 0) {
            require(tokenAmount == tier.price, "Incorrect token amount");
            TicketLib.safeTransferToken(address(this), tokenAmount, token);
            totalTokenRevenue += tokenAmount;
            amountPaid = tokenAmount;
            method = PaymentMethod.ERC20TOKEN;
        } else {
            revert Error.IncorrectPaymentAmount();
        }

        attendees[msg.sender] = Attendee(amountPaid, tierIndex, false, method);
        totalTicketsSold++;
        tier.ticketsSold++;

        emit TicketPurchased(msg.sender, amountPaid, tierIndex);
        _mintTicket(msg.sender, tierIndex, tier.ticketTierIpfshash);
    }

    function _mintTicket(
        address buyer,
        uint ticketId,
        bytes32 ticketIpfsHash
    ) private {
        _safeMint(buyer, ticketId);
        _setTokenURI(
            ticketId,
            string(abi.encodePacked("ipfs://", ticketIpfsHash))
        );
    }

    function claimRefundTicket() external eventTerminated {
        Attendee storage attendee = attendees[msg.sender];
        require(!attendee.hasClaimedRefund, "Refund already claimed");

        attendee.hasClaimedRefund = true;
        uint refundAmount = attendee.amountPaid;

        if (attendee.paidWith == PaymentMethod.Ether) {
            msg.sender.safeTransferEther(refundAmount);
        } else {
            // token.safeTransferToken(msg.sender, refundAmount);
            TicketLib.safeTransferTokenFromContract(
                msg.sender,
                refundAmount,
                token
            );
        }
    }

    function distributeRevenue(
        uint totalRevenue,
        PaymentMethod method
    ) external onlyOrganizer {
        require(totalRevenue > 0, "No revenue to distribute");
        require(!eventFinalized, "Event finalized");

        for (uint i = 0; i < stakeholdersCount; i++) {
            Stakeholder storage stakeholder = stakeholders[
                stakeholderAddresses[i]
            ];
            if (!stakeholder.isPaid) {
                uint payment = (totalRevenue * stakeholder.share) / 100;
                stakeholder.amountReceived += payment;

                if (method == PaymentMethod.Ether) {
                    stakeholderAddresses[i].safeTransferEther(payment);
                } else {
                    // token.safeTransferToken(stakeholderAddresses[i], payment);
                    TicketLib.safeTransferTokenFromContract(
                        stakeholderAddresses[i],
                        payment,
                        token
                    );
                }

                stakeholder.isPaid = true;
            }
        }
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
