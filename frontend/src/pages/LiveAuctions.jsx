import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { AUCTION_MANAGER_ABI, AUCTION_MANAGER_ADDRESS } from "../utils/contract";

// Reusable BidForm component
function BidForm({ auction, onBid, isAuctionActive }) {
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minBid = parseFloat(ethers.utils.formatEther(auction.highestBid)) + 0.0001;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const success = await onBid(auction.id, bidAmount);
    if (success) {
      setBidAmount("");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
      <input
        type="number"
        step="0.0001"
        min={minBid}
        placeholder={`Min: ${minBid.toFixed(4)} AVAX`}
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        className="flex-grow px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
          !isAuctionActive(auction) || isSubmitting
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
        disabled={!isAuctionActive(auction) || isSubmitting}
      >
        {isSubmitting ? "Bidding..." : "Bid"}
      </button>
    </form>
  );
}

export default function LiveAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [txStatus, setTxStatus] = useState("");
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
        }
        const p = new ethers.providers.Web3Provider(window.ethereum);
        if (!cancelled) setProvider(p);

        const c = new ethers.Contract(AUCTION_MANAGER_ADDRESS, AUCTION_MANAGER_ABI, p);
        if (!cancelled) setContract(c);
      } catch (err) {
        alert("Please connect your wallet.");
        console.error("Wallet connection error:", err);
      }
    }
    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchAuctions = async (c = contract) => {
    if (!c) return;
    setLoading(true);
    try {
      const count = await c.getAuctionsCount();
      const auctionsArr = [];
      for (let i = 0; i < count; i++) {
        const auction = await c.getAuction(i);
        auctionsArr.push({
          id: i,
          seller: auction.seller,
          title: auction.item,
          endTime: new Date(auction.endTime.toNumber() * 1000),
          highestBid: auction.highestBid,
          highestBidder: auction.highestBidder,
          ended: auction.ended,
        });
      }
      setAuctions(auctionsArr);
    } catch (err) {
      console.error("Failed to fetch auctions:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuctions();
  }, [contract, txStatus]);

  useEffect(() => {
    if (!contract) return;
    const interval = setInterval(() => {
      fetchAuctions(contract);
    }, 120000);
    return () => clearInterval(interval);
  }, [contract]);

  function formatTimeLeft(endTime) {
    const diff = endTime - new Date();
    if (diff <= 0) return "Auction ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s left`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {};
      auctions.forEach(({ id, endTime }) => {
        newTimeLeft[id] = formatTimeLeft(endTime);
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctions]);

  const isAuctionActive = (auction) => {
    const endTimestamp =
      auction.endTime instanceof Date
        ? auction.endTime.getTime()
        : new Date(auction.endTime * 1000).getTime();
    const now = Date.now();
    return !auction.ended && now < endTimestamp;
  };

  const handleBid = async (auctionId, bidAmount) => {
    if (!contract || !provider) {
      alert("Wallet not connected");
      return false;
    }

    try {
      const auctionOnChain = await contract.getAuction(auctionId);
      if (auctionOnChain.ended) {
        alert("Cannot bid: auction has ended.");
        return false;
      }

      const highestBidOnChain = ethers.utils.formatEther(auctionOnChain.highestBid);
      if (parseFloat(bidAmount) <= parseFloat(highestBidOnChain)) {
        alert(
          `Bid must be higher than current highest bid (${highestBidOnChain} AVAX).`
        );
        return false;
      }

      setTxStatus("Sending bid...");
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.bid(auctionId, {
        value: ethers.utils.parseEther(bidAmount),
      });
      await tx.wait();

      setTxStatus("Bid sent!");
      fetchAuctions(contract);
      return true;
    } catch (err) {
      setTxStatus("");
      console.error("Bid error:", err);
      alert("Error sending bid: " + (err?.data?.message || err.message));
      return false;
    }
  };

  const activeAuctions = auctions.filter(isAuctionActive);

  return (
    <div className="pt-24 px-6 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-screen">
      <div className="max-w-7xl mx-auto text-white p-10 pb-24">
        <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wide">
          Live Auctions
        </h1>

        {txStatus && (
          <p className="mb-6 text-center text-yellow-300 font-semibold animate-pulse">
            {txStatus}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading auctions...</p>
        ) : activeAuctions.length === 0 ? (
          <p className="text-center text-gray-400">No live auctions available.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {activeAuctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl flex flex-col border border-gray-700"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-3">{auction.title}</h2>

                  {/* Highest Bid Card */}
                  <div className="bg-yellow-400/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-300/20 hover:bg-yellow-400/20 transition-colors duration-300 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c1.104 0 2-.672 2-1.5S13.104 5 12 5s-2 .672-2 1.5S10.896 8 12 8zM5.5 20h13a2.5 2.5 0 002.5-2.5v-1a2.5 2.5 0 00-2.5-2.5h-13A2.5 2.5 0 003 16.5v1A2.5 2.5 0 005.5 20z"
                          />
                        </svg>
                      </div>
                      <span className="text-yellow-300 font-medium text-sm">Highest Bid</span>
                    </div>
                    <p className="text-yellow-200 font-mono text-lg font-bold break-all bg-white/5 px-2 py-1 rounded border border-yellow-300/20">
                      {ethers.utils.formatEther(auction.highestBid)} AVAX
                    </p>
                  </div>

                  {/* Highest Bidder Card */}
                  <div className="bg-blue-400/10 backdrop-blur-sm rounded-xl p-4 border border-blue-300/20 hover:bg-blue-400/20 transition-colors duration-300 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A9 9 0 1118.364 4.561 9 9 0 015.121 17.804z"
                          />
                        </svg>
                      </div>
                      <span className="text-blue-300 font-medium text-sm">Highest Bidder</span>
                    </div>
                    <p className="text-blue-200 font-mono text-sm break-all bg-white/5 px-2 py-1 rounded border border-blue-300/20">
                      {auction.highestBidder}
                    </p>
                  </div>

                                    {/* Time Left Card */}
                  <div className="bg-green-400/10 backdrop-blur-sm rounded-xl p-4 border border-green-300/20 hover:bg-green-400/20 transition-colors duration-300 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6l4 2"
                          />
                        </svg>
                      </div>
                      <span className="text-green-300 font-medium text-sm">Time Left</span>
                    </div>
                    <p className="text-green-200 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-green-300/20">
                      {timeLeft[auction.id] || "Calculating..."}
                    </p>
                  </div>


                  <BidForm
                    auction={auction}
                    onBid={handleBid}
                    isAuctionActive={isAuctionActive}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
