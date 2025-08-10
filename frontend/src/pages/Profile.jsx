import React, { useEffect, useState } from 'react';

function Profile({ account }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  // Backend API URL to fetch user profile by wallet address
  const API_URL = 'https://arta-frontend-65ui.vercel.app/api/users'; // Change this to your backend endpoint

  useEffect(() => {
    if (!account) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/${account.toLowerCase()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [account]);

  if (!account) {
    return (
      <div className="container mx-auto p-6 text-white max-w-3xl">
        <h1 className="text-3xl mb-6 font-bold">User Profile</h1>
        <p className="text-red-400">No wallet connected. Please connect your wallet.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-white max-w-3xl">
        <h1 className="text-3xl mb-6 font-bold">User Profile</h1>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-white max-w-3xl">
        <h1 className="text-3xl mb-6 font-bold">User Profile</h1>
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  // Destructure userData with defaults
  const {
    walletAddress,
    role = 'user',
    auctionsParticipated = 0,
    auctionsWon = 0,
    accountCreated = 'Unknown',
    totalUsers,
    activeAuctions,
    pendingRequests,
  } = userData || {};

  return (
    <div className="container mx-auto p-6 text-white max-w-3xl">
      <h1 className="text-3xl mb-6 font-bold">User Profile</h1>

      <p className="mb-4">
        <strong>Wallet Address:</strong> {walletAddress || account}
      </p>

      <p className="mb-6">
        <strong>Role:</strong>{' '}
        <span
          className={
            role === 'admin'
              ? 'text-green-400'
              : role === 'user'
              ? 'text-blue-400'
              : 'text-gray-400'
          }
        >
          {role}
        </span>
      </p>

      {role === 'admin' ? (
        <>
          <h2 className="text-2xl font-semibold mb-3">Admin Dashboard</h2>
          <p>Welcome, Admin! You can manage users, auctions, and system settings here.</p>

          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Total registered users: {totalUsers ?? 'N/A'}</li>
            <li>Active auctions: {activeAuctions ?? 'N/A'}</li>
            <li>Pending approval requests: {pendingRequests ?? 'N/A'}</li>
          </ul>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-3">User Details</h2>
          <p>Welcome to your profile! Here is your basic user information.</p>

          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Auctions participated: {auctionsParticipated}</li>
            <li>Auctions won: {auctionsWon}</li>
            <li>Account created: {accountCreated}</li>
          </ul>
        </>
      )}
    </div>
  );
}

export default Profile;
