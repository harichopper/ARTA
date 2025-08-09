import React, { useState, useEffect } from 'react';

const sampleAuctions = [
  {
    id: 1,
    title: 'Vintage Rolex Watch',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
    currentBid: 2500,
    endTime: new Date(Date.now() + 3600 * 1000),
  },
  {
    id: 2,
    title: 'Antique Pocket Watch',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
    currentBid: 1500,
    endTime: new Date(Date.now() + 7200 * 1000),
  },
  {
    id: 3,
    title: 'Modern Smartwatch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    currentBid: 350,
    endTime: new Date(Date.now() + 1800 * 1000),
  },
];

function formatTimeLeft(endTime) {
  const diff = endTime - new Date();
  if (diff <= 0) return "Auction ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // Format with leading zeros
  const pad = (num) => String(num).padStart(2, '0');

  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s left`;
}

export default function UpcomingAuctions() {
  const [auctions, setAuctions] = useState(sampleAuctions);
  const [timeLeft, setTimeLeft] = useState({});

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
          Upcoming Auctions
        </h1>
        <div className="grid md:grid-cols-3 gap-10">
          {auctions.map(({ id, title, image, currentBid }) => (
            <div
              key={id}
              className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl flex flex-col"
              role="region"
              aria-label={`Auction item ${title}`}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-52 object-cover"
                loading="lazy"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold mb-3">{title}</h2>
                <p className="text-purple-400 font-bold text-2xl mb-4">${currentBid.toLocaleString()}</p>
                <p className="text-gray-300 flex-grow text-lg">{timeLeft[id]}</p>
                <button
                  className="mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-3 rounded-lg font-semibold shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500"
                  onClick={() => alert(`Bid placed on ${title}`)}
                  aria-label={`Place a bid on ${title}`}
                >
                  Place a Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
