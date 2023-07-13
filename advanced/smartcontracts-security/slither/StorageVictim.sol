pragma solidity ^0.4.23;

contract StorageVictim {
    address owner;

    struct Storage {
        address user;
        uint amount;
    }

    mapping(address => Storage) storages;

    function StorageVictim() public {
        owner = msg.sender;
    }

    function store(uint _amount) public {
        // uninitialised pointer. str.user points to the storage address 0 which is "owner"

        Storage str;

        str.user = msg.sender;

        str.amount = _amount;

        storages[msg.sender] = str;
    }

    function getStore() public view returns (address, uint) {
        Storage str = storages[msg.sender];

        return (str.user, str.amount);
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
/* Slither test
    ructor(...) { ... }" instead.
   function StorageVictim() public {
   ^ (Relevant source part starts here and spans across multiple lines).
    StorageVictim.sol:24:8: Warning: Variable is declared as a storage pointer. Use an explicit "storage" keyword to silence this warning.
       Storage str;
       ^---------^
    StorageVictim.sol:35:8: Warning: Variable is declared as a storage pointer. Use an explicit "storage" keyword to silence this warning.
       Storage str = storages[msg.sender];
       ^---------^
    StorageVictim.sol:24:8: Warning: Uninitialized storage pointer. 
    Did you mean '<type> memory str'?
       Storage str;
       ^---------^

    INFO:Detectors:
    StorageVictim.store(uint256).str (StorageVictim.sol#24) is a storage variable never initialized
    Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-storage-variables
    INFO:Detectors:
    Pragma version^0.4.23 (StorageVictim.sol#1) allows old versions
    solc-0.4.23 is not recommended for deployment
    Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity
    INFO:Detectors:
    Parameter StorageVictim.store(uint256)._amount (StorageVictim.sol#20) is not in mixedCase
    Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions
    INFO:Slither:StorageVictim.sol analyzed (1 contracts with 88 detectors), 4 result(s) found
*/
