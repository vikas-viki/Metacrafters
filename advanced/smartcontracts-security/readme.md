# Smart Contract Audit - `manual`

**`1. Un licensed`**
- 
It is recomended to specify the license under which the smart contract is released. It helps in clearly indicating the permissions and restrictions associated with the codebase.

**Fix `// SPDX-License-Identifier: GPL`**

**`2. pragma solidity ^0.4.23;`**
- 
It is always recomended to use the latest and stable version of Solidity to enable new recent features and to avoid certain loop holes in the contract, which may cause huge losses in certain cases.

**Fix `pragma solidity 0.8.16`**


**`3. mapping(address => Storage) storages;`**
-
It is recomended to specify the scope of the varible to prioritize the use and access of the state.

**Fix `mapping(address => Storage) internal storages;`**

**`4. store(uint256 _amount)`**
- 
It is always recomended to restrict the access of the certain functions being called by every user which might be vulnerable. onlyOwner is modifier which allows only owner to call the function.

**Fix `store(uint256 _amount) public onlyOwner `**

**`5. StorageVictim()`**
- 
In latest version of solidity, functions are not allowed to have same name as contract name, if it is a constructor, it has to be renamed as constructor and it doesn't have any scope to be declared with.

**Fix `constructor()`**

**`6. store(uint _amount)`**
- 
Data location for the variables must be specified, it can be either **storage** (storage location in Solidity) or **memory** (temporary memory location in Solidity) and it cannot be unspecified and the memory location must be specified .

**Fix `Storage storage str = storages[msg.sender];`**


**`7. getStore()`**
- 
Data location for the variables must be specified, it can be either **storage** (storage location in Solidity) or **memory** (temporary memory location in Solidity) and it cannot be unspecified.

**Fix `Storage storage str;`**

# Smart Contract Audit - `Forge`

Everything working fine - test result.

`
Running 1 test for test/StorageVictim.t.sol:StorageVictimTest
[PASS] testExample(uint256) (runs: 256, μ: 49187, ~: 49732)
Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 63.59ms
Ran 1 test suites: 1 tests passed, 0 failed, 0 skipped (1 total tests).`


# Smart Contract Audit - `Slither`

One modification - test result.

INFO:Detectors:
`Pragma version0.8.16 (AuditedStorageVictim.sol#2) allows old versions
solc-0.8.16 is not recommended for deployment`

INFO:Detectors:
`Parameter StorageVictim.store(uint256)._amount (AuditedStorageVictim.sol#18) is not in mixedCase   `  

INFO:Detectors: `
StorageVictim.owner (AuditedStorageVictim.sol#5) should be immutable `
INFO:Slither:AuditedStorageVictim.sol analyzed (1 contracts with 88 detectors), 4 result(s) found

**Fix `address immutable owner;`**