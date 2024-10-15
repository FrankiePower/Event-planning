// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    struct Event {
        address organizer;
        string name;
        string description;
        string venue;
        string image;
        uint256 startDate;
        uint256 endDate;
        uint16 totalTicketAvailable;
        EventStatus status;
    }

    struct TicketTier {
        string tierName;
        uint256 price;
        uint16 totalTicketAvailable;
        string ticketURI;
    }

    struct Ticket {
        uint256 ticketId;
        uint16 ticketTierId;
        uint16 eventId;
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

    mapping(uint16 => Event) events;
    mapping(uint16 => TicketTier) ticketTierIdToTicket;
    mapping(uint16 => address) attendee; //Ticket Tier ID to User.
    mapping(uint256 => Ticket) tickets; //TicketID to Ticket Struct

    mapping(address => Vendor) vendors; //Vendor ID to Vendor
    mapping(uint16 => uint16[]) eventVendors; //EventID to Vendors

    uint16 public eventCount;
    uint16 public ticketTierCount;
    uint16 public totalTicketTierSize;
    uint256 public nextTicketId = 1; // To generate unique ticket IDs
    uint16 public vendorCount;
    address public organizer;

    IERC20 public token;

    event EventCreated(uint16 indexed eventId);
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
        token = IERC20(_tokenAddress);
        organizer = _organizer;
        createEvent(
            _name,
            _description,
            _venue,
            _image,
            _startDate,
            _endDate,
            _totalTicketAvailable
        );
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer");
        _;
    }

    function createEvent(
        string memory _name,
        string memory _description,
        string memory _venue,
        string memory _image,
        uint256 _startDate,
        uint256 _endDate,
        uint16 _totalTicketAvailable
    ) internal {
        require(bytes(_name).length > 0, "Enter Event Name");
        require(bytes(_description).length > 0, "Enter Event Description");
        require(bytes(_venue).length > 0, "Enter Event Venue");
        require(bytes(_image).length > 0, "Enter Event Image");
        require(_startDate > 0, "Enter a valid Start Date");
        require(_endDate > 0, "Enter a valid End Date");
        require(
            _startDate <= _endDate,
            "Start Date must be before or equal to End Date"
        );
        uint16 _eventId = eventCount + 1;

        Event storage ev = events[_eventId];
        ev.organizer = msg.sender;
        ev.name = _name;
        ev.description = _description;
        ev.venue = _venue;
        ev.image = _image;
        ev.startDate = _startDate;
        ev.endDate = _endDate;
        ev.status = EventStatus.Upcoming;
        ev.totalTicketAvailable = _totalTicketAvailable;

        eventCount++;

        emit EventCreated(eventCount);
    }

    function addTicketTier(
        string memory _ticketName,
        uint256 _ticketPrice,
        uint16 _totalTicketAvailable,
        string memory _ticketURI
    ) external onlyOrganizer {
        require(bytes(_ticketName).length > 0, "Ticket name is required");
        require(_ticketPrice >= 0, "Invalid Ticket Price");
        require(
            _totalTicketAvailable > 0,
            "Total tickets available must be greater than 0"
        );
        require(bytes(_ticketURI).length > 0, "Ticket URI is required");
        //get allocated Ticket Size
        uint16 newTicketSize = totalTicketTierSize + _totalTicketAvailable;
        require(
            newTicketSize <= events[eventCount].totalTicketAvailable,
            "Max event size exceeded"
        );

        totalTicketTierSize = newTicketSize;

        uint16 _ticketTierCount = ticketTierCount + 1;
        TicketTier storage tier = ticketTierIdToTicket[_ticketTierCount];
        tier.tierName = _ticketName;
        tier.price = _ticketPrice;
        tier.ticketURI = _ticketURI;
        tier.totalTicketAvailable = _totalTicketAvailable;
        ticketTierCount++;

        emit TicketTierAdded(
            _ticketTierCount,
            _ticketPrice,
            _totalTicketAvailable
        );
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
        tk.eventId = eventCount;
        tk.ticketId = ticketId;
        tk.ticketTierId = _tierId;
        tk.amountPaid = ticketCost;
        tk.isRefund = false;

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
        emit TickeValidated(
            _ticketId,
            ticketTierIdToTicket[tick.ticketTierId].tierName,
            msg.sender
        );
        return (_ticketId, ticketTierIdToTicket[tick.ticketTierId].tierName);
    }

    function claimRefund(uint256 _ticketId) external {
        //Check if event is terminated
        require(
            events[eventCount].status == EventStatus.Terminated,
            "Event is still on-going."
        );
        //Check if user has claimed refund,
        Ticket memory tick = tickets[_ticketId];
        require(tick.buyer == msg.sender, "Not owner of ticket");
        require(!tick.isRefund, "Token refunded");
        //Refund Logic
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
        require(bytes(_name).length > 0, "Vendor name is empty");
        require(bytes(_vendorImg).length > 0, "Vendor image is empty");
        require(
            bytes(_vendorService).length > 0,
            "Vendor service description is empty"
        );
        require(
            _paymentAmount >= 0,
            "Payment amount must be greater than zero"
        );

        uint16 _vendorId = vendorCount + 1;
        Vendor storage ven = vendors[_vendorAddress];
        ven.vendorId = _vendorId;
        ven.name = _name;
        ven.vendorImg = _vendorImg;
        ven.vendorService = _vendorService;
        ven.paymentAmount = _paymentAmount;
        ven.vendorAddress = _vendorAddress;
        ven.status = VendorStatus.active;

        eventVendors[eventCount].push(_vendorId);
        vendorCount++;

        emit VendorAdded(_vendorAddress, _paymentAmount);
    }

    function comfirmVendorServiceDelivery(
        address _vendorAddress
    ) external onlyOrganizer {
        require(vendors[_vendorAddress].vendorId != 0, "Vendor Not Found");
        Vendor storage ven = vendors[_vendorAddress];
        require(ven.status != VendorStatus.terminated, "Venodr Terminated");
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
        Vendor storage ven = vendors[_vendorAddress];
        require(!ven.isPaid, "Vendor ALready Paid.");
        require(!ven.serviceDelivered, "Venodr Service Confirmed.");
        ven.status = VendorStatus.terminated;
        emit VendorTerminated(ven.vendorId);
    }

    //Sponsor
    // function addSponsor(address sponsorAddress) external {}
}
