// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Utils/Helper.sol";

abstract contract EventManagement {
    uint32 public eventCount;

    enum EventStatus {
        Upcoming,
        Ongoing,
        Completed,
        Terminated
    }

    struct EventDetail {
        uint eventId;
        string imageHash;
        string eventName;
        string venue;
        address organizer;
        uint eventStartDate;
        uint eventEndDate;
        uint totalTickets;
        address ticketContract;
        address sponsorContract;
        address vendorContract;
        EventStatus status;
    }

    mapping(uint => EventDetail) public events;

    event EventCreated(uint eventId);
    event EventSetEventStatus(uint eventId);
    event EventRetrivedSuccessful(
        uint indexed eventId,
        string eventName,
        address indexed organizer
    );

    function createEventDetail(
        uint eventId,
        string memory imageHash,
        string memory eventName,
        string memory venue,
        address organizer,
        uint eventStartDate,
        uint eventEndDate,
        uint totalTickets,
        address ticketContract,
        address sponsorContract,
        address vendorContract
    ) internal {
        events[eventId] = EventDetail(
            eventId,
            imageHash,
            eventName,
            venue,
            organizer,
            eventStartDate,
            eventEndDate,
            totalTickets,
            ticketContract,
            sponsorContract,
            vendorContract,
            EventStatus.Upcoming
        );

        emit EventCreated(eventId);
    }

    // Helper function to update event status
    function setEventStatusInternal(
        uint _eventId,
        EventStatus _status
    ) internal {
        events[_eventId].status = _status;
        emit EventSetEventStatus(_eventId);
    }

    // Helper function to validate if event exists
    function eventExists(uint eventId) internal view {
        require(
            events[eventId].eventId != 0,
            "Invalid EventID: Event does not exist"
        );
    }

    // Abstract function that needs to be implemented in derived contracts
    function isValidEventStatus(
        EventStatus _status
    ) internal pure virtual returns (bool);

    // Utility function to get event contracts
    function getEventContracts(
        uint eventId
    ) external returns (EventDetail memory) {
        eventExists(eventId);
        EventDetail storage ev = events[eventId];
        emit EventRetrivedSuccessful(eventId, ev.eventName, ev.organizer);
        return events[eventId];
    }
}
