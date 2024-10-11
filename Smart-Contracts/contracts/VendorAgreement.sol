// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./EventManagerFactory.sol";

contract VendorAgreement {

    struct Vendor {
        uint eventId;
        string vendorService;
        uint vendorPayment;
        bool confirmServiceDelivery;
        bool paid;
        bool vendorStatus;
    }

    address public organizer;
    uint public eventId;
    mapping(address => Vendor) public vendor;
        constructor(
        uint256 _eventId,
        EventManagerFactory.VendorInfo memory vendorInfo,
        address _organizer
    ) {
        eventId = _eventId;
        organizer = _organizer;
    }

    // Events
    event fundAgreementSuccessful(
        address indexed vendor,
        address indexed organizer,
        uint indexed amount
    );

    //Implement OnlyOrganizer Modifier
    modifier onlyOrganizer {
        require(msg.sender == organizer, "Only event organizer can perform this operation");
    }

    //The Organizer deposits money to the contract agreement which will be in escrow for payment when the agreement is fulfilled
    function fundAgreement(address vendorAddress) external payable {
        Vendor memory vendorDetails = vendor[vendorAddress]; 
        uint vendorPaymentAmount = vendorDetails.vendorPayment;
        // checks for vendor payment details
        require(vendorPaymentAmount > 0, "Vendor not found")

        (bool success,) = organizer.call{value: vendorPaymentAmount}("");
        require(success, "Could not fund for vendor services");

        emit fundAgreementSuccessful(vendorAddress, organizer, vendorPaymentAmount);
    }

    //Establishes agreements with vendors,detailing payment terms and service requirements.
    function createVendorAgreement() external payable {
        
    }

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
