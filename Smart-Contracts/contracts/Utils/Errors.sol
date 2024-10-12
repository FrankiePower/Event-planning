// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Error {
    error ZeroAddressDetected();
    error ZeroValueNotAllowed();
    error NotTheEventManager();
    error DuplicateEventId();
    error InvalidEventName();
    error InvalidVenueName();
    error InvalidDescriptionName();
    error InvalidCreatedBy();
    error InvalidDateTime();
    error InvalidStartDate();
    error InValidNFTAddress();
    error NotAValidEventId();
    error AlreadyRegistered();
    error YouDontHaveEventNFT();
    error EventIsClosed();
    error EventTerminated();
    error NotRegisteredForEvent();
    error EventRegistrationClosed();
    error NFTAlreadyUsed();
    error InvalidTierNames();
    error InvalidTierPrices();
    error InvalidTierAvailability();
    error InvalidIpfsHash();
    error InvalidTicketTier();
    error NoAvailableTierForTier();
    error IncorrectPaymentAmount();
    error AllTicketSoldOut();
    error InsufficientFunds();
    error TokenTransferFailed();
    error InvalidVendorPayment();
}
