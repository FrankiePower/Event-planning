// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
contract EventContract is ERC721URIStorage {
    enum EventStatus {
        Upcoming,
        Ongoing,
        Completed,
        Terminated
    }
    enum VendorStatus {
        active,
        terminated
    }
    struct TicketTier {
        string tierName;
        uint256 price;
        uint16 totalSold;
        uint16 totalTicketAvailable;
        string ticketURI;
    }

    struct Ticket {
        uint256 ticketId;
        uint16 ticketTierId;
        uint256 amountPaid;
        address buyer;
        bool isRefund;
    }

    struct Vendor {
        address vendorAddress;
        uint16 vendorId;
        string name;
        string vendorImg;
        string vendorService;
        uint256 paymentAmount;
        bool serviceDelivered;
        bool isPaid;
        VendorStatus status;
    }

    uint16 public ticketTierCount;
    uint256 public nextTicketId = 1; // To generate unique ticket IDs
    uint16 public vendorCount;
    address public organizer;

    string public eventName;
    string public eventDescription;
    string public eventVenue;
    string public eventImage;
    uint256 public startDate;
    uint256 public endDate;
    uint16 public totalTicketAvailable;
    EventStatus public status;

    mapping(uint16 => TicketTier) public ticketTierIdToTicket;
    mapping(uint16 => address) public attendee; //Ticket Tier ID to User.
    mapping(uint256 => Ticket) public tickets; //TicketID to Ticket Struct

    mapping(address => Vendor) public vendors; //Vendor Address to Vendor
    mapping(uint16 => Vendor) public eventVendors; //VendorID to Vendors

    IERC20 public token;

    event TicketTierAdded(
        uint16 tierId,
        uint256 price,
        uint16 totalTicketAvailable
    );

    event TicketBought(uint256 ticketId, address buyer);
    event TickeValidated(uint256 ticketId, string tierName, address buyer);
    event RefundClaimed(uint256 amount, address buyer);
    event VendorAdded(address vendor, uint256 amountPayable);
    event ApproveVendorAgreement(bool agreed);
    event VendorTerminated(uint16 eventId);
    event EventTerminated();
    constructor(
        address _organizer,
        address _tokenAddress,
        string memory _NftTokenName,
        string memory _NftSymbol,
        string memory _name,
        string memory _description,
        string memory _venue,
        string memory _image,
        uint256 _startDate,
        uint256 _endDate,
        uint16 _totalTicketAvailable
    ) ERC721(_NftTokenName, _NftSymbol) {
        require(bytes(_name).length > 0, "Enter Event Name");
        require(bytes(_NftTokenName).length > 0, "Enter NftTokenName ");
        require(bytes(_NftSymbol).length > 0, "Enter _NftSymbol");
        require(bytes(_description).length > 0, "Enter Event Description");
        require(bytes(_venue).length > 0, "Enter Event Venue");
        require(bytes(_image).length > 0, "Enter Event Image");
        require(_startDate > 0, "Enter a valid Start Date");
        require(_endDate > 0, "Enter a valid End Date");
        require(_startDate <= _endDate, "Invalid start and end date.");
        require(_totalTicketAvailable > 0, "Enter ticket available");

        token = IERC20(_tokenAddress);
        organizer = _organizer;
        eventName = _name;
        eventDescription = _description;
        eventVenue = _venue;
        eventImage = _image;
        startDate = _startDate;
        endDate = _endDate;
        totalTicketAvailable = _totalTicketAvailable;
        status = EventStatus.Upcoming;
        
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer");
        _;
    }

    function addTicketTier(
        string memory _ticketName,
        uint256 _ticketPrice,
        uint16 _totalTicketAvailable,
        string memory _ticketURI
    ) external onlyOrganizer {
        require(bytes(_ticketName).length > 0, "Ticket name is required");
        require(_ticketPrice >= 0, "Invalid Ticket Price");
        require(_totalTicketAvailable > 0, "Total tickets available must be greater than 0");
        require(bytes(_ticketURI).length > 0, "Ticket URI is required");

        uint16 availableTickets = ticketTierCount + _totalTicketAvailable;
        require(availableTickets <= totalTicketAvailable, "Exceeds total ticket limit");

        TicketTier storage tier = ticketTierIdToTicket[ticketTierCount + 1];
        tier.tierName = _ticketName;
        tier.price = _ticketPrice;
        tier.ticketURI = _ticketURI;
        tier.totalTicketAvailable = _totalTicketAvailable;

        ticketTierCount++;
        totalTicketAvailable -= _totalTicketAvailable;

        emit TicketTierAdded(ticketTierCount, _ticketPrice, _totalTicketAvailable);
    }

    function buyTicket(uint16 _tierId) external {
        require(msg.sender != address(0), "Invalid Address");
        require(
            bytes(ticketTierIdToTicket[_tierId].ticketURI).length > 0,
            "Invalid Tier ID"
        );

        TicketTier memory tier = ticketTierIdToTicket[_tierId];
        uint256 ticketCost = tier.price;
        require(
            token.balanceOf(msg.sender) >= ticketCost,
            "Insufficient token balance"
        );
        require(
            token.transferFrom(msg.sender, address(this), ticketCost),
            "Token transfer failed"
        );

        uint256 ticketId = nextTicketId;
        Ticket storage tk = tickets[ticketId];

        tk.buyer = msg.sender;
        tk.ticketId = ticketId;
        tk.ticketTierId = _tierId;
        tk.amountPaid = ticketCost;
        tk.isRefund = false;

        //Ticket Tier Update
        tier.totalSold++;
        

        nextTicketId++;

        _safeMint(msg.sender, ticketId);
        _setTokenURI(ticketId, tier.ticketURI);
        attendee[_tierId] = msg.sender;

        emit TicketBought(ticketId, msg.sender);
    }


    function validateTicket(
        uint256 _ticketId
    ) external returns (uint256, string memory) {
        require(tickets[_ticketId].ticketId != 0, "Invalid Ticket ID");
        require(ownerOf(_ticketId) == msg.sender, "Address does not have NFT.");
        Ticket memory tick = tickets[_ticketId];
        require(tick.isRefund == false, "Ticket Refunded");
        emit TickeValidated(
            _ticketId,
            ticketTierIdToTicket[tick.ticketTierId].tierName,
            msg.sender
        );
        return (_ticketId, ticketTierIdToTicket[tick.ticketTierId].tierName);
    }

    function claimRefund(uint256 _ticketId) external {
        //Check if event is terminated
        require(status == EventStatus.Terminated, "Event is still on-going.");
        //Check if user has claimed refund,
        Ticket storage tick = tickets[_ticketId];
        require(tick.buyer == msg.sender, "Not owner of ticket");
        require(!tick.isRefund, "Token refunded");
        //Refund Logic
        tick.isRefund = true;
        uint256 amount = tick.amountPaid;
        require(token.transfer(msg.sender, amount), "Token refund failed");
        // Burn the NFT (take it back)
        _burn(_ticketId);
        emit RefundClaimed(amount, msg.sender);
    }

    //Vendor Agreement contract here.
    function addVendor(
        address _vendorAddress,
        string memory _name,
        string memory _vendorImg,
        string memory _vendorService,
        uint256 _paymentAmount
    ) external onlyOrganizer {
        require(_vendorAddress != address(0), "Invalid Vendor Address");
        require(bytes(_name).length > 0, "Vendor name is empty");
        require(bytes(_vendorImg).length > 0, "Vendor image is empty");
        require(
            bytes(_vendorService).length > 0,
            "Service description is empty"
        );
        require(
            _paymentAmount >= 0,
            "Payment amount must be greater than zero"
        );
        require(vendors[_vendorAddress].vendorId == 0, "Vendor already added");

        uint16 _vendorId = vendorCount + 1;
        Vendor storage ven = vendors[_vendorAddress];
        ven.vendorId = _vendorId;
        ven.name = _name;
        ven.vendorImg = _vendorImg;
        ven.vendorService = _vendorService;
        ven.paymentAmount = _paymentAmount;
        ven.vendorAddress = _vendorAddress;
        ven.status = VendorStatus.active;

        eventVendors[_vendorId] = ven;

        vendorCount++;

        emit VendorAdded(_vendorAddress, _paymentAmount);
    }

    function comfirmVendorServiceDelivery(
        address _vendorAddress
    ) external onlyOrganizer {
        require(vendors[_vendorAddress].vendorId != 0, "Vendor Not Found");
        Vendor storage ven = vendors[_vendorAddress];
        require(ven.status != VendorStatus.terminated, "Venodr Terminated");
        require(!ven.serviceDelivered, "Vendor Service Confirmed.");
        require(ven.isPaid == false, "Vendor Already Paid.");
        
        ven.serviceDelivered = true;
        ven.isPaid = true;
        //Pay Vendor if vendor needs to be paid;
        uint256 amountToPay = ven.paymentAmount;

        if (amountToPay > 0) {
            token.transfer(ven.vendorAddress, amountToPay);
        }
        
        emit ApproveVendorAgreement(true);
    }

    function terminateVendorAgreement(
        address _vendorAddress
    ) external onlyOrganizer {
        require(vendors[_vendorAddress].vendorId != 0, "Vendor Not Found");
        require(vendors[_vendorAddress].status != VendorStatus.terminated, "Vendor Agreement Terminated");
        require(vendors[_vendorAddress].isPaid == false, "Vendor Already Paid.");
        require(vendors[_vendorAddress].serviceDelivered == false, "Vendor Service Confirmed.");

        Vendor storage ven = vendors[_vendorAddress];
        ven.status = VendorStatus.terminated;

        emit VendorTerminated(ven.vendorId);
    }

    function terminateEvent() external onlyOrganizer {
        require(status != EventStatus.Terminated, "Event already terminated");
        status = EventStatus.Terminated;
        emit EventTerminated();
    }

    function updateEventStatus() external onlyOrganizer {
        if (block.timestamp >= startDate && block.timestamp <= endDate) {
            status = EventStatus.Ongoing;
        } else if (block.timestamp > endDate) {
            status = EventStatus.Completed;
        }
    }

}
