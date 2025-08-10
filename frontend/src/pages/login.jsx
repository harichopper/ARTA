import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('user'); // 'user' or 'admin'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'admin') {
      // Admin login validation
      if (emailOrName.trim() === 'admin@gmail.com' && password === 'Admin@123') {
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome, Admin!',
          timer: 1500,
          showConfirmButton: false,
        });
        sessionStorage.setItem('mode', 'admin');
        sessionStorage.removeItem('email');
        navigate('/admin');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Credentials',
          text: 'Please check your admin username and password.',
        });
      }
    } else {
      // User login logic
      await Swal.fire({
        icon: 'success',
        title: 'Logged In',
        html: `Email: <strong>${emailOrName}</strong>`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Save user info in sessionStorage
      sessionStorage.setItem('mode', 'user');
      sessionStorage.setItem('email', emailOrName);

      // Redirect or do something else here if needed
      // For example, navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6 pt-12">
      <div className="bg-gradient-to-tr from-purple-800/70 to-cyan-800/70 backdrop-blur-md rounded-3xl p-12 max-w-md w-full shadow-xl border border-purple-700">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-8 gap-8">
          <button
            onClick={() => {
              setMode('user');
              setEmailOrName('');
              setPassword('');
            }}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              mode === 'user'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-transparent text-gray-300 hover:text-white'
            }`}
            aria-pressed={mode === 'user'}
          >
            User
          </button>
          <button
            onClick={() => {
              setMode('admin');
              setEmailOrName('');
              setPassword('');
            }}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              mode === 'admin'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-transparent text-gray-300 hover:text-white'
            }`}
            aria-pressed={mode === 'admin'}
          >
            Admin
          </button>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          {mode === 'user' ? 'User Login' : 'Admin Login'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="emailOrName"
              className="block mb-3 text-white font-semibold text-lg"
            >
              {mode === 'user' ? 'Email Address' : 'Admin Name'}
            </label>
            <div
              className={`flex items-center rounded-lg px-4 py-3 focus-within:ring-2 transition ${
                mode === 'user'
                  ? 'bg-slate-800 focus-within:ring-cyan-400'
                  : 'bg-slate-800 focus-within:ring-purple-500'
              }`}
            >
              <User
                className={`mr-3 ${
                  mode === 'user' ? 'text-cyan-400' : 'text-purple-400'
                }`}
                size={20}
              />
              <input
                type={mode === 'user' ? 'email' : 'text'}
                id="emailOrName"
                required
                value={emailOrName}
                onChange={(e) => setEmailOrName(e.target.value)}
                placeholder={mode === 'user' ? 'you@example.com' : 'admin@gmail.com'}
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full text-lg"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-3 text-white font-semibold text-lg"
            >
              Password
            </label>
            <div
              className={`flex items-center rounded-lg px-4 py-3 focus-within:ring-2 transition ${
                mode === 'user'
                  ? 'bg-slate-800 focus-within:ring-purple-500'
                  : 'bg-slate-800 focus-within:ring-purple-500'
              }`}
            >
              <Lock className="text-purple-400 mr-3" size={20} />
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        {/* Show register link only in user mode */}
        {mode === 'user' && (
          <p className="mt-6 text-center text-gray-400">
            Don’t have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
