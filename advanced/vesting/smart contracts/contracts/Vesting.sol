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
        uint256 totalSupply;
        mapping(address => bool) whiteListed;
        mapping(address => string) holderType;
        mapping(address => uint256) vestedAmount;
        address[] stakeHolders;
        uint256 releaseTime;
        Token token;
    }

    address[] internal orgs; // to show users which organsations are there.
    mapping(address => Organization) public organisations;
    mapping(address => string) public organisationName;

    function register(
        address _organization,
        string memory _tokenName,
        uint256 _totalSupply,
        string memory _tokenSymbol,
        uint256 _vestingPeriod,
        bool[] memory _whiteListed,
        address[] memory _stakeholders,
        string[] memory _stakeholderType,
        uint256[] memory _vestedAmt
    ) public {
        Organization storage org = organisations[_organization];
        org.tokenName = _tokenName;
        org.totalSupply = _totalSupply;
        org.tokenSymbol = _tokenSymbol;
        org.releaseTime = block.timestamp + _vestingPeriod;
        for (uint256 i = 0; i < _stakeholders.length; i++) {
            org.whiteListed[_stakeholders[i]] = _whiteListed[i];
            org.holderType[_stakeholders[i]] = _stakeholderType[i];
            org.vestedAmount[_stakeholders[i]] = _vestedAmt[i];
        }
        org.stakeHolders = _stakeholders;
        org.token = new Token(
            _tokenName,
            _tokenSymbol,
            _organization,
            _totalSupply
        );
        orgs.push(_organization);
    }

    function withdrawTokens(address _user, address _organization)
        public
        returns (bool)
    {
        Organization storage org = organisations[_organization];
        uint256 amt = org.vestedAmount[_user];
        require(amt > 0, "Already withdrawn");
        require(block.timestamp > org.releaseTime, "Vesting period not ended");
        require(org.whiteListed[_user] == true, "User not white listed");
        bool sent = org.token.transfer(_organization, _user, amt);
        require(sent == true, "Withdrawal was not successful");
        org.vestedAmount[_user] = 0;
        return true;
    }

    function isOrg(address _user) public view returns (bool) {
        for (uint256 i = 0; i < orgs.length; i++) {
            if (_user == orgs[i]) {
                return true;
            }
        }
        return false;
    }

    function getOrgs()
        public
        view
        returns (address[] memory orgAddr, string[] memory orgNames)
    {
        for (uint256 i = 0; i < orgs.length; i++) {
            orgAddr[i] = orgs[i];
            orgNames[i] = organisationName[orgs[i]];
        }
    }

    // name,symbol,supply,holders,whitelisted,type,releaseT,tokenWithdrawn
    function getOrgDetails(address _org)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            address[] memory,
            bool[] memory,
            string[] memory,
            uint256,
            bool[] memory
        )
    {
        Organization storage org = organisations[_org];
        bool[] memory whiteListed;
        string[] memory _type;
        bool[] memory withdrawn;
        for (uint256 i = 0; i < org.stakeHolders.length; i++) {
            whiteListed[i] = org.whiteListed[org.stakeHolders[i]];
            _type[i] = org.holderType[org.stakeHolders[i]];
            withdrawn[i] = org.vestedAmount[org.stakeHolders[i]] == 0;
        }
        return (
            org.tokenName,
            org.tokenSymbol,
            org.totalSupply,
            org.stakeHolders,
            whiteListed,
            _type,
            org.releaseTime,
            withdrawn
        );
    }
}
