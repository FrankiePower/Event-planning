// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

abstract contract TicketBase is ERC721 {
    address public organizer;
    bool public isEventTerminated;
    uint32 public eventId;
    uint public totalTickets;
    uint public totalTicketsSold;

    enum PaymentMethod {
        Ether,
        ERC20TOKEN
    }

    constructor(
        uint32 _eventId,
        uint _totalTickets,
        address _organizer
    ) ERC721("HostX", "HTX") {
        organizer = _organizer;
        eventId = _eventId;
        totalTickets = _totalTickets;
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer");
        _;
    }

    modifier eventTerminated() {
        require(isEventTerminated, "Event not terminated");
        _;
    }

    function terminateEvent() external onlyOrganizer {
        isEventTerminated = true;
    }
}
