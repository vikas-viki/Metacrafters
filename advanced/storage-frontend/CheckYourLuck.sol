// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CheckYourLuck {
    mapping(uint => bool) internal guessable;
    address private owner;
    
    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "only owner can call");
        _;
    }

    // This is set by Math.random().
    function setNumber(uint _num) public payable onlyOwner {
        guessable[_num] = true;
    }

    function guessNumber(uint _num) public view returns(bool){
        require(_num >= 0, "number cant be nagative");
        if(guessable[_num] == true){
            payable(msg.sender).call{value: address(this).balance};
            return true;
        }else{
            return false;
        }
    }
}