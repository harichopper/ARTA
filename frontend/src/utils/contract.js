import { ethers } from "ethers";

// Replace with your deployed contract address
export const AUCTION_MANAGER_ADDRESS = "0xD2C17a53D96304c760B87dAC830E20e6D2a82d0a";

// ABI extracted from AuctionManager.sol
export const AUCTION_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_item", "type": "string" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" }
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
      { "internalType": "address", "name": "seller", "type": "address" },
      { "internalType": "string", "name": "item", "type": "string" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
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
