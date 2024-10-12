// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VendorAgreement is ReentrancyGuard {
    // State variables
    address public organizer;
    address public vendor;
    address public arbitrator;
    uint256 public totalPaymentRequired;
    bool public agreementFunded;
    address public escrowAddress;

    mapping(address => bool) public isVendor;
    mapping(address => uint256) public vendorPayments;
    mapping(address => string) public vendorServices;
    mapping(address => bool) public serviceDelivered;

    address[] public vendorList;

    enum AgreementStatus {
        NotCreated,
        Pending,
        Active,
        Completed,
        Disputed,
        Terminated
    }

    AgreementStatus public status;

    // Events
    event AgreementCreated(address[] vendors, uint256 totalPayment);
    event AgreementFunded(uint256 amount);
    event ServiceDelivered(address vendor);
    event PaymentReleased(address vendor, uint256 amount);
    event DisputeResolved(address vendor, bool decisionForVendor);
    event AgreementTerminated();

    // Modifiers
    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can call this function");
        _;
    }

    modifier onlyVendor() {
        require(isVendor[msg.sender], "Only vendors can call this function");
        _;
    }

    modifier onlyArbitrator() {
        require(msg.sender == arbitrator, "Only arbitrator can call this function");
        _;
    }

    modifier requireStatus(AgreementStatus _status) {
        require(status == _status, "Invalid agreement status for this operation");
        _;
    }

    constructor(address _organizer, address _vendor, address _arbitrator) {
        require(_organizer != address(0), "Invalid organizer address");
        require(_vendor != address(0), "Invalid vendors address");
        require(_arbitrator != address(0), "Invalid arbitrator address");
        organizer = _organizer;
        vendor = _vendor;
        arbitrator = _arbitrator;
        status = AgreementStatus.NotCreated;
    }

    function createVendorAgreement(
        address[] memory _vendors,
        uint256[] memory _vendorPayments,
        string[] memory _vendorServices
    ) external onlyOrganizer requireStatus(AgreementStatus.NotCreated) {
        require(_vendors.length == _vendorPayments.length && _vendors.length == _vendorServices.length, "Arrays must have the same length");
        
        for (uint256 i = 0; i < _vendors.length; i++) {
            require(_vendors[i] != address(0), "Invalid vendor address");
            require(_vendorPayments[i] > 0, "Vendor payment must be greater than 0");
            require(bytes(_vendorServices[i]).length > 0, "Vendor service description cannot be empty");

            isVendor[_vendors[i]] = true;
            vendorList.push(_vendors[i]);
            vendorPayments[_vendors[i]] = _vendorPayments[i];
            vendorServices[_vendors[i]] = _vendorServices[i];
            serviceDelivered[_vendors[i]] = false;

            totalPaymentRequired += _vendorPayments[i];
        }

        status = AgreementStatus.Pending;
        emit AgreementCreated(_vendors, totalPaymentRequired);
    }

    

    //Establishes agreements with vendors,detailing payment terms and service requirements.
    

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