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
        bool disputeRaised; //Track dispute for vendor
    }

    address public organizer;
    uint public eventId;
    mapping(address => Vendor) public vendors;
    mapping(address => uint) public escrowBalance;

    uint public totalVendors;

    address public arbitrator;

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

    event DisputeRaised(
        address indexed vendorAddress,
        uint indexed eventId,
        address indexed raisedBy
    );

    event DisputeResolved(
        address indexed vendorAddress,
        bool decisionForVendor
    );

    constructor(
        uint _eventId,
        EventManagerFactory.VendorInfo memory vendorInfo,
        address _organizer,
        address _arbitrator
    ) {
        eventId = _eventId;
        organizer = _organizer;
        totalVendors = vendorInfo.vendors.length;
        arbitrator = _arbitrator;

        require(
            totalVendors == vendorInfo.vendorPayments.length,
            "Inconsistent vendor data"
        );
        require(
            totalVendors == vendorInfo.vendorServices.length,
            "Inconsistent vendor data"
        );
        //Optional incase the event organizer wants to add vendors upon creation
        // if (totalVendors > 0) {
        //     for (uint i = 0; i < totalVendors; i++) {
        //         address vendorAddress = vendorInfo.vendors[i];
        //         vendor[vendorAddress] = Vendor({
        //             event_Id: eventId,
        //             vendorService: vendorInfo.vendorServices[i],
        //             vendorPayment: vendorInfo.vendorPayments[i],
        //             confirmServiceDelivery: false,
        //             paid: false,
        //             isActive: true,
        //             isTerminated: false
        //         });
        //     }
        // }
    }

    //Implement OnlyOrganizer Modifier
    modifier onlyOrganizer() {
        require(
            msg.sender == organizer,
            "Only event organizer can perform this operation"
        );
        _;
    }

    modifier onlyArbitrator() {
        require(
            msg.sender == arbitrator,
            "Only arbitrator can perform this action"
        );
        _;
    }

    //Establishes agreements with vendors,detailing payment terms and service requirements.
    function createVendorAgreement(
        string memory _vendorService,
        uint _vendorPayment,
        address _vendorAddress
    ) external payable onlyOrganizer {
        if (_vendorPayment < 0) {
            revert Error.InvalidVendorPayment();
        }
        Vendor memory vendorDetails = Vendor(
            eventId,
            _vendorService,
            _vendorPayment,
            false,
            false,
            true,
            false,
            false
        );

        vendors[_vendorAddress] = vendorDetails;

        emit VendorCreatedSuccessfully(_vendorAddress, eventId);
    }

    // The Organizer deposits money to the contract agreement which will be in escrow for payment when the agreement is fulfilled
    function fundAgreement(
        address vendorAddress
    ) external payable onlyOrganizer {
        Vendor storage vendorDetails = vendors[vendorAddress];

        if (vendorDetails.isTerminated) {
            revert Error.VendorTerminated();
        }

        if (vendorDetails.event_Id == 0) {
            revert Error.VendorNotFound();
        }

        uint vendorPaymentAmount = vendorDetails.vendorPayment;
        if (msg.value != vendorPaymentAmount) {
            revert Error.InvalidPaymentAmount();
        }

        escrowBalance[vendorAddress] += msg.value;

        emit fundAgreementSuccessful(
            vendorAddress,
            organizer,
            vendorPaymentAmount
        );
    }

    function confirmServiceDelivered(
        address _vendorAddress
    ) external onlyOrganizer {
        //This function should have onlyOrganizer Modifier.
        require(_vendorAddress != address(0), "Invalid vendor address");
        require(
            vendors[_vendorAddress].isTerminated == false,
            "Vendor contract terminated"
        );

        vendors[_vendorAddress].confirmServiceDelivery = true;

        emit ServiceDeliveryConfirmed(_vendorAddress, organizer);
    }

    function releasePayment(address _vendorAddress) external onlyOrganizer {
        require(_vendorAddress != address(0), "Invalid vendor address");

        Vendor storage vendorDetails = vendors[_vendorAddress];
        if (!vendorDetails.confirmServiceDelivery) {
            revert Error.ConfirmVendorService();
        }
        if (vendorDetails.isTerminated) {
            revert Error.VendorTerminated();
        }

        uint vendorPaymentAmount = vendorDetails.vendorPayment;
        if (escrowBalance[_vendorAddress] < vendorPaymentAmount) {
            revert Error.InsufficientEscrowbalance();
        }
        // Avoid multiple disbursement of funds to the same vendor
        if (vendorDetails.paid) {
            revert Error.CannotDisburseFundsTwice();
        }

        vendorDetails.paid = true;
        escrowBalance[_vendorAddress] = 0; // reset the escrow balance

        (bool success, ) = _vendorAddress.call{value: vendorPaymentAmount}("");
        if (!success) {
            revert Error.VendorPaymentFailed();
        }

        emit VendorPaidSuccessfully(_vendorAddress, vendorPaymentAmount);
    }

    function raiseDispute(address _vendorAddress) external {
        require(_vendorAddress != address(0), "Invalid vendor address");

        Vendor storage vendorDetails = vendors[_vendorAddress];

        if (vendorDetails.isTerminated) {
            revert Error.VendorTerminated();
        }

        // Only the vendor or the organizer can raise a dispute
        if (msg.sender != _vendorAddress || msg.sender != organizer) {
            revert Error.OnlyVendorOrOrganizer();
        }

        if (vendorDetails.disputeRaised) {
            revert Error.DisputeALreadyRaised();
        }
        // Flag the dispute as raised
        vendorDetails.disputeRaised = true;

        emit DisputeRaised(_vendorAddress, eventId, msg.sender);
    }

    function resolveDispute(
        address _vendorAddress,
        bool decisionForVendor
    ) external onlyArbitrator {
        if (_vendorAddress != address(0)) {
            revert Error.ZeroAddressDetected();
        }
        Vendor storage vendorDetails = vendors[_vendorAddress];

        if (vendorDetails.isTerminated) {
            revert Error.VendorTerminated();
        }
        // Ensure that a dispute has been raised before resolving it
        if (!vendorDetails.disputeRaised) {
            revert Error.NoDisputeRaisedForVendor();
        }

        uint vendorPaymentAmount = escrowBalance[_vendorAddress];
        if (vendorPaymentAmount < 0) {
            revert Error.NoFundsToRelease();
        }

        // If the decision is in favor of the vendor, release the payment
        if (decisionForVendor) {
            vendorDetails.paid = true;
            escrowBalance[_vendorAddress] = 0;

            (bool success, ) = _vendorAddress.call{value: vendorPaymentAmount}(
                ""
            );
            if (!success) {
                revert Error.CouldNotReleaseVendorPayment();
            }
            emit VendorPaidSuccessfully(_vendorAddress, vendorPaymentAmount);
        } else {
            // Refund the organizer if the decision is not in favor of the vendor
            escrowBalance[_vendorAddress] = 0;

            (bool success, ) = organizer.call{value: vendorPaymentAmount}("");
            if (!success) {
                revert Error.CouldNotRefundOrganizer();
            }
            emit VendorAgreementTerminated(_vendorAddress, eventId);
        }

        // Mark the vendor agreement as terminated
        vendorDetails.isTerminated = true;
        vendorDetails.disputeRaised = false; // Reset the dispute flag

        emit DisputeResolved(_vendorAddress, decisionForVendor);
    }

    function terminateAgreement(address _vendorAddress) external onlyOrganizer {
        require(_vendorAddress != address(0), "Invalid address");

        Vendor storage vendorDetails = vendors[_vendorAddress];
        require(!vendorDetails.isTerminated, "Vendor already terminated");

        vendorDetails.isTerminated = true;

        uint vendorPaymentAmount = escrowBalance[_vendorAddress];
        require(vendorPaymentAmount > 0, "No funds to transfer");

        escrowBalance[_vendorAddress] = 0;

        (bool success, ) = organizer.call{value: vendorPaymentAmount}("");
        require(success, "Refund to organizer failed");

        emit VendorAgreementTerminated(_vendorAddress, eventId);
    }

    function getVendorDetails(
        address _vendorAddress
    ) external view returns (Vendor memory) {
        require(_vendorAddress != address(0), "Invalid vendor address");

        // Retrieve the vendor struct from the mapping
        Vendor memory vendorDetails = vendors[_vendorAddress];
        return vendorDetails;
    }
}
