// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./EventManagerFactory.sol";

contract VendorAgreement {
    constructor(
        uint256 eventId,
        EventManagerFactory.VendorInfo memory vendorInfo,
        address _organizer
    ) {}

    //Implement OnlyOrganizer Modifier

    //The Organizer deposits money to the contract agreement which will be in escrow for payment when the agreement is fulfilled
    function fundAgreement() external payable {}

    //Establishes agreements with vendors,detailing payment terms and service requirements.
    function createVendorAgreement() external payable {}

    function confirmServiceDelivered() external {
        //This function should have onlyOrganizer Modifier.
    }

    function releasePayment() external {
        //The payment is released only if the confirmServiceDelivered function has been called and the service is confirmed.
    }

    function resolveDispute(bool decisionForVendor) external {
        //Implement onlyArbitrator modifier for dispute
    }

    function terminateAgreement() external {
        //onlyOrganizer Implementation
        //Only Organizer terminates contract and the organizer money is refunded automatically.
    }

    function getVendorDetails()
        external
        view
        returns (address, uint256, string memory, bool)
    {}
}
