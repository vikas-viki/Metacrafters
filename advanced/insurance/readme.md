## Contracts Overview

1. **InsuranceFactory.sol**: This contract serves as a factory for creating and managing insurance contracts. It allows users to create wallet insurance and collateral insurance contracts, renew wallet insurance, and claim insurance payouts.

2. **WalletInsurance.sol**: This contract represents wallet insurance and provides functions for managing premium payments, insurance claims, and retrieving insurance details.

3. **CollateralInsurance.sol**: This contract represents collateral insurance and provides functions for managing premium payments, insurance claims based on collateral value, and retrieving insurance details.

### Contract Hierarchy

The contracts are organized in the following hierarchy:

- InsuranceFactory.sol
  - WalletInsurance.sol
  - CollateralInsurance.sol

### Usage

1. **InsuranceFactory.sol**: Use this contract to create and manage insurance contracts.
   - `createWalletInsurance`: Create a new wallet insurance contract.
   - `renewWallet`: Renew an existing wallet insurance contract.
   - `claimWallet`: Claim a wallet insurance payout.
   - `createCollateralInsurance`: Create a new collateral insurance contract.
   - `claimCollateral`: Claim a collateral insurance payout.
   - `getUserInsurance`: Get the addresses of the user's collateral and wallet insurance contracts.

2. **WalletInsurance.sol**: This contract represents wallet insurance and provides the following functions:
   - `payPremium`: Pay the monthly insurance premium.
   - `claim`: Claim the insurance payout.
   - `getDetails`: Get details about the insurance contract.

3. **CollateralInsurance.sol**: This contract represents collateral insurance and provides the following functions:
   - `payPremium`: Pay the insurance premium for the collateral.
   - `claimCollateralInsurance`: Claim the insurance payout based on collateral value.
   - `getDetails`: Get details about the insurance contract.

