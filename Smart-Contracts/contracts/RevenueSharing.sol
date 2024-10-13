// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "./EventManagerFactory.sol";
import "./Ticket.sol";

contract RevenueSharing {
    address public organizer;
    bool public eventFinalized;
    address ticketContractAddress;

    struct Stakeholder {
        uint share;
        uint amountReceived;
        bool isPaid;
    }

    mapping(address => Stakeholder) public stakeholders;
    address[] public stakeholderAddresses;

    modifier onlyOrganizer() {
        require(
            msg.sender == organizer,
            "Only organizer can call this function."
        );
        _;
    }

    modifier eventNotFinalized() {
        require(!eventFinalized, "Event has been finalized.");
        _;
    }

    constructor(
        // address[] memory _stakeholders,
        // uint[] memory _shares,
        EventManagerFactory.RevenueInfo revenueInfo,
        address _organizer,
        address _ticketContractAddress
    ) {
        require(
            revenueInfo.stakeholders.length ==
                revenueInfo.sharingPercentage.length,
            "Stakeholder data mismatch."
        );
        organizer = _organizer;
        ticketContractAddress = _ticketContractAddress;

        for (uint i = 0; i < revenueInfo.stakeholders.length; i++) {
            require(
                revenueInfo.sharingPercentage[i] > 0 && revenueInfo.sharingPercentage[i] <= 100,
                "Invalid share percentage."
            );
            stakeholders[revenueInfo.stakeholders[i]] = Stakeholder({
                share: revenueInfo.stakeholders[i],
                amountReceived: 0,
                isPaid: false
            });
            stakeholderAddresses.push(revenueInfo.stakeholders[i]);
        }
    }

    // Interface for the ticket contract to retrieve total revenue
    interface ITicketContract {
        function getTotalRevenue() external view returns (uint);
    }

    // Distributes revenue to stakeholders based on their share
    function distributeRevenue() external onlyOrganizer eventNotFinalized {
        ITicketContract ticketContract = ITicketContract(ticketContractAddress);
        uint totalRevenue = ticketContract.getTotalRevenue(); // Get the total revenue from the ticket contract

        require(totalRevenue > 0, "Revenue must be greater than zero.");

        for (uint i = 0; i < stakeholderAddresses.length; i++) {
            address stakeholderAddress = stakeholderAddresses[i];
            Stakeholder storage stakeholder = stakeholders[stakeholderAddress];

            if (!stakeholder.isPaid) {
                uint payment = (totalRevenue * stakeholder.share) / 100;
                payable(stakeholderAddress).transfer(payment);
                stakeholder.amountReceived += payment;
                stakeholder.isPaid = true;
            }
        }
    }

    // Retrieves stakeholder details (share percentage, amount received, and if they've been paid)
    function getStakeholderDetails(
        address stakeholder
    ) public view returns (uint share, uint amountReceived, bool isPaid) {
        Stakeholder memory s = stakeholders[stakeholder];
        return (s.share, s.amountReceived, s.isPaid);
    }

    function finalizeEvent() external onlyOrganizer eventNotFinalized {
        eventFinalized = true;
    }

    // Allows the contract to receive Ether
    receive() external payable {}
}
