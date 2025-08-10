import React from 'react';
import { ethers } from 'ethers';

const AuctionDetail = ({ auction }) => {
  const endDate = new Date(parseInt(auction.endTime) * 1000);
  const now = Date.now();
  const auctionEnded = auction.ended || now >= endDate.getTime();

  // Format highest bid or show "No bids yet"
  const highestBidFormatted = auction.highestBid === '0'
    ? 'No bids yet'
    : `${ethers.utils.formatEther(auction.highestBid)} AVAX`;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', background: auctionEnded ? '#f8d7da' : '#d4edda' }}>
      <h3>{auction.item}</h3>
      <p><strong>Seller:</strong> {auction.seller}</p>
      <p><strong>Ends:</strong> {endDate.toLocaleString()}</p>
      <p><strong>Highest Bid:</strong> {highestBidFormatted}</p>
      <p><strong>Highest Bidder:</strong> {auction.highestBidder}</p>
      <p>
        <strong>Status:</strong>{' '}
        <span style={{ color: auctionEnded ? 'red' : 'green', fontWeight: 'bold' }}>
          {auctionEnded ? 'Inactive' : 'Active'}
        </span>
      </p>
    </div>
  );
};

export default AuctionDetail;
