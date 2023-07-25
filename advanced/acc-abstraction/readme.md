# Smart Wallet

This repository contains the implementation of ERC-4337 for creating a smart contract wallet, along with a simple user interface to make transactions using the smart wallet.

### [Click here for Video explanation](https://drive.google.com/file/d/1QHG1lmx_hfSKkd4Nm1B8Y5oPUYGfgCEe/view?usp=sharing)

## Get Started


### Clone the Repository

```bash
git clone https://github.com/vikas-viki/Metacrafters.git

```

### Set up Smart Contracts

Open a terminal and run the following commands:

```bash
cd advanced/acc-abstraction/smart-contracts && npm install
```

- Open two more terminals under this directory, and run the following commands in each:

```bash
npx hardhat node
```

```bash
npx hardhat run scripts/deploy.js --netwrok localhost
```
Switch to localhost in wallet.

### Set up Client
Open another terminal and run the following commands:

```bash
cd advanced/acc-abstraction/client && npm install
```

To start the client, run:

```bash
npm run dev 
```

Finally, check the video for a detailed explanation.

Thank you! 🙂
