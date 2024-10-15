// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../TicketBase.sol";
import "../Utils/Errors.sol";
import "../Libraries/TicketLib.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library TicketPurchaseLib {
    

    struct Attendee {
        uint amountPaid;
        uint ticketId;
        bool hasClaimedRefund;
        TicketBase.PaymentMethod paidWith;
    }

    function buyTicket(
        mapping(uint => TicketLib.TicketTier) storage ticketTiers,
        mapping(address => Attendee) storage attendees,
        IERC20 token,
        uint tierIndex,
        uint tokenAmount,
        uint msgValue,
        uint totalTickets,
        uint totalTicketsSold,
        uint totalEtherRevenue,
        uint totalTokenRevenue
    )
        external
        returns (
            uint newTotalTicketsSold,
            uint newTotalEtherRevenue,
            uint newTotalTokenRevenue
        )
    {
        TicketLib.TicketTier storage tier = ticketTiers[tierIndex];
        require(tier.ticketsSold < tier.totalAvailable, "No tickets available");
        require(totalTicketsSold < totalTickets, "All tickets sold");

        uint amountPaid;
        TicketBase.PaymentMethod method;

        if (msgValue > 0) {
            require(msgValue == tier.price, "Incorrect Ether amount");
            totalEtherRevenue += msgValue;
            amountPaid = msgValue;
            method = TicketBase.PaymentMethod.Ether;
        } else if (tokenAmount > 0) {
            require(tokenAmount == tier.price, "Incorrect token amount");
            token.transferFrom(msg.sender, address(this), tokenAmount);
            totalTokenRevenue += tokenAmount;
            amountPaid = tokenAmount;
            method = TicketBase.PaymentMethod.ERC20TOKEN;
        } else {
            revert Error.IncorrectPaymentAmount();
        }

        attendees[msg.sender] = Attendee(amountPaid, tierIndex, false, method);
        totalTicketsSold++;
        tier.ticketsSold++;

        return (totalTicketsSold, totalEtherRevenue, totalTokenRevenue);
    }
}
