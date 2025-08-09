import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    seller: '',
    highestBid: '',
    endTime: '',
    highestBidder: '',
    description: '',
  });

  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Check if all required fields have values (non-empty)
  useEffect(() => {
    const requiredFields = [
      'name',
      'seller',
      'highestBid',
      'endTime',
      'highestBidder',
      'description',
    ];
    const allFieldsFilled = requiredFields.every(
      (field) => formData[field] && formData[field].toString().trim() !== ''
    );
    setIsValid(allFieldsFilled);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: 'success',
      title: 'Auction Updated',
      text: `Auction "${formData.name}" updated successfully!`,
      confirmButtonColor: '#6366F1', // purple-600
    });

    // Optional: Reset form after submission
    // setFormData({
    //   name: '',
    //   seller: '',
    //   highestBid: '',
    //   endTime: '',
    //   highestBidder: '',
    //   description: '',
    // });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-10 py-20">
      <div className="bg-gradient-to-tr from-purple-800/70 to-cyan-800/70 backdrop-blur-md rounded-3xl p-14 max-w-7xl w-full shadow-xl border border-purple-700">
        <h1 className="text-5xl font-extrabold text-white mb-12 text-center tracking-wide">
          Admin Dashboard
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-white">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-3 font-semibold text-lg">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Auction Item Name"
              className="w-full rounded-lg px-4 py-3 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* Seller */}
          <div>
            <label htmlFor="seller" className="block mb-3 font-semibold text-lg">
              Seller
            </label>
            <input
              type="text"
              name="seller"
              id="seller"
              value={formData.seller}
              onChange={handleChange}
              placeholder="Seller Name"
              className="w-full rounded-lg px-4 py-3 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* Highest Bid */}
          <div>
            <label htmlFor="highestBid" className="block mb-3 font-semibold text-lg">
              Highest Bid
            </label>
            <input
              type="number"
              name="highestBid"
              id="highestBid"
              value={formData.highestBid}
              onChange={handleChange}
              placeholder="Current Highest Bid"
              className="w-full rounded-lg px-4 py-3 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              min="0"
              required
            />
          </div>

          {/* End Time (Text Input) */}
          <div>
            <label htmlFor="endTime" className="block mb-3 font-semibold text-lg">
              End Time 
            </label>
            <input
              type="text"
              name="endTime"
              id="endTime"
              value={formData.endTime}
              onChange={handleChange}
              placeholder="Enter end time"
              className="w-full rounded-lg px-4 py-3 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* Highest Bidder */}
          <div>
            <label htmlFor="highestBidder" className="block mb-3 font-semibold text-lg">
              Highest Bidder
            </label>
            <input
              type="text"
              name="highestBidder"
              id="highestBidder"
              value={formData.highestBidder}
              onChange={handleChange}
              placeholder="Highest Bidder's Name"
              className="w-full rounded-lg px-4 py-3 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-3 font-semibold text-lg">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Auction Item Description"
              className="w-full rounded-lg px-4 py-3 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* Submit Button spans both columns */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full md:w-1/3 py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105
                ${
                  isValid
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }
              `}
            >
              Update Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
