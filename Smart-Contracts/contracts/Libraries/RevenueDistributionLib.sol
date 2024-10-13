// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../TicketBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library RevenueDistributionLib {
    struct Stakeholder {
        uint share;
        uint amountReceived;
        bool isPaid;
    }

    function distributeRevenue(
        mapping(address => Stakeholder) storage stakeholders,
        mapping(uint => address) storage stakeholderAddresses,
        uint stakeholdersCount,
        uint totalRevenue,
        bool eventFinalized,
        TicketBase.PaymentMethod method,
        IERC20 token
    ) external returns (bool newEventFinalized) {
        require(totalRevenue > 0, "No revenue to distribute");
        require(!eventFinalized, "Event finalized");

        for (uint i = 0; i < stakeholdersCount; i++) {
            Stakeholder storage stakeholder = stakeholders[
                stakeholderAddresses[i]
            ];
            if (!stakeholder.isPaid) {
                uint payment = (totalRevenue * stakeholder.share) / 100;
                stakeholder.amountReceived += payment;

                if (method == TicketBase.PaymentMethod.Ether) {
                    (bool sent, ) = stakeholderAddresses[i].call{
                        value: payment
                    }("");
                    require(sent, "Ether transfer failed");
                } else {
                    require(
                        token.transfer(stakeholderAddresses[i], payment),
                        "Token transfer failed"
                    );
                }

                stakeholder.isPaid = true;
            }
        }

        return true;
    }
}
