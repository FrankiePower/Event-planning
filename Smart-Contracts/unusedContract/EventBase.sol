// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library StringUtils {
    function isEmptyString(string memory str) internal pure returns (bool) {
        return bytes(str).length == 0;
    }
}

library EventStatusUtils {
    enum EventStatus {
        Upcoming,
        Ongoing,
        Completed,
        Terminated
    }

    function isValidStatus(EventStatus _status) internal pure returns (bool) {
        return (uint8(_status) <= uint8(EventStatus.Terminated));
    }
}

abstract contract EventBase {
    using StringUtils for string;
    using EventStatusUtils for EventStatusUtils.EventStatus;

    modifier validEventName(string memory eventName) {
        require(!eventName.isEmptyString(), "Invalid Event Name");
        _;
    }

    modifier validOrganizer(address organizer) {
        require(organizer != address(0), "Invalid Organizer Address");
        _;
    }

    modifier validDateRange(uint startDate, uint endDate) {
        require(startDate <= endDate, "Invalid Event Dates");
        _;
    }
}
