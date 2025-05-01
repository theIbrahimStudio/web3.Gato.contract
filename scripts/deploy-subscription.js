const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const SubscriptionManager = await hre.ethers.getContractFactory("SubscriptionManager");
  const subscriptionManager = await SubscriptionManager.deploy(tokenAddress);
  await subscriptionManager.waitForDeployment();

  console.log("✅ SubscriptionManager deployed to:", await subscriptionManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
