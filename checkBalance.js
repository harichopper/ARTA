require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet: ${wallet.address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} AVAX`);
}

main();
