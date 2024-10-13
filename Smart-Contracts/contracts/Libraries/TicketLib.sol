// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library TicketLib {
    function safeTransferEther(address recipient, uint amount) internal {
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Ether transfer failed");
    }

    function safeTransferToken(
        address recipient,
        uint amount,
        IERC20 token
    ) internal {
        bool success = token.transferFrom(msg.sender, recipient, amount);
        require(success, "Token transfer failed");
    }

    function safeTransferTokenFromContract(
        address recipient,
        uint amount,
        IERC20 token
    ) internal {
        bool success = token.transfer(recipient, amount);
        require(success, "Token transfer failed");
    }
}
