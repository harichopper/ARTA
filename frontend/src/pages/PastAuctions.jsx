import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AUCTION_MANAGER_ABI, AUCTION_MANAGER_ADDRESS } from '../utils/contract';

export default function PastAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  // Setup provider and contract on mount
  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      const c = new ethers.Contract(AUCTION_MANAGER_ADDRESS, AUCTION_MANAGER_ABI, p);
      setContract(c);
    } else {
      alert('Please install MetaMask');
    }
  }, []);

  // Fetch expired auctions
  const fetchExpiredAuctions = async (c = contract) => {
    if (!c) return;
    setLoading(true);
    try {
      const count = await c.getAuctionsCount();
      const expiredArr = [];

      for (let i = 0; i < count; i++) {
        const auction = await c.getAuction(i);

        let title;
        try {
          title = ethers.utils.parseBytes32String(auction.item);
        } catch {
          title = auction.item;
        }

        const ended = auction.ended;
        const endTime = new Date(auction.endTime.toNumber() * 1000);

        if (ended || endTime <= new Date()) {
          expiredArr.push({
            id: i,
            seller: auction.seller,
            title,
            endTime,
            highestBid: auction.highestBid,
            highestBidder: auction.highestBidder,
            ended,
          });
        }
      }
      setAuctions(expiredArr);
    } catch (err) {
      console.error('Failed to fetch expired auctions:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpiredAuctions();
  }, [contract]);

  useEffect(() => {
    if (!contract) return;
    const interval = setInterval(() => {
      fetchExpiredAuctions(contract);
    }, 120000);
    return () => clearInterval(interval);
  }, [contract]);

  function formatTimeLeft(endTime) {
    const diff = endTime - new Date();
    if (diff <= 0) return "Auction ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const pad = (num) => String(num).padStart(2, '0');
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

  return (
    <div className="pt-24 px-6 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-screen">
      <div className="max-w-7xl mx-auto text-white p-10 pb-24">
        <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wide">
          🌟 Past Auctions
        </h1>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">Loading expired auctions...</p>
        ) : auctions.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">No expired auctions available.</p>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map(({ id, title, endTime, seller, highestBid, highestBidder, ended }) => {
            const auctionEnded = ended || new Date() >= endTime;
            return (
              <div
                key={id}
                className="group relative bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-slate-900/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/25"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Status badge */}
                <div className="absolute top-4 right-4 z-10 pt-2">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2  text-sm font-semibold rounded-full backdrop-blur-md border shadow-lg ${
                      auctionEnded
                        ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-red-500/25'
                        : 'bg-green-500/20 text-green-300 border-green-500/40 shadow-green-500/25'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${auctionEnded ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`} />
                    {auctionEnded ? 'Ended' : 'Live'}
                  </span>
                </div>

                <div className="relative p-8 flex flex-col h-full">
                  {/* Title */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                      {title}
                    </h2>
                    
                    {/* Countdown or Status */}
                    
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-4 flex-grow">
                    {/* End Time Card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-purple-300 font-medium text-sm">End Time</span>
                      </div>
                      <p className="text-white font-semibold">{endTime.toLocaleString()}</p>
                    </div>

                    {/* Seller Card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-cyan-300 font-medium text-sm">Seller</span>
                      </div>
                      <p className="text-white font-mono text-sm break-all bg-white/5 px-2 py-1 rounded border">
                        {seller}
                      </p>
                    </div>

                    {/* Highest Bid Card */}
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 hover:from-yellow-500/15 hover:to-orange-500/15 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <span className="text-yellow-300 font-medium text-sm">Highest Bid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-yellow-300">
                          {ethers.utils.formatEther(highestBid)}
                        </p>
                        <span className="text-yellow-200 text-sm font-medium bg-yellow-500/20 px-2 py-1 rounded-full">
                          AVAX
                        </span>
                      </div>
                    </div>

                    {/* Highest Bidder Card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <span className="text-green-300 font-medium text-sm">Highest Bidder</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {highestBidder.slice(2, 4).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white font-mono text-sm bg-white/5 px-2 py-1 rounded border flex-1">
                          {highestBidder.slice(0, 6)}...{highestBidder.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button or Winner Badge */}
                  <div className="mt-6">
                    {auctionEnded ? (
                      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span className="text-purple-300 font-semibold">Auction Completed</span>
                        </div>
                        <p className="text-purple-200 text-sm">
                          Winner: <span className="font-mono">{highestBidder.slice(0, 8)}...</span>
                        </p>
                      </div>
                    ) : (
                      <button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-lg hover:shadow-purple-500/25">
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Place Bid
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-50" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
