## Vesting Contract, ![Live](https://tokenvesting.vercel.app/)

This contract is designed to facilitate a vesting mechanism for organizations that issue tokens. It allows organizations to register and manage their token vesting details. Users who are white-listed by an organization can withdraw their vested tokens once the vesting period has ended.

### Contract Details

**License:** MIT

**Solidity Version:** 0.8

### Contract Structure

The contract consists of the following main components:

1. `Vesting` contract: This is the main contract that manages the vesting functionality.
2. `Token` contract: This is an external contract that represents the token being vested. It is imported into the `Vesting` contract.

### Functionality

1. **`register()`**: Organizations can register by providing the necessary details such as token name, total supply, token symbol, vesting period, white-listed stakeholders, stakeholder types, and vested amounts. The organization's details are stored in the contract along with a reference to the corresponding `Token` contract.
2. **`withdrawTokens()`**: Users who are white-listed by an organization can withdraw their vested tokens once the vesting period has ended. The contract verifies the withdrawal conditions before transferring the tokens to the user's address.
3. **`isOrg()**: Users can check if an address corresponds to a registered organization.
4. **`getOrgDetails()`**: Users can retrieve the details of a registered organization, including token name, symbol, total supply, stakeholders, white-listed status, stakeholder types, vesting release time, and withdrawal status.

### Usage

1. Deploy the `Vesting` contract, specifying the address of the `Token` contract.
3. Call the `register` function to register organizations and the required details.
4. Users can call the `withdrawTokens` function to withdraw their vested tokens once the vesting period has ended.
5. Use the provided getter functions to retrieve organization and vesting details.
## 
Thankyou 🤗.
