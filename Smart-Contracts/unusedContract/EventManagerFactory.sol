// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Ticket.sol";
import "./VendorAgreement.sol";
import "./SponsorAgreement.sol";
// import "./RevenueSharing.sol";
import {Error} from "./Utils/Errors.sol";

contract EventManagerFactory {
    uint32 public eventCount;

    enum EventStatus {
        Upcoming, //Active ticket on sale
        Ongoing, //Live. Event is happening live
        Completed, //Concluded or Finished
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
        // address revenueSharingContract;
        EventStatus status;
    }

    struct EventBasicDetails {
        string eventName;
        string imageHash;
        string venue;
        uint eventStartDate;
        uint eventEndDate;
        uint totalTickets;
        address organizer;
        address VendorAgreementArbitrator;
    }

    struct TicketInfo {
        string[] tierNames;
        uint[] tierPrices;
        uint[] tierAvailability;
        string[] ticketTierIpfshash;
    }

    struct VendorInfo {
        address[] vendors;
        uint[] vendorPayments;
        string[] vendorServices;
    }

    struct SponsorInfo {
        address[] sponsors;
        uint[] sponsorContributions;
        uint[] sponsorRevenueShares;
    }

    struct RevenueInfo {
        address[] stakeholders;
        uint[] sharingPercentage;
    }

    mapping(uint => EventDetail) public events;

    event EventCreated(uint eventId);
    event EventSetEventStatus(uint eventId);
    event EventRetrivedSuccessful(
        uint indexed eventId,
        string eventName,
        address indexed organizer
    );

    function createEvent(
        EventBasicDetails memory eventBasicDetails,
        TicketInfo memory ticketInfo,
        VendorInfo memory vendorInfo,
        SponsorInfo memory sponsorInfo,
        RevenueInfo memory revenueInfo,
        address paymentTokenAddress
    ) external returns (uint eventId) {
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
        if (paymentTokenAddress == address(0)) {
            revert Error.ZeroAddressDetected();
        }

        eventCount++;

        // Deploy TicketSales contract with tier data
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

        // address revenueSharingContract = address(
        //     new RevenueSharing(
        //         revenueInfo,
        //         eventBasicDetails.organizer,
        //         ticketContract
        //     )
        // );

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
            // revenueSharingContract
            EventStatus.Upcoming
        );

        emit EventCreated(eventCount);
        return eventCount;
    }

    function setEventStatus(EventStatus _status, uint _eventId) external {
        require(events[_eventId].eventId != 0, "Invalid EventID");
        require(isValidStatus(_status), "Invalid status value");

        EventDetail storage ev = events[_eventId];
        require(ev.organizer == msg.sender, "Authorized Access");
        ev.status = _status;
        emit EventSetEventStatus(_eventId);
    }

    function getEventContracts(
        uint eventId
    ) external returns (EventDetail memory) {
        require(events[eventId].eventId != 0, "Invalid EventID");
        EventDetail storage ev = events[eventId];
        emit EventRetrivedSuccessful(eventId, ev.eventName, ev.organizer);
        return events[eventId];
    }

    function _isEmptyString(string memory str) internal pure returns (bool) {
        return bytes(str).length == 0;
    }

    function isValidStatus(EventStatus _status) internal pure returns (bool) {
        uint enumValue = uint(_status);
        return (enumValue >= uint(EventStatus.Upcoming) &&
            enumValue <= uint(EventStatus.Terminated));
    }

    // Allows the contract to receive Ether
    receive() external payable {}
}
