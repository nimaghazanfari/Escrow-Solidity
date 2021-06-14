// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is Ownable, AccessControl {
    using SafeMath for uint256;
    using Address for address payable;

    bytes32 public constant SYSTEM_AGENT = keccak256("SYSTEM_AGENT");
    bytes32 public constant SYSTEM_BUYER = keccak256("SYSTEM_BUYER");
    bytes32 public constant SYSTEM_SELLER = keccak256("SYSTEM_SELLER");

    enum EscrowStatus {FOR_SALE, SOLD, WITHDRAWN}
    EscrowItem[] public escrows;
    mapping(uint256 => bool) public contains;

    struct EscrowItem {
        address buyer;
        address seller;
        uint256 percent;
        uint256 totalPrice;
        uint256 status;
    }

    modifier onlySeller() {
        //checking Role == SELLER
        require(hasRole(SYSTEM_SELLER, _msgSender()), "!seller");
        _;
    }

    function initNewEscrowItem(
        address _seller,
        uint256 _totalPrice,
        uint256 _percent
    ) external onlyOwner {
        require(_percent < 100, "!all");

        EscrowItem memory newItem =
            EscrowItem({
                buyer: address(0),
                seller: _seller,
                percent: _percent,
                totalPrice: _totalPrice,
                status: uint256(EscrowStatus.FOR_SALE)
            });

        _setupRole(SYSTEM_SELLER, _seller);

        escrows.push(newItem);
        contains[escrows.length - 1] = true;
    }

    function buyItem(uint256 _itemId) external payable {
        require(contains[_itemId], "!exists");
        EscrowItem storage item = escrows[_itemId];

        require(item.status == uint256(EscrowStatus.FOR_SALE), "!for-sale");

        //buyer must send the exact price defined by the seller
        require(msg.value == item.totalPrice, "!totalPrice");
        item.buyer = _msgSender();
        item.status = uint256(EscrowStatus.SOLD);

        //refund extra payment
        if (msg.value > item.totalPrice) {
            uint256 diff = msg.value.sub(item.totalPrice);
            payable(item.buyer).sendValue(diff);
        }
    }

    function withdraw(uint256 _itemId) external onlySeller {
        require(contains[_itemId], "!exists");
        EscrowItem storage item = escrows[_itemId];

        require(item.seller == _msgSender(), "!ownseller");
        require(item.status != uint256(EscrowStatus.FOR_SALE), "!sold");
        require(item.status != uint256(EscrowStatus.WITHDRAWN), "withdrawn");

        uint256 totalDeposit = address(this).balance;
        require(totalDeposit > 0, "!balance");

        uint256 agentFee = item.totalPrice.mul(item.percent).div(100);
        require(agentFee > 0, "!fee");

        item.status = uint256(EscrowStatus.WITHDRAWN);
        //subtract the agent's fee, and send the rest to the seller
        uint256 amount = item.totalPrice.sub(agentFee);
        require(amount > 0, "!fee");

        payable(item.seller).sendValue(amount);
    }

    function totalEscrows() external view returns (uint256 count) {
        count = escrows.length;
    }
}
