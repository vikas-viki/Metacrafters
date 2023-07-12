// SPDX-License-Identifier:MIT

pragma solidity ^0.8;
import "./WalletIns.sol";
import "./CollateralIns.sol";

contract InsuranceFactory {
    mapping(address => address) public userWalletInsurance;

    mapping(address => address) public userCollateralInsurance;

    function createWalletInsurance(
        address owner,
        uint256 premiumAmt,
        uint256 payout,
        uint256 timePeried
    ) public returns (address) {
        require(
            userWalletInsurance[owner] == address(0),
            "Insurance already exists, to renew use renewWallet()"
        );
        WalletInsurance newWI = new WalletInsurance(
            owner,
            premiumAmt,
            timePeried,
            payout
        );
        userWalletInsurance[owner] = address(newWI);
        return (address(newWI));
    }

    function renewWallet(
        uint256 premiumAmt,
        uint256 timePeried,
        uint256 payout
    ) public returns (address) {
        WalletInsurance renewedWI = new WalletInsurance(
            msg.sender,
            premiumAmt,
            timePeried,
            payout
        );
        userWalletInsurance[msg.sender] = address(renewedWI);
        return (address(renewedWI));
    }

    function claimWallet() public returns (bool) {
        address walletIns = userWalletInsurance[msg.sender];
        require(walletIns != address(0), "No insurance created.");
        WalletInsurance w = WalletInsurance(walletIns);
        uint256 payout = w.claim();
        require(address(this).balance >= payout, "Insufficient funds.");
        payable(msg.sender).transfer(payout);
        return true;
    }

    function createCollateralInsurance(
        address owner,
        uint256 premiumAmt,
        uint256 loanAmt,
        uint256 collatVal,
        uint256 insPercentage,
        uint256 collatThreshold
    ) public returns (address) {
        address collatIns = userCollateralInsurance[msg.sender];
        require(collatIns != address(0), "No insurance created.");
        CollateralInsurance newCI = new CollateralInsurance(
            owner,
            premiumAmt,
            loanAmt,
            collatVal,
            insPercentage,
            collatThreshold
        );
        userCollateralInsurance[owner] = address(newCI);
        return (address(newCI));
    }

    function claimColletral(uint256 CollatValue) public returns (bool) {
        address collatIns = userCollateralInsurance[msg.sender];
        require(collatIns != address(0), "No insurance created.");

        CollateralInsurance c = CollateralInsurance(collatIns);
        uint256 payout = c.claimCollateralInsurance(CollatValue);

        require(address(this).balance >= payout, "Insufficient funds.");
        payable(msg.sender).transfer(payout);
        return true;
    }

    function getUserInsurance() public view returns(address, address){
        return(userCollateralInsurance[msg.sender], userWalletInsurance[msg.sender]);
    }
}
