// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Ticket.sol";
import "./VendorAgreement.sol";
import "./SponsorAgreement.sol";
import "./RevenueSharing.sol";
import {Error} from "./Utils/Errors.sol";

contract EventManagerFactory {
    uint256 public eventCount;

    struct EventDetail {
        uint256 eventId;
        string imageHash;
        string eventName;
        string venue;
        address organizer;
        uint256 eventStartDate;
        uint256 eventEndDate;
        uint256 totalTickets;
        address ticketContract;
        address sponsorContract;
        address vendorContract;
        address revenueSharingContract;
    }

    struct EventBasicDetails {
        string eventName;
        string imageHash;
        string venue;
        uint256 eventStartDate;
        uint256 eventEndDate;
        uint256 totalTickets;
        address organizer;
    }

    struct TicketInfo {
        string[] tierNames;
        uint256[] tierPrices;
        uint256[] tierAvailability;
        string[] ticketTierIpfshash;
    }

    struct VendorInfo {
        address[] vendors;
        uint256[] vendorPayments;
        string[] vendorServices;
    }

    struct SponsorInfo {
        address[] sponsors;
        uint256[] sponsorContributions;
        uint256[] sponsorRevenueShares;
    }

    struct RevenueInfo {
        address[] stakeholders;
        uint256[] sharingPercentage;
    }

    mapping(uint256 => EventDetail) public events;

    event EventCreated(uint256 eventId);
    event EventRetrivedSuccessful(
        uint256 indexed eventId,
        string eventName,
        address indexed organizer
    );

    function createEvent(
        EventBasicDetails memory eventBasicDetails,
        TicketInfo memory ticketInfo,
        VendorInfo memory vendorInfo,
        SponsorInfo memory sponsorInfo,
        RevenueInfo memory revenueInfo
    ) external returns (uint256 eventId) {
        if (msg.sender == address(0)) {
            revert Error.ZeroAddressDetected();
        }
        if (_isEmptyString(eventBasicDetails.venue)) {
            revert Error.InvalidVenueName();
        }
        if (_isEmptyString(eventBasicDetails.eventName)) {
            revert Error.InvalidEventName();
        }
        if (_isEmptyString(eventBasicDetails.imageHash)) {
            revert Error.InvalidIpfsHash();
        }
        if (eventBasicDetails.eventStartDate > eventBasicDetails.eventEndDate) {
            revert Error.InvalidStartDate();
        }
        if (eventBasicDetails.totalTickets <= 0) {
            revert Error.ZeroValueNotAllowed();
        }
        if (ticketInfo.tierNames.length < 1) {
            revert Error.InvalidTierNames();
        }
        if (ticketInfo.tierPrices.length < 1) {
            revert Error.InvalidTierPrices();
        }
        if (ticketInfo.tierAvailability.length < 1) {
            revert Error.InvalidTierAvailability();
        }
        if (eventBasicDetails.organizer == address(0)) {
            revert Error.ZeroAddressDetected();
        }

        eventCount++;

        // Deploy TicketSales contract with tier data
        address ticketContract = address(
            new Ticket(eventCount, eventBasicDetails.totalTickets, ticketInfo, eventBasicDetails.organizer)
        );

        address vendorAgreementContract = address(
            new VendorAgreement(eventCount, vendorInfo, eventBasicDetails.organizer)
        );

        address sponsorAgreementContract = address(
            new SponsorAgreement(sponsorInfo, eventBasicDetails.organizer)
        );

        address revenueSharingContract = address(
            new RevenueSharing(revenueInfo, eventBasicDetails.organizer)
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
            revenueSharingContract
        );

        emit EventCreated(eventCount);
        return eventCount;
    }

    function getEventContracts(
        uint256 eventId
    ) external returns (EventDetail memory) {
        EventDetail storage ev = events[eventId];
        emit EventRetrivedSuccessful(eventId, ev.eventName, ev.organizer);
        return events[eventId];
    }

    function _isEmptyString(string memory str) internal pure returns (bool) {
        return bytes(str).length == 0;
    }
}