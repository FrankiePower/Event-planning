// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Libraries/VendorAgreementLib.sol";
import "./Utils/Errors.sol";

library VendorLibrary {
    function validateAddress(address addr) internal pure {
        if (addr == address(0)) {
            revert Error.ZeroAddressDetected();
        }
    }

    function transferPayment(address payable recipient, uint amount) internal {
        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert Error.CouldNotReleaseVendorPayment();
        }
    }
}

contract VendorAgreement {
    struct Vendor {
        uint32 eventId;
        uint32 vendorPayment;
        string vendorServiceAgreement;
        bool confirmServiceDelivery;
        bool paid;
        bool isActive;
        bool isTerminated;
        bool disputeRaised;
    }

    address public organizer;
    uint32 public eventId;
    address public arbitrator;

    mapping(address => Vendor) public vendors;
    mapping(address => uint) public escrowBalance;

    event VendorCreated(address indexed vendor, uint indexed eventId);
    event VendorPaid(address indexed vendor, uint indexed payment);
    event ServiceDeliveryConfirmed(address indexed vendor);
    event VendorTerminated(address indexed vendor, uint indexed eventId);
    event DisputeResolved(address indexed vendor, bool decisionForVendor);

    constructor(
        uint32 _eventId,
        // VendorAgreementLib.VendorInfo memory vendorInfo,
        address _organizer,
        address _arbitrator
    ) {
        eventId = _eventId;
        organizer = _organizer;
        arbitrator = _arbitrator;

        // require(
        //     vendorInfo.vendors.length == vendorInfo.vendorPayments.length,
        //     "Vendor data mismatch"
        // );
        // for (uint i = 0; i < vendorInfo.vendors.length; i++) {
        //     vendors[vendorInfo.vendors[i]] = Vendor({
        //         eventId: _eventId,
        //         vendorPayment: uint32(vendorInfo.vendorPayments[i]),
        //         confirmServiceDelivery: false,
        //         paid: false,
        //         isActive: true,
        //         isTerminated: false,
        //         disputeRaised: false
        //     });
        //     emit VendorCreated(vendorInfo.vendors[i], _eventId);
        // }
    }

    // Private function to replace `onlyOrganizer` modifier
    function _onlyOrganizer() private view {
        require(msg.sender == organizer, "Only organizer");
    }

    // Private function to replace `onlyArbitrator` modifier
    function _onlyArbitrator() private view {
        require(msg.sender == arbitrator, "Only arbitrator");
    }

    function createVendorAgreement(
        uint32 _vendorPayment,
        string memory _vendorServiceAgreement,
        address _vendorAddress
    ) external {
        _onlyOrganizer();
        VendorLibrary.validateAddress(_vendorAddress);
        require(_vendorPayment > 0, "Invalid payment");

        vendors[_vendorAddress] = Vendor({
            eventId: eventId,
            vendorPayment: _vendorPayment,
            vendorServiceAgreement: _vendorServiceAgreement,
            confirmServiceDelivery: false,
            paid: false,
            isActive: true,
            isTerminated: false,
            disputeRaised: false
        });
        emit VendorCreated(_vendorAddress, eventId);
    }

    function fundAgreement(address vendorAddress) external payable {
        _onlyOrganizer();
        VendorLibrary.validateAddress(vendorAddress);

        Vendor storage vendor = vendors[vendorAddress];
        require(!vendor.isTerminated, "Terminated");
        require(msg.value == vendor.vendorPayment, "Invalid amount");

        escrowBalance[vendorAddress] += msg.value;
    }

    function confirmServiceDelivered(address vendorAddress) external {
        _onlyOrganizer();
        VendorLibrary.validateAddress(vendorAddress);

        Vendor storage vendor = vendors[vendorAddress];
        require(!vendor.isTerminated, "Terminated");

        vendor.confirmServiceDelivery = true;
        emit ServiceDeliveryConfirmed(vendorAddress);
    }

    function releasePayment(address vendorAddress) external {
        _onlyOrganizer();
        VendorLibrary.validateAddress(vendorAddress);

        Vendor storage vendor = vendors[vendorAddress];
        require(vendor.confirmServiceDelivery, "Service not confirmed");
        require(!vendor.paid, "Already paid");
        uint payment = escrowBalance[vendorAddress];
        require(payment > 0, "No funds");

        vendor.paid = true;
        escrowBalance[vendorAddress] = 0;
        VendorLibrary.transferPayment(payable(vendorAddress), payment);

        emit VendorPaid(vendorAddress, payment);
    }

    function raiseDispute(address vendorAddress) external {
        VendorLibrary.validateAddress(vendorAddress);

        Vendor storage vendor = vendors[vendorAddress];
        require(!vendor.isTerminated, "Terminated");
        require(
            msg.sender == vendorAddress || msg.sender == organizer,
            "Unauthorized"
        );
        require(!vendor.disputeRaised, "Already raised");

        vendor.disputeRaised = true;
    }

    function resolveDispute(
        address vendorAddress,
        bool decisionForVendor
    ) external {
        _onlyArbitrator();
        VendorLibrary.validateAddress(vendorAddress);

        Vendor storage vendor = vendors[vendorAddress];
        require(vendor.disputeRaised, "No dispute");
        uint payment = escrowBalance[vendorAddress];

        if (decisionForVendor) {
            vendor.paid = true;
            escrowBalance[vendorAddress] = 0;
            VendorLibrary.transferPayment(payable(vendorAddress), payment);
        } else {
            escrowBalance[vendorAddress] = 0;
            VendorLibrary.transferPayment(payable(organizer), payment);
        }

        vendor.isTerminated = true;
        vendor.disputeRaised = false;

        emit DisputeResolved(vendorAddress, decisionForVendor);
    }

    function terminateAgreement(address vendorAddress) external {
        _onlyOrganizer();
        VendorLibrary.validateAddress(vendorAddress);

        Vendor storage vendor = vendors[vendorAddress];
        require(!vendor.isTerminated, "Already terminated");

        uint refundAmount = escrowBalance[vendorAddress];
        require(refundAmount > 0, "No funds");

        vendor.isTerminated = true;
        escrowBalance[vendorAddress] = 0;
        VendorLibrary.transferPayment(payable(organizer), refundAmount);

        emit VendorTerminated(vendorAddress, eventId);
    }

    function getVendorDetails(
        address vendorAddress
    ) external view returns (Vendor memory) {
        VendorLibrary.validateAddress(vendorAddress);
        return vendors[vendorAddress];
    }
}
