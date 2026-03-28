import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      // Check for redirect to subscription after Play Now click
      const redirectToSubscription = localStorage.getItem('redirectToSubscription');
      
      // Check if user is admin
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (redirectToSubscription) {
        // User clicked Play Now, so redirect to subscriptions
        localStorage.removeItem('redirectToSubscription');
        navigate('/subscriptions');
      } else {
        // Regular login, redirect to homepage
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="StreamVibe" className="h-10 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-neutral-400 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg mb-4 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-neutral-300 font-medium mb-1 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 border border-neutral-700 hover:border-neutral-600 disabled:opacity-50 text-white font-semibold py-2.5 text-sm rounded-lg transition duration-200 mt-5"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-neutral-400 text-center text-sm mt-5">
            Don't have an account?{' '}
            <a href="/register" className="text-white hover:text-neutral-300 font-semibold transition">
              Register
            </a>
          </p>
        </div>

        {/* Admin Credentials Note */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 font-semibold text-xs mb-2"> CREDENTIALS (Admin)</p>
          <div className="space-y-1 text-xs text-blue-300">
            <p><span className="font-semibold">Email:</span> hammad@gmail.com</p>
            <p><span className="font-semibold">Password:</span> Hammad@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
