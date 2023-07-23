// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
	const EntryPoint = await hre.ethers.getContractFactory("EntryPoint");
	const entryPoint = await EntryPoint.deploy({ gasLimit: 6e6 });

	await entryPoint.deployed();

	console.log(`Entry Point deployed to ${entryPoint.address}`);

	const SimpleAccountFactory = await hre.ethers.getContractFactory(
		"SimpleAccountFactory"
	);
	const simpleAccountFactory = await SimpleAccountFactory.deploy(
		entryPoint.address,
		{
			gasLimit: 6e6,
		}
	);

	await simpleAccountFactory.deployed();

	console.log(
		`Simple Account Factory deployed to ${simpleAccountFactory.address}`
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});