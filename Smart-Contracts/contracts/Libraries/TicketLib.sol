// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./EventCreationLib.sol";
import "./TicketPurchaseLib.sol";

library TicketLib {
    struct TicketInfo {
        string[] tierNames;
        uint[] tierPrices;
        uint16[] tierAvailability;
        string[] ticketTierIpfshash;
    }

    struct TicketTier {
        string tierName;
        uint16 price;
        uint16 totalAvailable;
        uint16 ticketsSold;
        string ticketTierIpfshash;
    }

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

    function addTicketToEvent(
        mapping(uint => EventCreationLib.EventDetail) storage events,
        uint16 _eventId,
        address _organizer,
        uint16 _totalTickets,
        address _paymentTokenAddress
    ) external {
        require(events[_eventId].eventId != 0, "Invalid Event ID");
        require(_organizer != address(0), "Address zero detected");
        require(_totalTickets > 0, "Add total ticket");
        require(_paymentTokenAddress != address(0), "Address zero detected");

        EventCreationLib.EventDetail storage ev = events[_eventId];
        address ticketContractAddress = address(
            new Ticket(
                _eventId,
                _organizer,
                _totalTickets,
                _paymentTokenAddress
            )
        );

        ev.ticketContract = ticketContractAddress;
    }

    function addTicketTier(
        mapping(uint => TicketTier) storage ticketTiers,
        uint tierIndex,
        string memory _tierName,
        uint16 price,
        uint16 totalAvailable,
        string memory ticketTierIpfshash
    ) external {
        require(
            ticketTiers[tierIndex].totalAvailable == 0,
            "Ticket tier already exists"
        );
        require(bytes(_tierName).length > 0, "Enter Ticket TierName");

        ticketTiers[tierIndex] = TicketTier({
            tierName: _tierName,
            price: price,
            totalAvailable: totalAvailable,
            ticketsSold: 0,
            ticketTierIpfshash: ticketTierIpfshash
        });
    }
}
