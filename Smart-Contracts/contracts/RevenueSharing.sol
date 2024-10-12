// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract RevenueSharing {
    address public organizer;
    bool public eventFinalized;
    address ticketContractAddress;

    struct Stakeholder {
        uint256 share;
        uint256 amountReceived;
        bool isPaid;
    }

    mapping(address => Stakeholder) public stakeholders;
    address[] public stakeholderAddresses;

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can call this function.");
        _;
    }

    modifier eventNotFinalized() {
        require(!eventFinalized, "Event has been finalized.");
        _;
    }

    constructor(
        address[] memory _stakeholders,
        uint256[] memory _shares,
        address _organizer,
        address _ticketContractAddress
    ) {
        require(_stakeholders.length == _shares.length, "Stakeholder data mismatch.");
        organizer = _organizer;
        ticketContractAddress = _ticketContractAddress;

        for (uint256 i = 0; i < _stakeholders.length; i++) {
            require(_shares[i] > 0 && _shares[i] <= 100, "Invalid share percentage.");
            stakeholders[_stakeholders[i]] = Stakeholder({
                share: _shares[i],
                amountReceived: 0,
                isPaid: false
            });
            stakeholderAddresses.push(_stakeholders[i]);
        }
    }

    // Interface for the ticket contract to retrieve total revenue
    interface ITicketContract {
        function getTotalRevenue() external view returns (uint256);
    }

    // Distributes revenue to stakeholders based on their share
    function distributeRevenue() external onlyOrganizer eventNotFinalized {
        ITicketContract ticketContract = ITicketContract(ticketContractAddress);
        uint256 totalRevenue = ticketContract.getTotalRevenue(); // Get the total revenue from the ticket contract

        require(totalRevenue > 0, "Revenue must be greater than zero.");

        for (uint256 i = 0; i < stakeholderAddresses.length; i++) {
            address stakeholderAddress = stakeholderAddresses[i];
            Stakeholder storage stakeholder = stakeholders[stakeholderAddress];

            if (!stakeholder.isPaid) {
                uint256 payment = (totalRevenue * stakeholder.share) / 100;
                payable(stakeholderAddress).transfer(payment);
                stakeholder.amountReceived += payment;
                stakeholder.isPaid = true;
            }
        }
    }

    // Retrieves stakeholder details (share percentage, amount received, and if they've been paid)
    function getStakeholderDetails(address stakeholder)
        public
        view
        returns (uint256 share, uint256 amountReceived, bool isPaid)
    {
        Stakeholder memory s = stakeholders[stakeholder];
        return (s.share, s.amountReceived, s.isPaid);
    }

    // Finalizes the event, preventing any further payments
    function finalizeEvent() external onlyOrganizer eventNotFinalized {
        eventFinalized = true;
    }

    // Allows the contract to receive Ether
    receive() external payable {}
}
