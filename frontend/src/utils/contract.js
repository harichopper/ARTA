import { ethers } from "ethers";

const AVALANCHE_RPC = "https://api.avax-test.network/ext/bc/C/rpc"; // or mainnet RPC

const provider = new ethers.providers.JsonRpcProvider(AVALANCHE_RPC);

// Replace with your deployed contract address
export const AUCTION_MANAGER_ADDRESS = "0x521F4F2540b4F66699AF08D196caBFACF40D24F8";

// Updated ABI with createAuction taking 5 parameters:
// name (string), seller (address), startingBid (uint256), duration (uint256), description (string)
export const AUCTION_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "address", "name": "seller", "type": "address" },
      { "internalType": "uint256", "name": "startingBid", "type": "uint256" },
      { "internalType": "uint256", "name": "duration", "type": "uint256" },
      { "internalType": "string", "name": "description", "type": "string" }
    ],
    "name": "createAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_auctionId", "type": "uint256" }
    ],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_auctionId", "type": "uint256" }
    ],
    "name": "withdrawReturns",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_auctionId", "type": "uint256" }
    ],
    "name": "endAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAuctionsCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_auctionId", "type": "uint256" }
    ],
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

// Helper function to get contract instance with provider or signer
export function getAuctionManagerContract(providerOrSigner) {
  return new ethers.Contract(
    AUCTION_MANAGER_ADDRESS,
    AUCTION_MANAGER_ABI,
    providerOrSigner
  );
}
