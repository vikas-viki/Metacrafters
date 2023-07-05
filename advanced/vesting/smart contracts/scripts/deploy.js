const hre = require("hardhat");

async function main() {

  const lock = await hre.ethers.deployContract("Vesting");

  await lock.waitForDeployment();

  console.log(
    `Deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
