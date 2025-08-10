import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ethers } from "ethers";

// Your deployed contract address
const AUCTION_MANAGER_ADDRESS = "0x521F4F2540b4F66699AF08D196caBFACF40D24F8";

// Your updated ABI with 5 params for createAuction
const AUCTION_MANAGER_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "address", name: "_seller", type: "address" },
      { internalType: "uint256", name: "_startingBid", type: "uint256" },
      { internalType: "uint256", name: "_duration", type: "uint256" },
      { internalType: "string", name: "_description", type: "string" },
    ],
    name: "createAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // other ABI entries like bid, withdrawReturns, etc. as needed...
];

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    seller: "",
    startingBid: "",
    duration: "",
    description: "",
  });
  const [account, setAccount] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    // Create JsonRpcProvider pointing to Avalanche testnet RPC (no ENS support)
    const p = new ethers.providers.JsonRpcProvider(
      "https://api.avax-test.network/ext/bc/C/rpc"
    );
    setProvider(p);

    // If MetaMask is installed, get signer for wallet interaction
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const signer = p.getSigner(accounts[0]);
            const c = new ethers.Contract(
              AUCTION_MANAGER_ADDRESS,
              AUCTION_MANAGER_ABI,
              signer
            );
            setContract(c);
          }
        })
        .catch((err) => {
          console.error("User denied wallet connection", err);
        });

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const signer = p.getSigner(accounts[0]);
          const c = new ethers.Contract(
            AUCTION_MANAGER_ADDRESS,
            AUCTION_MANAGER_ABI,
            signer
          );
          setContract(c);
        } else {
          setAccount("");
          setContract(null);
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "MetaMask Not Detected",
        text: "Please install MetaMask to manage auctions.",
      });
    }
  }, []);

  useEffect(() => {
    // Validate all fields filled & seller address is valid Ethereum address
    const allFilled = Object.values(formData).every(
      (val) => val.toString().trim() !== ""
    );
    const validSeller = ethers.utils.isAddress(formData.seller);
    setIsValid(allFilled && validSeller);
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contract) {
      return Swal.fire(
        "Error",
        "Contract or wallet not initialized. Please connect your wallet.",
        "error"
      );
    }

    if (!isValid) {
      return Swal.fire(
        "Error",
        "Please fill all fields with valid data, including a valid seller address.",
        "warning"
      );
    }

    let durationSeconds = parseInt(formData.duration, 10);
    let startingBidWei;
    try {
      startingBidWei = ethers.utils.parseEther(formData.startingBid.toString());
    } catch {
      return Swal.fire(
        "Error",
        "Starting bid must be a valid ETH amount.",
        "warning"
      );
    }

    setTxStatus("Creating auction on blockchain...");

    try {
      const tx = await contract.createAuction(
        formData.name,
        formData.seller,
        startingBidWei,
        durationSeconds,
        formData.description
      );
      await tx.wait();

      setTxStatus("");
      Swal.fire("Success", "Auction created successfully!", "success");

      setFormData({
        name: "",
        seller: "",
        startingBid: "",
        duration: "",
        description: "",
      });
    } catch (err) {
      setTxStatus("");
      Swal.fire("Error", "Transaction failed: " + (err.message || err), "error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-white text-4xl mb-6">Admin Dashboard - Create Auction</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg max-w-lg w-full space-y-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          name="seller"
          placeholder="Seller Address (0x...)"
          value={formData.seller}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="number"
          name="startingBid"
          step="0.01"
          min="0"
          placeholder="Starting Bid (ETH)"
          value={formData.startingBid}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="number"
          name="duration"
          min="1"
          placeholder="Duration (seconds)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          disabled={!isValid || !!txStatus}
          className={`w-full p-4 rounded text-white font-bold ${
            isValid && !txStatus
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105 transition-transform"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {txStatus || "Create Auction"}
        </button>
      </form>
    </div>
  );
}
