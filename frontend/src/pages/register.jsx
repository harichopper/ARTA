import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = 'Username is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 4) newErrors.password = 'Password must be at least 4 characters.';
    if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Registered successfully!',
            text: 'You will be redirected to login page.',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
              navigate('/login');
            },
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration failed',
            text: data.message || 'Something went wrong.',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Registration failed',
          text: 'Server error. Please try again later.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6 pt-24 pb-8">
      <div className="bg-gradient-to-tr from-purple-800/70 to-cyan-800/70 backdrop-blur-md rounded-3xl p-12 max-w-md w-full shadow-xl border border-purple-700">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Username */}
          <div>
            <label htmlFor="username" className="block mb-3 text-white font-semibold text-lg">
              Username
            </label>
            <div
              className={`flex items-center bg-slate-800 rounded-lg px-4 py-3 transition ${
                errors.username ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-cyan-400'
              }`}
            >
              <User className="text-cyan-400 mr-3" size={20} />
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full text-lg"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 mt-1 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-3 text-white font-semibold text-lg">
              Email Address
            </label>
            <div
              className={`flex items-center bg-slate-800 rounded-lg px-4 py-3 transition ${
                errors.email ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-cyan-400'
              }`}
            >
              <Mail className="text-cyan-400 mr-3" size={20} />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full text-lg"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-3 text-white font-semibold text-lg">
              Password
            </label>
            <div
              className={`flex items-center bg-slate-800 rounded-lg px-4 py-3 transition ${
                errors.password ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-purple-500'
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
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-3 text-white font-semibold text-lg">
              Confirm Password
            </label>
            <div
              className={`flex items-center bg-slate-800 rounded-lg px-4 py-3 transition ${
                errors.confirmPassword ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-purple-500'
              }`}
            >
              <Lock className="text-purple-400 mr-3" size={20} />
              <input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full text-lg"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 mt-1 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
