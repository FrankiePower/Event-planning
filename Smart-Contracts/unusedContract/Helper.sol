// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library Helper {
    // Reusable address validation to avoid duplication in different contracts
    function validateAddress(address addr) internal pure {
        require(addr != address(0), "Invalid address: zero address detected");
    }

    // String validation to check for empty strings
    function validateString(string memory str) internal pure {
        require(bytes(str).length > 0, "Invalid string: empty string detected");
    }

    // Validates event status to ensure it's within a valid range
    function isValidStatus(
        uint enumValue,
        uint min,
        uint max
    ) internal pure returns (bool) {
        return (enumValue >= min && enumValue <= max);
    }
}
