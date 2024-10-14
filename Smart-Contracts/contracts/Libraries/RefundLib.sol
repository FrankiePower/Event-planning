// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../TicketBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../Utils/Errors.sol";

library RefundLib {
    struct Attendee {
        uint amountPaid;
        bool hasClaimedRefund;
        TicketBase.PaymentMethod paidWith;
    }

    function claimRefund(
        mapping(address => Attendee) storage attendees,
        IERC20 token
    ) external {
        Attendee storage attendee = attendees[msg.sender];
        require(!attendee.hasClaimedRefund, "Refund already claimed");

        attendee.hasClaimedRefund = true;
        uint refundAmount = attendee.amountPaid;

        if (attendee.paidWith == TicketBase.PaymentMethod.Ether) {
            (bool sent, ) = msg.sender.call{value: refundAmount}("");
            require(sent, "Ether refund failed");
        } else {
            require(
                token.transfer(msg.sender, refundAmount),
                "Token refund failed"
            );
        }
    }
}
