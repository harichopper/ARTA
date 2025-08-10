import { ethers } from "ethers";

// Replace with your deployed contract address (update this if you redeploy!)
export const AUCTION_MANAGER_ADDRESS = "0x2e75c10241d0846c025A0A580c004e4BEdb24d7b";

export const AUCTION_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_sellerName", "type": "string" },
      { "internalType": "uint256", "name": "_startingBid", "type": "uint256" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" },
      { "internalType": "string", "name": "_description", "type": "string" }
    ],
    "name": "createAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "_auctionId", "type": "uint256" } ],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "_auctionId", "type": "uint256" } ],
    "name": "withdrawReturns",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "_auctionId", "type": "uint256" } ],
    "name": "endAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAuctionsCount",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "_auctionId", "type": "uint256" } ],
    "name": "getAuction",
    "outputs": [
      { "internalType": "address", "name": "sellerAddress", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "sellerName", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint256", "name": "startingBid", "type": "uint256" },
      { "internalType": "uint256", "name": "highestBid", "type": "uint256" },
      { "internalType": "address", "name": "highestBidder", "type": "address" },
      { "internalType": "bool", "name": "ended", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export function getAuctionManagerContract(providerOrSigner) {
  return new ethers.Contract(
    AUCTION_MANAGER_ADDRESS,
    AUCTION_MANAGER_ABI,
    providerOrSigner
  );
}
