// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "./Token.sol";

contract Vesting {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Organization {
        string tokenName;
        string tokenSymbol; 
        uint totalSupply;
        mapping(address => bool) whiteListed;
        mapping(address => string) holderType;
        mapping(address => uint) vestedAmount;
        uint releaseTime;
        Token token;
    }

    address[] public orgs; // to show users which organsations are there.
    mapping(address => Organization) public organisations;
    mapping(address => string) public organisationName;

    function register(
        address _organization,
        string memory _tokenName,
        uint _totalSupply,
        string memory _tokenSymbol,
        uint _vestingPeriod,
        bool[] memory _whiteListed,
        address[] memory _stakeholders,
        string[] memory _stakeholderType,
        uint[] memory _vestedAmt
    ) public {
        Organization storage org = organisations[_organization];
        org.tokenName = _tokenName;
        org.totalSupply = _totalSupply;
        org.tokenSymbol = _tokenSymbol;
        org.releaseTime = block.timestamp + _vestingPeriod;
        for (uint i = 0; i < _stakeholders.length; i++) {
            org.whiteListed[_stakeholders[i]] = _whiteListed[i];
            org.holderType[_stakeholders[i]] = _stakeholderType[i];
            org.vestedAmount[_stakeholders[i]] = _vestedAmt[i];
        }
        org.token = new Token(
            _tokenName,
            _tokenSymbol,
            _organization,
            _totalSupply
        );
        orgs.push(_organization);
    }

    function withdrawTokens(address _user, address _organization) public returns(bool){
        Organization storage org = organisations[_organization];
        uint amt = org.vestedAmount[_user];
        require(amt > 0, "Already withdrawn");
        require(block.timestamp > org.releaseTime, "Vesting period not ended");
        require(org.whiteListed[_user] == true, "User not white listed");
        bool sent = org.token.transfer(_organization, _user, amt);
        require(sent == true, "Withdrawal was not successful");
        org.vestedAmount[_user] = 0;
        return true;
    }
}
