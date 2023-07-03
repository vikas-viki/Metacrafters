# MyToken Contract

This Solidity contract represents a basic token with minting and burning functionality.

## Requirements

1. Your contract will have public variables that store the details about your coin (Token Name, Token Abbrv., Total Supply)
2. Your contract will have a mapping of addresses to balances (address => uint)
3. You will have a mint function that takes two parameters: an address and a value. The function then increases the total supply by that number and increases the balance of the "sender" address by that amount
4. Your contract will have a burn function, which works the opposite of the mint function, as it will destroy tokens. It will take an address and value just like the mint functions. It will then deduct the value from the total supply and from the balance of the "sender".
5. Lastly, your burn function should have conditionals to make sure the balance of "sender" is greater than or equal to the amount that is supposed to be burned.

## Contract Details

- `// SPDX-License-Identifier: MIT` specifies the type of license used for contract.
- `pragma solidity 0.8.18;` specifying the version of compiler to compile the contract code.

### Public Variables

- `tokenName` (string): Stores the name of the token (e.g., "YTWDS").
- `tokenAbbr` (string): Stores the abbreviation of the token (e.g., "WDS").
- `totalSupply` (uint): Stores the total supply of the token. Initially set to 0.

### Mapping

- `balances` (mapping): Associates addresses with token balances. Each address is mapped to a uint value representing the balance of tokens held by that address.

### Mint Function

The `mint` function increases the token supply and the balance of the specified address.

```solidity
function mint(address _address, uint _value) public {
    balances[_address] += _value;
    totalSupply += _value;
}
```

- `_address` The address to which tokens will be minted.
- `_value`: The number of tokens to be minted and added to the specified address.

### Burn Function
The burn function decreases the token supply and the balance of the specified address.

```solidity
function burn(address _addr, uint _val) public {
    require(balances[_addr] >= _val, "values passed grater than balance.");
    balances[_addr] -= _val;
    totalSupply -= _val;
}
```
- `_addr` The address from which tokens will be burned.
- `_val` The number of tokens to be burned from the specified address.
- The burn function includes a `require` statement to ensure that the balance of the sender is greater than or equal to the amount being burned.