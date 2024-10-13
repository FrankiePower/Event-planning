// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Ticket.sol";
import "./VendorAgreement.sol";
import "./SponsorAgreement.sol";
import {Error} from "./Utils/Errors.sol";
import "./Libraries/EventCreationLib.sol";
import "./Libraries/VendorAgreementLib.sol";
import "./Libraries/SponsorAgreementLib.sol";

contract EventManagerFactory {
    using EventCreationLib for *;
    using VendorAgreementLib for *;
    using SponsorAgreementLib for *;

    uint16 public eventCount;

    enum EventStatus {
        Upcoming,
        Ongoing,
        Completed,
        Terminated
    }

    struct EventDetail {
        uint16 eventId;
        bytes32 imageHash;
        bytes32 eventName;
        bytes32 venue;
        address organizer;
        uint8 eventStartDate;
        uint8 eventEndDate;
        uint16 totalTickets;
        address ticketContract;
        address sponsorContract;
        address vendorContract;
        EventStatus status;
    }

    mapping(uint => EventDetail) public events;

    event EventCreated(uint indexed eventId);
    event EventStatusUpdated(uint indexed eventId, EventStatus status);

    function createEvent(
        EventCreationLib.EventBasicDetails calldata eventBasicDetails,
        EventCreationLib.TicketInfo calldata ticketInfo,
        EventCreationLib.RevenueInfo calldata revenueInfo,
        address paymentTokenAddress
    ) external returns (uint16) {
        eventCount = EventCreationLib.createEvent(
            eventCount,
            events,
            eventBasicDetails,
            ticketInfo,
            revenueInfo,
            paymentTokenAddress
        );

        emit EventCreated(eventCount);
        return eventCount;
    }

    function addVendorAgreement(
        uint16 _eventId,
        VendorAgreementLib.VendorInfo calldata vendorInfo,
        address VendorAgreementArbitrator
    ) external {
        VendorAgreementLib.addVendorAgreement(
            _eventId,
            events,
            vendorInfo,
            VendorAgreementArbitrator,
            msg.sender
        );
    }

    function addSponsorAgreement(
        uint16 _eventId,
        SponsorAgreementLib.SponsorInfo calldata sponsorInfo
    ) external {
        SponsorAgreementLib.addSponsorAgreement(
            _eventId,
            events,
            sponsorInfo,
            msg.sender
        );
    }

    function setEventStatus(uint _eventId, EventStatus _status) external {
        require(events[_eventId].eventId != 0, "Invalid EventID");

        EventDetail storage ev = events[_eventId];
        require(ev.organizer == msg.sender, "Not authorized");

        ev.status = _status;
        emit EventStatusUpdated(_eventId, _status);
    }

    function getEventDetails(
        uint _eventId
    ) external view returns (EventDetail memory) {
        require(events[_eventId].eventId != 0, "Invalid EventID");
        return events[_eventId];
    }
}
