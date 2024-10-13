// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Ticket.sol";
import "./VendorAgreement.sol";
import "./SponsorAgreement.sol";
// import "./RevenueSharing.sol";
import {Error} from "./Utils/Errors.sol";

contract EventManagerFactory {
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
        uint32 eventStartDate;
        uint32 eventEndDate;
        uint16 totalTickets;
        address ticketContract;
        address sponsorContract;
        address vendorContract;
        EventStatus status;
    }

    struct EventBasicDetails {
        bytes32 eventName;
        bytes32 imageHash;
        bytes32 venue;
        uint32 eventStartDate;
        uint32 eventEndDate;
        uint16 totalTickets;
        address organizer;
        address VendorAgreementArbitrator;
    }

    struct TicketInfo {
        bytes32[] tierNames;
        uint[] tierPrices;
        uint16[] tierAvailability;
        bytes32[] ticketTierIpfshash;
    }

    struct VendorInfo {
        address[] vendors;
        uint[] vendorPayments;
        bytes32[] vendorServices;
    }

    struct SponsorInfo {
        address[] sponsors;
        uint[] sponsorContributions;
        uint8[] sponsorRevenueShares;
    }

    struct RevenueInfo {
        address[] stakeholders;
        uint8[] sharingPercentage;
    }

    mapping(uint => EventDetail) public events;

    event EventCreated(uint indexed eventId);
    event EventStatusUpdated(uint indexed eventId, EventStatus status);

    function createEvent(
        EventBasicDetails calldata eventBasicDetails, // calldata to save gas
        TicketInfo calldata ticketInfo,
        VendorInfo calldata vendorInfo,
        SponsorInfo calldata sponsorInfo,
        RevenueInfo calldata revenueInfo,
        address paymentTokenAddress
    ) external returns (uint16) {
        if (eventBasicDetails.organizer == address(0)) {
            revert Error.ZeroAddressDetected();
        }
        if (paymentTokenAddress == address(0)) {
            revert Error.ZeroAddressDetected();
        }
        if (eventBasicDetails.totalTickets <= 0) {
            revert Error.TicketMustBeGreaterThanZero();
        }
        require(
            eventBasicDetails.eventStartDate <= eventBasicDetails.eventEndDate,
            "Invalid event dates"
        );
        require(ticketInfo.tierNames.length > 0, "Invalid ticket tiers");

        eventCount++;

        address ticketContract = address(
            new Ticket(
                eventCount,
                eventBasicDetails.totalTickets,
                ticketInfo,
                revenueInfo,
                eventBasicDetails.organizer,
                paymentTokenAddress
            )
        );

        address vendorAgreementContract = address(
            new VendorAgreement(
                eventCount,
                vendorInfo,
                eventBasicDetails.organizer,
                eventBasicDetails.VendorAgreementArbitrator
            )
        );

        address sponsorAgreementContract = address(
            new SponsorAgreement(
                sponsorInfo,
                eventCount,
                eventBasicDetails.organizer
            )
        );

        events[eventCount] = EventDetail(
            eventCount,
            eventBasicDetails.imageHash,
            eventBasicDetails.eventName,
            eventBasicDetails.venue,
            eventBasicDetails.organizer,
            eventBasicDetails.eventStartDate,
            eventBasicDetails.eventEndDate,
            eventBasicDetails.totalTickets,
            ticketContract,
            sponsorAgreementContract,
            vendorAgreementContract,
            EventStatus.Upcoming
        );

        emit EventCreated(eventCount);
        return eventCount;
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

    // Removed isEmptyString and isValidStatus as we're using direct validation
}
