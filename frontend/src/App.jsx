import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LiveAuctions from './pages/LiveAuctions';
import UpcomingAuctions from './pages/UpcomingAuctions';
import PastAuctions from './pages/PastAuctions';
import { Menu, X, Facebook, Twitter, Linkedin, Instagram, User, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/login';
import Register from './pages/register';
import AdminPage from './pages/AdminPage';

// ethers v6 import
import { ethers } from 'ethers';
import { AUCTION_MANAGER_ABI, AUCTION_MANAGER_ADDRESS } from './utils/contract';

// Profile component
function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('mode');
    const storedEmail = sessionStorage.getItem('email');

    if (storedRole === 'admin') {
      navigate('/admin', { replace: true });
    } else if (storedRole === 'user') {
      setRole('user');
      setEmail(storedEmail);
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (role !== 'user') {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-6">
      <div className="bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-xl shadow-2xl p-8 max-w-md w-full text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-purple-900 rounded-full p-4 shadow-lg">
            {/* User Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 14a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0v1a4 4 0 01-8 0v-1m8 0V8a4 4 0 10-8 0v6"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold tracking-wide">Welcome!</h1>

          <p className="text-indigo-100 text-center text-lg">
            <span className="font-semibold">Email:</span>{' '}
            <span className="text-indigo-200 break-all">{email}</span>
          </p>

          <p className="text-indigo-200 text-center max-w-xs">
            This is your personal profile page. Feel free to update your information and explore your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

// Account Dropdown with Logout
function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('mode');
    sessionStorage.removeItem('email');
    setOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 hover:text-cyan-400 transition-colors duration-300"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <User size={24} />
        <span>Account</span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-cyan-100 hover:text-cyan-700 transition"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-800 hover:bg-cyan-100 hover:text-cyan-700 transition"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 hover:text-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuctionsOpen, setIsAuctionsOpen] = useState(false);
  const [chainId, setChainId] = useState(null);

  const shortenAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };

  const getNetworkName = (id) => {
    switch (id) {
      case 43114:
        return 'Avalanche Mainnet';
      case 43113:
        return 'Avalanche Fuji Testnet';
      default:
        return 'Unknown Network';
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setConnectionError('Please install MetaMask');
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainIdHex, 16));
      setConnectionError('');
    } catch (error) {
      setConnectionError('Wallet connection failed');
    }
    setIsConnecting(false);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Connection Error Toast */}
        {connectionError && (
          <div className="fixed top-20 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
            <AlertCircle size={20} />
            <div className="flex flex-col">
              <span className="font-semibold">Connection Issue</span>
              <span className="text-sm">{connectionError}</span>
              {!isMetaMaskInstalled() && (
                <button
                  onClick={() => window.open('https://metamask.io/download/', '_blank')}
                  className="mt-2 bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm font-medium transition duration-200"
                >
                  Install MetaMask
                </button>
              )}
            </div>
            <button
              onClick={() => setConnectionError('')}
              className="ml-2 text-white hover:text-gray-200 text-xl"
              aria-label="Close connection error"
            >
              ×
            </button>
          </div>
        )}

        {/* Social Media Bar */}
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
          {[
            { Icon: Facebook, url: "https://facebook.com/", label: "Facebook" },
            { Icon: Twitter, url: "https://twitter.com/", label: "Twitter" },
            { Icon: Linkedin, url: "https://linkedin.com/", label: "LinkedIn" },
            { Icon: Instagram, url: "https://instagram.com/", label: "Instagram" },
          ].map(({ Icon, url, label }, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-purple-600 transition duration-300"
              aria-label={`Link to ${label}`}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>


        {/* Header */}
        <header className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-40 border-b border-white/10">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
       
            {/* Desktop Nav */}
                {/* Logo + Name */}
      <div className="flex items-center space-x-3">
        <img
          src="/logo.png" // <-- put your logo file inside /public
          alt="ARTA Logo"
          className="h-16 w-16 object-contain"
        />
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          ARTA
        </span>
      </div>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="hover:text-purple-400 transition">
                Home
              </Link>

              {/* Auctions Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 hover:text-purple-400 transition"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-controls="desktop-auctions-menu"
                >
                  Auctions
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id="desktop-auctions-menu"
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50"
                  role="menu"
                  aria-label="Auctions submenu"
                >
                  <Link to="/past-auctions" className="block px-4 py-2 text-gray-800 hover:bg-purple-100" role="menuitem">
                    Previous Auction
                  </Link>
                  <Link to="/live-auctions" className="block px-4 py-2 text-gray-800 hover:bg-purple-100" role="menuitem">
                    Live Auction
                  </Link>
                  {/* <Link to="/upcoming-auctions" className="block px-4 py-2 text-gray-800 hover:bg-purple-100" role="menuitem">
                    Upcoming Auction
                  </Link> */}
                </div>
              </div>

              <Link to="/about" className="hover:text-purple-400 transition">
                About
              </Link>
              <Link to="/contact" className="hover:text-purple-400 transition">
                Contact
              </Link>
            </div>

            {/* Icons and Mobile menu toggle */}
            <div className="flex items-center gap-6 text-white text-lg md:text-sm font-semibold">
              {/* Use AccountDropdown here */}
              <AccountDropdown />

              {/* Connect Wallet Button */}
              {account ? (
                <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-lg px-3 py-2 text-sm">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-sm font-medium">{shortenAddress(account)}</span>
                  <button
                    onClick={disconnectWallet}
                    className="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                    title="Disconnect Wallet"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500 text-sm flex items-center gap-2 transform hover:scale-105"
                  aria-label="Connect wallet"
                  type="button"
                >
                  <Wallet size={16} className={isConnecting ? 'animate-pulse' : ''} />
                  {isConnecting ? 'Opening MetaMask...' : 'Connect MetaMask'}
                </button>
              )}

              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/80 py-4">
              <Link to="/" className="block px-6 py-2 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>

              <button
                onClick={() => setIsAuctionsOpen(!isAuctionsOpen)}
                className="flex justify-between items-center w-full px-6 py-2 hover:text-purple-400"
                aria-expanded={isAuctionsOpen}
                aria-controls="mobile-auctions-submenu"
                aria-haspopup="true"
              >
                Auctions <span className={isAuctionsOpen ? 'rotate-180' : ''}>▼</span>
              </button>
              {isAuctionsOpen && (
                <div id="mobile-auctions-submenu" className="pl-8">
                  <Link to="/past-auctions" className="block py-2 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                    Previous Auction
                  </Link>
                  <Link to="/live-auctions" className="block py-2 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                    Live Auction
                  </Link>
                </div>
              )}

              <Link to="/about" className="block px-6 py-2 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="block px-6 py-2 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>

              {/* Mobile Wallet */}
              <div className="px-6 py-4 border-t border-white/10 mt-2 pt-4">
                {account ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-green-400">Connected: {shortenAddress(account)}</div>
                    {chainId && <div className="text-xs text-gray-300">{getNetworkName(chainId)}</div>}
                    <button
                      onClick={disconnectWallet}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm transition duration-300 w-fit"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition duration-300 text-sm flex items-center gap-2 w-fit transform hover:scale-105"
                  >
                    <Wallet size={16} className={isConnecting ? 'animate-pulse' : ''} />
                    {isConnecting ? 'Opening MetaMask...' : 'Connect MetaMask'}
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live-auctions" element={<LiveAuctions />} />
            {/* <Route path="/upcoming-auctions" element={<UpcomingAuctions />} /> */}
            <Route path="/past-auctions" element={<PastAuctions />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-black/30 py-8 text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Timups. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
