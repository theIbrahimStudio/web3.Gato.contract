const hre = require("hardhat");

async function main() {
  const initialSupply = hre.ethers.parseEther("1000000");

  const ARBIToken = await hre.ethers.getContractFactory("ARBIToken");
  const arbi = await ARBIToken.deploy(initialSupply);

  await arbi.waitForDeployment();

  console.log("✅ ARBI Token deployed to:", await arbi.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
