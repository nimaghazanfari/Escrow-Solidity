// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Escrow.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract EscrowFactory is AccessControl {
    using SafeMath for uint256;

    Escrow[] public escrows;
    address[] public agents;

    bytes32 public constant SYSTEM_AGENT = keccak256("SYSTEM_AGENT");
    bytes32 public constant SYSTEM_BUYER = keccak256("SYSTEM_BUYER");
    bytes32 public constant SYSTEM_SELLER = keccak256("SYSTEM_SELLER");

    constructor() {
        // _setupRole(DEFAULT_ADMIN_ROLE, owner);
        // _setupRole(SYSTEM_AGENT, owner);
    }
}
