// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../SponsorAgreement.sol";
import "../Utils/Errors.sol";
import "../EventManagerFactory.sol";

library SponsorAgreementLib {
    struct SponsorInfo {
        address[] sponsors;
        uint[] sponsorContributions;
        uint8[] sponsorRevenueShares;
    }

    function addSponsorAgreement(
        uint16 _eventId,
        mapping(uint => EventManagerFactory.EventDetail) storage events,
        SponsorInfo calldata sponsorInfo,
        address caller
    ) external {
        require(events[_eventId].eventId != 0, "Invalid EventID");
        EventManagerFactory.EventDetail storage ev = events[_eventId];
        require(ev.organizer == caller, "Not authorized");

        address sponsorAgreementContract = address(
            new SponsorAgreement(sponsorInfo, _eventId, ev.organizer)
        );

        ev.sponsorContract = sponsorAgreementContract;
    }
}
