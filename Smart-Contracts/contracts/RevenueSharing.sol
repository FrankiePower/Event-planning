// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.21;

import "./EventManagerFactory.sol";

contract RevenueSharing {
    constructor(EventManagerFactory.RevenueInfo memory revenueInfo, address organizer) {}

    function distributeRevenue(uint256 totalRevenue) external {
        //onlyOrganizer
    }

    function getStakeholderDetails(
        address stakeholder
    )
        public
        view
        returns (uint256 share, uint256 amountReceived, bool isPaid)
    {}

    function finalizeEvent() external {
        // onlyOrganizer
    }
}
