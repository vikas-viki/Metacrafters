// SPDX-License-Identifier: GPL
pragma solidity 0.8.16;

contract StorageVictim {
    address immutable owner;

    struct Storage {
        address user;
        uint256 amount;
    }

    mapping(address => Storage) internal storages;

    constructor() {
        owner = msg.sender;
    }

    function store(uint256 _amount) public {
        Storage storage str = storages[msg.sender];

        str.user = msg.sender;

        str.amount = _amount;
    }

    function getStore() public view returns (address, uint256) {
        Storage storage str = storages[msg.sender];

        return (str.user, str.amount);
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
