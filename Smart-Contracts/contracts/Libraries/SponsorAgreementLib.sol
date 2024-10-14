// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../SponsorAgreement.sol";
import "../Utils/Errors.sol";
import "../EventManagerFactory.sol";
import "./EventCreationLib.sol";

library SponsorAgreementLib {
    struct SponsorInfo {
        address[] sponsors;
        uint[] sponsorContributions;
        uint8[] sponsorRevenueShares;
    }

    function addSponsorAgreement(
        uint16 _eventId,
        mapping(uint => EventCreationLib.EventDetail) storage events,
        // SponsorInfo calldata sponsorInfo,
        address caller
    ) external {
        require(events[_eventId].eventId != 0, "Invalid EventID");
        EventCreationLib.EventDetail storage ev = events[_eventId];
        require(ev.organizer == caller, "Not authorized");

        address sponsorAgreementContract = address(
            new SponsorAgreement(_eventId, ev.organizer)
        );

        ev.sponsorContract = sponsorAgreementContract;
    }
}
