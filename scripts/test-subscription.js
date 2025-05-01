const hre = require("hardhat");

async function main() {
  const [deployer, user] = await hre.ethers.getSigners();

  // Load contracts
  const ARBIToken = await hre.ethers.getContractFactory("ARBIToken");
  const SubscriptionManager = await hre.ethers.getContractFactory("SubscriptionManager");

  const arbi = await ARBIToken.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const subscription = await SubscriptionManager.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

  // Mint some ARBI tokens to user
  const mintAmount = hre.ethers.parseEther("1000");
  await arbi.mint(user.address, mintAmount);
  console.log(`✅ Minted 1000 ARBI to ${user.address}`);

  // Connect contracts to the user
  const arbiAsUser = arbi.connect(user);
  const subscriptionAsUser = subscription.connect(user);

  // Approve SubscriptionManager to spend tokens
  const subAmount = hre.ethers.parseEther("100");
  await arbiAsUser.approve(await subscription.getAddress(), subAmount);
  console.log("✅ Approved 100 ARBI for subscription");

  // Subscribe to ProMonthly (Plan 1) for 30 days
  await subscriptionAsUser.subscribe(1, subAmount, 30); // Plan.ProMonthly = 1
  console.log("✅ Subscribed to ProMonthly");

  // Fetch and print subscription info
  const sub = await subscription.getSubscription(user.address);
  console.log("📦 Subscription Data:", {
    plan: Number(sub.plan),
    expiresAt: new Date(Number(sub.expiresAt) * 1000).toISOString(),
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
