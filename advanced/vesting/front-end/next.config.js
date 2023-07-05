/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        CONTRACT_ADDRESS: "0x7A91028cFab63823fF31fb3D0dbC63fbA19801C6",
        ABI:[
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "organisationName",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "organisations",
            "outputs": [
              {
                "internalType": "string",
                "name": "tokenName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tokenSymbol",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "totalSupply",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "releaseTime",
                "type": "uint256"
              },
              {
                "internalType": "contract Token",
                "name": "token",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "orgs",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_organization",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "_tokenName",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "_totalSupply",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "_tokenSymbol",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "_vestingPeriod",
                "type": "uint256"
              },
              {
                "internalType": "bool[]",
                "name": "_whiteListed",
                "type": "bool[]"
              },
              {
                "internalType": "address[]",
                "name": "_stakeholders",
                "type": "address[]"
              },
              {
                "internalType": "string[]",
                "name": "_stakeholderType",
                "type": "string[]"
              },
              {
                "internalType": "uint256[]",
                "name": "_vestedAmt",
                "type": "uint256[]"
              }
            ],
            "name": "register",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_organization",
                "type": "address"
              }
            ],
            "name": "withdrawTokens",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ]
    }
}

module.exports = nextConfig
