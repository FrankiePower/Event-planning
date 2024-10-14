// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Ticket.sol";
import "./VendorAgreement.sol";
import "./SponsorAgreement.sol";
import {Error} from "./Utils/Errors.sol";
import "./Libraries/EventCreationLib.sol";
import "./Libraries/VendorAgreementLib.sol";
import "./Libraries/SponsorAgreementLib.sol";
import "./Libraries/TicketLib.sol";

contract EventManagerFactory {
    using EventCreationLib for *;
    using VendorAgreementLib for *;
    using SponsorAgreementLib for *;

    uint16 public eventCount;

    mapping(uint => EventCreationLib.EventDetail) public events;

    event EventCreated(uint indexed eventId);
    event EventStatusUpdated(
        uint indexed eventId,
        EventCreationLib.EventStatus status
    );
    event AddTicketToEvent(
        uint16 eventId,
        address _organizer,
        uint16 _totalTickets
    );

    function createEvent(
        EventCreationLib.EventCreationParams memory params
    ) external returns (uint16) {
        eventCount++;
        eventCount = events.createEvent(eventCount, params);

        emit EventCreated(eventCount);
        return eventCount;
    }

    function addVendorAgreement(
        uint16 _eventId,
        // VendorAgreementLib.VendorInfo calldata vendorInfo,
        address VendorAgreementArbitrator
    ) external {
        VendorAgreementLib.addVendorAgreement(
            _eventId,
            events,
            // vendorInfo,
            VendorAgreementArbitrator,
            msg.sender
        );
        emit EventCreated(_eventId);
    }

    function addTicketToEvent(
        uint16 _eventId,
        address _organizer,
        uint16 _totalTickets,
        address _paymentTokenAddress
    ) external {
        TicketLib.addTicketToEvent(
            events,
            _eventId,
            _organizer,
            _totalTickets,
            _paymentTokenAddress
        );
        emit AddTicketToEvent(_eventId, _organizer, _totalTickets);
    }

    function addSponsorAgreement(
        uint16 _eventId // SponsorAgreementLib.SponsorInfo calldata sponsorInfo
    ) external {
        SponsorAgreementLib.addSponsorAgreement(
            _eventId,
            events,
            // sponsorInfo,
            msg.sender
        );
    }

    function setEventStatus(
        uint _eventId,
        EventCreationLib.EventStatus _status
    ) external {
        require(events[_eventId].eventId != 0, "Invalid EventID");

        EventCreationLib.EventDetail storage ev = events[_eventId];
        require(ev.organizer == msg.sender, "Not authorized");

        ev.status = _status;
        emit EventStatusUpdated(_eventId, _status);
    }

    // Fetch event details
    function getEventDetails(
        uint _eventId
    ) external view returns (EventCreationLib.EventDetail memory) {
        require(events[_eventId].eventId != 0, "Invalid EventID");
        return events[_eventId];
    }
}
