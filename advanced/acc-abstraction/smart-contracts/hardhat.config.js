require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
  module.exports = {
    solidity: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 100,
        },
        viaIR: true,
      },
    },
    networks: {
      hardhat: {
        chainId: 1337,
        allowUnlimitedContractSize: true,
        gasLimit: 6e6,
      },
    },
  };

