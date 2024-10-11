// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./EventManagerFactory.sol";
import "./Utils/Errors.sol";

contract VendorAgreement {

    struct Vendor {
        uint event_Id;
        string vendorService;
        uint vendorPayment;
        bool confirmServiceDelivery;
        bool paid;
        bool isActive;
        bool isTerminated;
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

    event VendorCreatedSuccessfully(
        address indexed vendorAddress,
        uint indexed eventId
    );

    event ServiceDeliveryConfirmed(
        address indexed vendorAddress,
        address indexed organizer
    );

    event VendorPaidSuccessfully(
        address indexed vendorAddress,
        uint indexed payment
    );

    event VendorAgreementTerminated(
        address indexed vendorAddress,
        uint eventId
    );

    //Implement OnlyOrganizer Modifier
    modifier onlyOrganizer {
        require(msg.sender == organizer, "Only event organizer can perform this operation");
        _;
    }

    //The Organizer deposits money to the contract agreement which will be in escrow for payment when the agreement is fulfilled
    function fundAgreement(address vendorAddress) external payable {
        Vendor memory vendorDetails = vendor[vendorAddress]; 
        // check if vendor contract has been terminated before sending funds
        require(vendorDetails.isTerminated == false, "Vendor contract has been terminated");
        uint vendorPaymentAmount = vendorDetails.vendorPayment;
        // checks for vendor payment details
        require(vendorPaymentAmount > 0, "Vendor not found");

        (bool success, ) = organizer.call{value: vendorPaymentAmount}("");
        require(success, "Could not fund for vendor services");

        emit fundAgreementSuccessful(vendorAddress, organizer, vendorPaymentAmount);
    }

    //Establishes agreements with vendors,detailing payment terms and service requirements.
    function createVendorAgreement(
        string memory _vendorService,
        uint _vendorPayment,
        address _vendorAddress
    ) external payable {
        if(_vendorPayment <= 0) {
            revert Error.InvalidVendorPayment();
        }

        Vendor memory vendorDetails = Vendor(
             eventId,
            _vendorService,
            _vendorPayment,
            false,
            false,
            true,
            false
        );

        vendor[_vendorAddress] = vendorDetails; 

        emit VendorCreatedSuccessfully(_vendorAddress, eventId);
    }

    function confirmServiceDelivered(address _vendorAddress) external onlyOrganizer {
        //This function should have onlyOrganizer Modifier.
        require(_vendorAddress != address(0), "Invalid vendor address");

        vendor[_vendorAddress].confirmServiceDelivery = true;

        emit ServiceDeliveryConfirmed(_vendorAddress, organizer);
    }

    function releasePayment(address _vendorAddress) external {
        //The payment is released only if the confirmServiceDelivered function has been called and the service is confirmed.
        require(_vendorAddress != address(0), "Invalid vendor address");

        Vendor memory vendorDetails = vendor[_vendorAddress];

        require(vendorDetails.confirmServiceDelivery, "Confirm service delivery first");
        require(vendorDetails.isTerminated == false, "Vendor contract has been terminated");

        uint vendorPaymentAmount = vendorDetails.vendorPayment;

        // avoid multiple disbursement of funds to same vendor
        require(vendorDetails.paid == false, "Cannot disburse funds to vendor twice");

        vendorDetails.paid = true;
        (bool success, ) = _vendorAddress.call{ value: vendorPaymentAmount }("");
        require(success, "Could not release vendor payment");

        emit VendorPaidSuccessfully(_vendorAddress, vendorPaymentAmount);


    }

    function resolveDispute(bool decisionForVendor) external {
        //Implement onlyArbitrator modifier for dispute
    }

    function terminateAgreement(address _vendorAddress) external onlyOrganizer {
        //onlyOrganizer Implementation
        //Only Organizer terminates contract and the organizer money is refunded automatically.
        require(_vendorAddress != address(0), "Invalid address");

        vendor[_vendorAddress].isTerminated = true;

        emit VendorAgreementTerminated(_vendorAddress, eventId);
    }

    function getVendorDetails()
        external
        view
        returns (address, uint256, string memory, bool)
    {}
}
