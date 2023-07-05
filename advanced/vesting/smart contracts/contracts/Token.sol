// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC20.sol";

contract Token is ERC20 {
    constructor(string memory tokenName, string memory tokenSymbol, address to, uint amount) ERC20(tokenName, tokenSymbol) {
        _mint(to, amount);
    }
}