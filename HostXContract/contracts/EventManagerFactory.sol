// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "./EventContract.sol";

contract EventManagerFactory {
    uint256 public eventCounter;
    EventContract[] Events;
    mapping(uint256 => EventContract) public IdToEvents;

    //Get Organizer Event
    mapping(address => EventContract[]) public organizerEvent;

    event EventCreated(
        address organizer,
        string name,
        string description,
        string venue,
        string image,
        uint256 startDate,
        uint256 endDate,
        uint16 totalTicketAvailable
    );

    function createEvent(
        // address _organizer,
        address paymentTokenAddress,
        string memory _NftTokenName,
        string memory _NftSymbol,
        string memory _name,
        string memory _description,
        string memory _venue,
        string memory _image,
        uint256 _startDate,
        uint256 _endDate,
        uint16 _totalTicketAvailable
    ) public returns (EventContract) {
        EventContract newEvent = new EventContract(
            msg.sender,
            paymentTokenAddress,
            _NftTokenName,
            _NftSymbol,
            _name,
            _description,
            _venue,
            _image,
            _startDate,
            _endDate,
            _totalTicketAvailable
        );

        eventCounter++;

        IdToEvents[eventCounter] = newEvent; //Holds clones of event contracts by Id
        Events.push(newEvent); // Holds all the event contracts
        organizerEvent[msg.sender].push(newEvent); //All event of an organizer

        emit EventCreated(
            msg.sender,
            _name,
            _description,
            _venue,
            _image,
            _startDate,
            _endDate,
            _totalTicketAvailable
        );

        return newEvent;
    }

    function getEvents() external view returns (EventContract[] memory) {
        return Events;
    }
}
