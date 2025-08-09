import React, { useEffect, useState } from 'react';
import AuctionDetail from './AuctionDetail';
import { AUCTION_MANAGER_ABI, AUCTION_MANAGER_ADDRESS } from '../utils/contract';
import { ethers } from 'ethers';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [item, setItem] = useState("");
  const [duration, setDuration] = useState("");
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      const c = new ethers.Contract(
        AUCTION_MANAGER_ADDRESS,
        AUCTION_MANAGER_ABI,
        p
      );
      setContract(c);
    }
  }, []);

  const fetchAuctions = async (c = contract) => {
    if (!c) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const count = await c.getAuctionsCount();
      const auctionsArr = [];
      for (let i = 0; i < count; i++) {
        const auction = await c.getAuction(i);
        auctionsArr.push({
          id: i,
          seller: auction.seller,
          item: auction.item,
          endTime: auction.endTime.toString(),
          highestBid: auction.highestBid.toString(),
          highestBidder: auction.highestBidder,
          ended: auction.ended
        });
      }
      setAuctions(auctionsArr);
    } catch (err) {
      console.error(err);
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
    }, 15000);

    return () => clearInterval(interval);
  }, [contract]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        alert('Wallet connection failed');
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    if (!item || !duration || !account) return;
    setTxStatus('Creating auction...');
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.createAuction(item, duration);
      await tx.wait();
      setTxStatus('Auction created!');
      setItem("");
      setDuration("");
    } catch (err) {
      setTxStatus('Error creating auction');
      console.error(err);
    }
  };

  const handleBid = async (auctionId, bidAmount) => {
    if (!account) return alert('Connect wallet first');

    try {
      const auctionOnChain = await contract.getAuction(auctionId);
      if (auctionOnChain.ended) {
        alert('Cannot bid: auction has ended.');
        return;
      }
      const highestBidOnChain = ethers.utils.formatEther(auctionOnChain.highestBid);
      if (parseFloat(bidAmount) <= parseFloat(highestBidOnChain)) {
        alert(`Bid must be higher than current highest bid (${highestBidOnChain} AVAX).`);
        return;
      }
    } catch (err) {
      alert('Failed to fetch auction details. Please try again.');
      console.error(err);
      return;
    }

    setTxStatus('Sending bid...');
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      try {
        await contractWithSigner.estimateGas.bid(auctionId, { value: ethers.utils.parseEther(bidAmount) });
      } catch (gasErr) {
        alert('Bid transaction likely to fail: ' + (gasErr?.error?.message || gasErr.message));
        setTxStatus('');
        return;
      }

      const tx = await contractWithSigner.bid(auctionId, { value: ethers.utils.parseEther(bidAmount) });
      await tx.wait();
      setTxStatus('Bid sent!');
    } catch (err) {
      setTxStatus('Error sending bid');
      console.error(err);
    }
  };

  // Withdraw function with callStatic simulation before sending tx
  const handleWithdraw = async (auctionId) => {
    if (!account) return alert('Connect wallet first');

    setTxStatus('Checking returns...');
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // simulate to check if withdraw will succeed
      await contractWithSigner.callStatic.withdrawReturns(auctionId);

      setTxStatus('Withdrawing returns...');
      const tx = await contractWithSigner.withdrawReturns(auctionId, { gasLimit: 100000 });
      await tx.wait();
      setTxStatus('Returns withdrawn!');
    } catch (err) {
      const errMsg = err?.error?.message || err.message || '';
      if (errMsg.includes('No returns')) {
        alert('No returns available to withdraw for this auction.');
        setTxStatus('');
      } else {
        alert('Error withdrawing returns: ' + errMsg);
        setTxStatus('');
      }
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} style={{ marginBottom: '1rem' }}>
        {account ? `Connected: ${account.substring(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>

      <form onSubmit={handleCreateAuction} style={{ marginBottom: '2rem' }}>
        <h3>Create Auction</h3>
        <input
          type="text"
          placeholder="Item name"
          value={item}
          onChange={e => setItem(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Duration (seconds)"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>

      {txStatus && <div style={{ marginBottom: '1rem' }}>{txStatus}</div>}

      <h2>Auctions</h2>
      {loading ? (
        <div>Loading auctions...</div>
      ) : auctions.length === 0 ? (
        <div>No auctions found.</div>
      ) : (
        <ul>
          {auctions.map(auction => (
            <li key={auction.id} style={{ marginBottom: '1rem' }}>
              <AuctionDetail auction={auction} />
              {!auction.ended && (
                <BidForm auction={auction} onBid={handleBid} />
              )}
              <button onClick={() => handleWithdraw(auction.id)} style={{ marginLeft: '1rem' }}>Withdraw Returns</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function BidForm({ auction, onBid }) {
  const [bidAmount, setBidAmount] = useState("");
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onBid(auction.id, bidAmount);
        setBidAmount("");
      }}
      style={{ marginTop: '0.5rem' }}
    >
      <input
        type="number"
        step="0.0001"
        min={parseFloat(ethers.utils.formatEther(auction.highestBid)) + 0.0001}
        placeholder={`Bid (AVAX), current: ${ethers.utils.formatEther(auction.highestBid)}`}
        value={bidAmount}
        onChange={e => setBidAmount(e.target.value)}
        required
      />
      <button type="submit">Bid</button>
    </form>
  );
}

export default AuctionList;
