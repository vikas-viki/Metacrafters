// SPDX-License-Identifier:MIT

pragma solidity ^0.8;

contract WalletInsurance {
    // check if theuser has paid monthly premium.
    address public owner;
    mapping(uint256 => bool) internal premiumPaid;
    uint256[] premiumPaidDays;
    uint256 internal premiumAmt;
    uint256 internal insPeriod;
    uint256 internal insPayout;
    bool internal claimed;

    constructor(
        address _owner,
        uint256 _premiumAmt,
        uint256 _insPeriod,
        uint256 _insPayout
    ) {
        owner = _owner;
        premiumAmt = _premiumAmt;
        insPayout = _insPayout;
        insPeriod = block.timestamp + _insPeriod;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    function payPremium() public payable onlyOwner returns (bool) {
        require(
            insPeriod >= block.timestamp,
            "Insurance expired, please renew."
        );
        require(msg.value >= premiumAmt, "Insufficient premium amount.");
        // it will check if the monthly premium was paid in the last month.
        if (premiumPaidDays.length > 0) {
            require(
                lastMonthPremiumPaid() == true,
                "last Month premium not paid."
            );
        }
        uint256 currTime = block.timestamp;
        premiumPaid[currTime] = true;
        premiumPaidDays.push(currTime);
        return true;
    }

    // To renew an insrance, users will intract with factory.
    function claim() public returns (uint256) {
        require(claimed == false, "Already claimed.");
        // some checks for wallet being hacked.
        require(
            insPeriod >= block.timestamp,
            "Insurance expired, please renew."
        );
        require(initialPremiumPaid() == true, "Initial premium not paid.");
        // it will check if the monthly premium was paid in the last month.
        require(lastMonthPremiumPaid() == true, "last Month premium not paid.");

        claimed = true;
        return insPayout;
    }

    function getDetails()
        public
        view
        onlyOwner
        returns (
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        if (premiumPaidDays.length > 0) {
            uint256 lastPremiumPaid = premiumPaidDays[
                premiumPaidDays.length - 1
            ];
            return (
                premiumAmt,
                insPayout,
                insPeriod,
                premiumPaid[lastPremiumPaid]
            );
        } else {
            return (premiumAmt, insPayout, insPeriod, false);
        }
    }

    function initialPremiumPaid() public view returns (bool) {
        if (premiumPaidDays.length == 0) {
            return false;
        } else {
            uint256 lastPremiumPaid = premiumPaidDays[
                premiumPaidDays.length - 1
            ];
            if (premiumPaid[lastPremiumPaid] == true) {
                return true;
            }
        }
        return false;
    }

    function lastMonthPremiumPaid() public view returns (bool) {
        if (initialPremiumPaid() == true) {
            uint256 lastPremiumPaid = premiumPaidDays[
                premiumPaidDays.length - 1
            ];
            if (lastPremiumPaid >= (block.timestamp - 4 weeks)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
