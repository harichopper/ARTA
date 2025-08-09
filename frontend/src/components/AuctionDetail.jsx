import React from 'react';
import { ethers } from 'ethers';

const AuctionDetail = ({ auction }) => {
  const endDate = new Date(parseInt(auction.endTime) * 1000);
  const now = Date.now();
  const auctionEnded = auction.ended || now >= endDate.getTime();

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>{auction.item}</h3>
      <p><strong>Seller:</strong> {auction.seller}</p>
      <p><strong>Ends:</strong> {endDate.toLocaleString()}</p>
      <p><strong>Highest Bid:</strong> {ethers.utils.formatEther(auction.highestBid)} AVAX</p>
      <p><strong>Highest Bidder:</strong> {auction.highestBidder}</p>
      <p><strong>Status:</strong> {auctionEnded ? 'Inactive' : 'Active'}</p>
    </div>
  );
};

export default AuctionDetail;
