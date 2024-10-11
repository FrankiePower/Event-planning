// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.21;

contract RevenueSharing {
    constructor() {}

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
