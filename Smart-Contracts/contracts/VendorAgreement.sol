// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract VendorAgreement {
    address public organizer;
    address public arbitrator;
    bool public serviceDelivered;
    bool public agreementTerminated;

    struct Vendor {
        address vendorAddress;
        uint256 payment;
        string service;
        bool isPaid;
    }

    mapping(address => Vendor) public vendors;
    address[] public vendorAddresses;

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can call this function.");
        _;
    }

    modifier onlyArbitrator() {
        require(msg.sender == arbitrator, "Only arbitrator can call this function.");
        _;
    }

    constructor(
        address[] memory _vendors,
        uint256[] memory _vendorPayments,
        string[] memory _vendorServices,
        address _organizer, // The address of the event organizer.
        address _arbitrator // The address of the arbitrator for resolving disputes.
    ) {
        require(_vendors.length == _vendorPayments.length && _vendors.length == _vendorServices.length, "Invalid input data.");
        organizer = _organizer;
        arbitrator = _arbitrator;
        for (uint256 i = 0; i < _vendors.length; i++) {
            vendors[_vendors[i]] = Vendor({
                vendorAddress: _vendors[i],
                payment: _vendorPayments[i],
                service: _vendorServices[i],
                isPaid: false
            });
            vendorAddresses.push(_vendors[i]);
        }
    }

    // Organizer deposits funds into escrow for payment to vendors
    function fundAgreement() external payable onlyOrganizer {
        require(msg.value > 0, "Must deposit funds.");
    }

    // Establishes agreements with vendors, detailing payment terms and service requirements
    function createVendorAgreement() external onlyOrganizer {}

    // Organizer confirms that the service was delivered
    function confirmServiceDelivered() external onlyOrganizer {
        serviceDelivered = true;
    }

    // Payment is released to the vendors only if service has been confirmed
    function releasePayment() external onlyOrganizer {
        require(serviceDelivered, "Service not confirmed.");
        for (uint256 i = 0; i < vendorAddresses.length; i++) {
            Vendor storage vendor = vendors[vendorAddresses[i]];
            if (!vendor.isPaid) {
                payable(vendor.vendorAddress).transfer(vendor.payment);
                vendor.isPaid = true;
            }
        }
    }

    // Resolve disputes by the arbitrator. If decisionForVendor is true, vendor is paid, otherwise the funds are returned to the organizer
    function resolveDispute(bool decisionForVendor) external onlyArbitrator {
        if (decisionForVendor) {
            for (uint256 i = 0; i < vendorAddresses.length; i++) {
                Vendor storage vendor = vendors[vendorAddresses[i]];
                if (!vendor.isPaid) {
                    payable(vendor.vendorAddress).transfer(vendor.payment);
                    vendor.isPaid = true;
                }
            }
        } else {
            // Refund remaining funds to the organizer
            payable(organizer).transfer(address(this).balance);
        }
    }

    // Terminate the agreement and refund the remaining balance to the organizer
    function terminateAgreement() external onlyOrganizer {
        require(!serviceDelivered, "Cannot terminate after service is delivered.");
        agreementTerminated = true;
        payable(organizer).transfer(address(this).balance);
    }

    // Retrieve vendor details
    function getVendorDetails(address _vendor)
        external
        view
        returns (address, uint256, string memory, bool)
    {
        Vendor memory vendor = vendors[_vendor];
        return (
            vendor.vendorAddress,
            vendor.payment,
            vendor.service,
            vendor.isPaid
        );
    }
}
