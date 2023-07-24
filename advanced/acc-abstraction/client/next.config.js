/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    FACTORY_ADDRESS: '',
    FACTORYABI: [
      {
        "inputs": [
          {
            "internalType": "contract IEntryPoint",
            "name": "_entryPoint",
            "type": "address"
          }
        ],
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
        "name": "SmartAccounts",
        "outputs": [
          {
            "internalType": "contract SimpleAccount",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "accountImplementation",
        "outputs": [
          {
            "internalType": "contract SimpleAccount",
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
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "createAccount",
        "outputs": [
          {
            "internalType": "contract SimpleAccount",
            "name": "ret",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "getAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
  }
}

module.exports = nextConfig
