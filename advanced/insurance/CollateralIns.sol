//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract CollateralInsurance {
    address public borrower;
    uint256 public premiumAmount;
    uint256 public collateralValue;
    uint256 public insPercentage;
    bool public claimed;
    uint256 public collateralThreshold;
    uint256 public loanAmt;

    modifier onlyBorrower() {
        require(msg.sender == borrower, "Only borrower can call");
        _;
    }

    // Get the deails and store.
    constructor(
        address _borrower,
        uint256 _premiumAmount,
        uint256 _loanAmount,
        uint256 _collateralValue,
        uint256 _insurancePercentage,
        uint256 _collateralThreshold
    ) payable {
        borrower = _borrower;
        premiumAmount = _premiumAmount;
        collateralValue = _collateralValue;
        insPercentage = _insurancePercentage;
        loanAmt = _loanAmount;
        collateralThreshold = _collateralThreshold;
    }

    // Pay premium amout for the loan.
    function payPremium() external payable onlyBorrower {
        require(msg.value >= premiumAmount, "Insufficient premium amount");
        loanAmt -= msg.value;
    }

    // if the the collateral insurance value goes down the threshold, let user claim insurance.
    function claimCollateralInsurance(uint256 currentCollateralValue)
        external
        onlyBorrower
        returns (uint256)
    {
        require(claimed == false, "Already claimed.");
        require(
            currentCollateralValue < collateralThreshold,
            "Collateral value is above threshold"
        );
        claimed = true;
        return ((insPercentage * collateralValue) / 100);
    }

    // for the frontend to interact with.
    function getDetails()
        external
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            bool,
            uint256,
            uint256
        )
    {
        return (
            borrower,
            premiumAmount,
            collateralValue,
            insPercentage,
            claimed,
            collateralThreshold,
            loanAmt
        );
    }
}
