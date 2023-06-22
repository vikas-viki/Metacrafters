# Contracts

This README provides a brief overview of the three contracts available in the provided code.

## 1. Storage Contract

### Description
The `Storage` contract is a simple contract that allows storing and retrieving a single unsigned integer value.

### Functions
- `store(uint256 num)`: This function sets the value of `number` to the provided `num`.
- `retrieve() view returns (uint256)`: This function retrieves and returns the current value of `number`.

## 2. Owner Contract

### Description
The `Owner` contract implements a contract ownership mechanism. It allows changing the contract owner and retrieving the current owner's address.

### Functions
- `changeOwner(address newOwner)`: This function changes the owner of the contract to the provided `newOwner` address. Only the current owner can call this function.
- `getOwner() view returns (address)`: This function returns the address of the current contract owner.

## 3. Ballot Contract

### Description
The `Ballot` contract represents a voting system where voters can vote on different proposals. It also allows delegation of votes and determines the winning proposal based on accumulated votes.

### Structs
- `Voter`: Represents a voter and their voting-related information, including weight, voted status, delegate address, and vote index.
- `Proposal`: Represents a proposal with a name and the number of accumulated votes.

### Functions
- `giveRightToVote(address voter)`: Grants the right to vote on the ballot to the specified `voter` address. Only the `chairperson` (contract deployer) can call this function.
- `delegate(address to)`: Delegates the sender's vote to the specified `to` address. The sender must not have voted before and cannot delegate to themselves. This function handles delegation loops and updates the vote count accordingly.
- `vote(uint proposal)`: Allows the sender to vote for the proposal at the specified index `proposal`. The sender's weight is taken into account when updating the vote count.
- `winningProposal() view returns (uint)`: Computes the index of the winning proposal by considering all previous votes and returns it.
- `winnerName() view returns (bytes32)`: Calls `winningProposal()` to retrieve the index of the winner from the proposals array and returns its name.

Note: The provided contracts contain SPDX-License-Identifier tags indicating that they are licensed under GPL-3.0.
