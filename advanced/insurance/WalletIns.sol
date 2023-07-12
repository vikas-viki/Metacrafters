// SPDX-License-Identifier:MIT

pragma solidity ^0.8;

contract WalletInsurance{
    // check if theuser has paid monthly premium.
    address owner;
    mapping(uint => bool) internal premiumPaid;
    uint[] premiumPaidDays;
    uint internal premiumAmt;
    uint internal insPeriod;
    uint internal insPayout;
    bool internal claimed;

    constructor(address _owner, uint _premiumAmt, uint _insPeriod, uint _insPayout){
        owner = _owner;
        premiumAmt = _premiumAmt;
        insPayout = _insPayout;
        insPeriod = _insPeriod;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    function  payPremium() onlyOwner public payable returns(bool){
        require(insPeriod <= block.timestamp, "Insurance expired, please renew.");
        require(msg.value >= premiumAmt, "Insufficient premium amount.");
        uint lastPremiumPaid = premiumPaidDays[premiumPaidDays.length - 1];
        // it will check if the monthly premium was paid in the last month.
        require(lastPremiumPaid >= (block.timestamp - 4 weeks), "Monthly premium not paid.");
        uint currTime = block.timestamp;
        premiumPaid[currTime] = true;
        premiumPaidDays.push(currTime);
        return true;
    }

    // To renew an insrance, users will intract with factory.
    function claim() public returns(uint){
        require(claimed == false, "Already claimed.");
        // some checks for wallet being hacked.
        require(insPeriod <= block.timestamp, "Insurance expired, please renew.");
        uint lastPremiumPaid = premiumPaidDays[premiumPaidDays.length - 1];
        require(premiumPaid[lastPremiumPaid] == true, "Initial Premium not paid yet.");
        // it will check if the monthly premium was paid in the last month.
        require(lastPremiumPaid >= (block.timestamp - 4 weeks), "Monthly premium not paid.");

        claimed = true;
        return insPayout;
    }

    function getDetails() public view onlyOwner returns(uint, uint, uint, bool){
        uint lastPremiumPaid = premiumPaidDays[premiumPaidDays.length - 1];
        return(premiumAmt, insPayout, insPeriod, premiumPaid[lastPremiumPaid]);
    }

}