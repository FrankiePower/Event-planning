// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../Ticket.sol";
import "../Utils/Errors.sol";
import "../EventManagerFactory.sol";

library EventCreationLib {
    struct EventCreationParams {
        string eventName;
        string imageHash;
        string description;
        string venue;
        address organizer;
        uint8 eventStartDate;
        uint8 eventEndDate;
        uint16 totalTickets;
        address paymentTokenAddress;
    }

    enum EventStatus {
        Upcoming,
        Ongoing,
        Completed,
        Terminated
    }

    struct EventDetail {
        uint16 eventId;
        string imageHash;
        string eventName;
        string description;
        string venue;
        address organizer;
        uint8 eventStartDate;
        uint8 eventEndDate;
        uint16 totalTickets;
        address ticketContract;
        address sponsorContract;
        address vendorContract;
        EventStatus status;
        address paymentTokenAddress;
    }

    function createEvent(
        mapping(uint => EventDetail) storage events,
        uint16 eventId,
        EventCreationParams memory params
    ) external returns (uint16) {
        // Add any necessary validations here
        require(events[eventId].eventId != 0, "Invalid EventId");
        events[eventId] = EventDetail(
            eventId,
            params.imageHash,
            params.eventName,
            params.description,
            params.venue,
            params.organizer,
            params.eventStartDate,
            params.eventEndDate,
            params.totalTickets,
            address(0), // ticket contract will be added later
            address(0), // sponsor contract will be added later
            address(0), // vendor contract will be added later
            EventStatus.Upcoming,
            params.paymentTokenAddress
        );

        return eventId;
    }
}
