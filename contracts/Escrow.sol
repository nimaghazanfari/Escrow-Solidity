// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is Ownable {
    using SafeMath for uint256;
    using Address for address payable;

    address public buyer;
    address public seller;
    uint256 public percent;
    uint256 public totalPrice;

    function initEscrow(
        address _seller,
        uint256 _totalPrice,
        uint256 _percent
    ) external onlyOwner {
        require(_percent < 100, "!all");

        seller = _seller;
        totalPrice = _totalPrice;
        percent = _percent;
    }

    function buyItem(address _buyer) external payable onlyOwner {
        //buyer must send the exact price defined by the seller
        require(msg.value == totalPrice, "!totalPrice");
        buyer = _buyer;
    }

    function withdraw() external onlyOwner {
        uint256 totalDeposit = address(this).balance;
        require(totalDeposit > 0, "!balance");

        uint256 agentFee = totalDeposit.mul(percent).div(100);
        require(agentFee > 0, "!fee");

        //subtract the agent's fee, and send the rest to the seller
        payable(seller).sendValue(totalDeposit.sub(agentFee));
    }
}
