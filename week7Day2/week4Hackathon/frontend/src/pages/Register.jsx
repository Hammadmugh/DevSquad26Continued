import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.register(email, password);
      
      // Remove any leftover subscription state from signup
      localStorage.removeItem('userSubscription');
      
      // Check for redirect to subscription after Play Now click
      const redirectToSubscription = localStorage.getItem('redirectToSubscription');
      
      if (redirectToSubscription) {
        // User clicked Play Now, so redirect to subscriptions after login
        navigate('/login', { state: { redirectToSubscription: true } });
      } else {
        // Regular signup - user has NO subscription by default
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h1 className="text-2xl font-bold text-white mb-1">Join StreamVibe</h1>
          <p className="text-neutral-400 text-sm">Create your account</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500/50 text-white px-3 py-2 rounded-lg mb-4 text-xs">
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

            <div>
              <label className="block text-neutral-300 font-medium mb-1 text-sm">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-neutral-400 text-center text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-neutral-300 font-semibold transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
