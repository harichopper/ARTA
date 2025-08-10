import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';
import { AUCTION_MANAGER_ABI, AUCTION_MANAGER_ADDRESS } from '../utils/contract';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    seller: '',
    startingBid: '',
    duration: '',
    description: '',
    imageUrl: '',
  });

  const [account, setAccount] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [txStatus, setTxStatus] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Cloudinary config
  const CLOUDINARY_CLOUD_NAME = 'dsalogt8w';
  const CLOUDINARY_UPLOAD_PRESET = 'ARTAtoken';
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      const c = new ethers.Contract(AUCTION_MANAGER_ADDRESS, AUCTION_MANAGER_ABI, p);
      setContract(c);

      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) setAccount(accounts[0]);
      });

      window.ethereum.on('accountsChanged', accounts => {
        setAccount(accounts.length > 0 ? accounts[0] : '');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'MetaMask Not Detected',
        text: 'Please install MetaMask to manage auctions.',
      });
    }
  }, []);

  useEffect(() => {
    const requiredFields = ['name', 'seller', 'startingBid', 'duration', 'description', 'imageUrl'];
    const allFilled = requiredFields.every(field => formData[field]?.toString().trim() !== '');
    setIsValid(allFilled);
  }, [formData]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);

    const formDataCloudinary = new FormData();
    formDataCloudinary.append('file', file);
    formDataCloudinary.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formDataCloudinary,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
        Swal.fire('Success', 'Image uploaded successfully', 'success');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire('Error', `Image upload failed: ${error.message}`, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      Swal.fire('Error', 'Please install MetaMask', 'error');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      Swal.fire('Wallet Connected', `Connected: ${accounts[0].substring(0, 6)}...${accounts[0].slice(-4)}`, 'success');
    } catch {
      Swal.fire('Error', 'Wallet connection failed', 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!contract || !provider) return Swal.fire('Error', 'Ethereum provider not initialized', 'error');
    if (!account) return Swal.fire('Error', 'Please connect your wallet first', 'error');

    const durationSeconds = parseInt(formData.duration, 10);
    if (isNaN(durationSeconds) || durationSeconds <= 0) {
      Swal.fire('Invalid Duration', 'Please enter a valid duration in seconds', 'warning');
      return;
    }

    setTxStatus('Creating auction on blockchain...');

    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // Assuming contract ABI is updated: createAuction(name, seller, startingBid, duration, description, imageUrl)
      const tx = await contractWithSigner.createAuction(
        formData.name,
        formData.seller,
        ethers.utils.parseEther(formData.startingBid.toString()),
        durationSeconds,
        formData.description,
        formData.imageUrl
      );

      await tx.wait();
      setTxStatus('');
      Swal.fire('Success', `Auction "${formData.name}" created successfully!`, 'success');

      setFormData({
        name: '',
        seller: '',
        startingBid: '',
        duration: '',
        description: '',
        imageUrl: '',
      });
    } catch (err) {
      setTxStatus('');
      Swal.fire('Error', 'Transaction failed: ' + (err.message || err), 'error');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center px-10 py-20">
      <div className="bg-gradient-to-tr from-purple-800/70 to-cyan-800/70 backdrop-blur-md rounded-3xl p-14 max-w-3xl w-full shadow-xl border border-purple-700">
        <h1 className="text-5xl font-extrabold text-white mb-12 text-center">Admin Dashboard - Create Auction</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-white">
          {/* Name */}
          <div>
            <label className="block mb-3 font-semibold text-lg">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg px-4 py-3 bg-slate-800" required />
          </div>
          {/* Seller */}
          <div>
            <label className="block mb-3 font-semibold text-lg">Seller</label>
            <input type="text" name="seller" value={formData.seller} onChange={handleChange} className="w-full rounded-lg px-4 py-3 bg-slate-800" required />
          </div>
          {/* Starting Bid */}
          <div>
            <label className="block mb-3 font-semibold text-lg">Starting Bid (ETH)</label>
            <input type="number" name="startingBid" value={formData.startingBid} onChange={handleChange} min="0" step="0.01" className="w-full rounded-lg px-4 py-3 bg-slate-800" required />
          </div>
          {/* Duration */}
          <div>
            <label className="block mb-3 font-semibold text-lg">Duration (seconds)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" className="w-full rounded-lg px-4 py-3 bg-slate-800" required />
          </div>
          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-3 font-semibold text-lg">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full rounded-lg px-4 py-3 bg-slate-800" required />
          </div>
          {/* Image */}
{/*           <div className="md:col-span-2">
            <label className="block mb-3 font-semibold text-lg">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} required />
            {uploadingImage && <p className="text-sm mt-2 text-cyan-400">Uploading image...</p>}
            {formData.imageUrl && (
              <div className="flex justify-center">
                <img src={formData.imageUrl} alt="Preview" className="mt-4 h-48 w-48 object-cover rounded-full border-4 border-cyan-400 shadow-lg" />
              </div>
            )}
          </div> */}
          {/* Submit */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              disabled={!isValid || !account || !!txStatus}
              className={`w-full md:w-1/3 py-4 font-bold rounded-full shadow-lg transition-transform ${
                isValid && account && !txStatus 
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              {txStatus || 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
