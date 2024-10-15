// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "./EventContract.sol";

contract EventManagerFactory {
    address[] public events;
    mapping(address => address[]) public eventOrganizers;

    function createEvent(
        // address _organizer,
        address paymentTokenAddress,
        string memory _NftTokenName,
        string memory _NftSymbol,
        string memory _name,
        string memory _description,
        string memory _venue,
        string memory _image,
        uint256 _startDate,
        uint256 _endDate,
        uint16 _totalTicketAvailable
    ) public returns (address) {
        EventContract newEvent = new EventContract(
            msg.sender,
            paymentTokenAddress,
            _NftTokenName,
            _NftSymbol,
            _name,
            _description,
            _venue,
            _image,
            _startDate,
            _endDate,
            _totalTicketAvailable
        );
        events.push(address(newEvent));
        eventOrganizers[msg.sender].push(address(newEvent));
        return address(newEvent);
    }
}
