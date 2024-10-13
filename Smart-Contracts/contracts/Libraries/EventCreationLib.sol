// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../Ticket.sol";
import "../Utils/Errors.sol";
import "../EventManagerFactory.sol";

library EventCreationLib {
    struct EventBasicDetails {
        bytes32 eventName;
        bytes32 imageHash;
        bytes32 venue;
        uint8 eventStartDate;
        uint8 eventEndDate;
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

    struct RevenueInfo {
        address[] stakeholders;
        uint8[] sharingPercentage;
    }

    function createEvent(
        uint16 eventCount,
        mapping(uint => EventManagerFactory.EventDetail) storage events,
        EventBasicDetails calldata eventBasicDetails,
        TicketInfo calldata ticketInfo,
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

        events[eventCount] = EventManagerFactory.EventDetail(
            eventCount,
            eventBasicDetails.imageHash,
            eventBasicDetails.eventName,
            eventBasicDetails.venue,
            eventBasicDetails.organizer,
            eventBasicDetails.eventStartDate,
            eventBasicDetails.eventEndDate,
            eventBasicDetails.totalTickets,
            ticketContract,
            address(0), // Sponsor contract will be added later
            address(0), // Vendor contract will be added later
            EventManagerFactory.EventStatus.Upcoming
        );

        return eventCount;
    }
}
