require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  // Check balance (ethers v6 style)
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "AVAX");

  if (balance < ethers.parseEther("0.1")) {
    throw new Error("❌ Insufficient AVAX balance. Fund your wallet from the Fuji faucet first.");
  }

  // Deploy contract
  const AuctionManager = await ethers.getContractFactory("AuctionManager");
  const auctionManager = await AuctionManager.deploy();
  await auctionManager.waitForDeployment();

  console.log("✅ AuctionManager deployed to:", await auctionManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
