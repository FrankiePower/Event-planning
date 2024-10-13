// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../VendorAgreement.sol";
import "../Utils/Errors.sol";
import "../EventManagerFactory.sol";

library VendorAgreementLib {
    struct VendorInfo {
        address[] vendors;
        uint[] vendorPayments;
        bytes32[] vendorServices;
    }

    function addVendorAgreement(
        uint16 _eventId,
        mapping(uint => EventManagerFactory.EventDetail) storage events,
        VendorInfo calldata vendorInfo,
        address VendorAgreementArbitrator,
        address caller
    ) external {
        require(events[_eventId].eventId != 0, "Invalid EventID");
        EventManagerFactory.EventDetail storage ev = events[_eventId];
        require(ev.organizer == caller, "Not authorized");

        address vendorAgreementContract = address(
            new VendorAgreement(
                _eventId,
                vendorInfo,
                ev.organizer,
                VendorAgreementArbitrator
            )
        );

        ev.vendorContract = vendorAgreementContract;
    }
}
