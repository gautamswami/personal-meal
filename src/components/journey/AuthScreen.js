'use client';

import { useState } from 'react';

export default function AuthScreen({ onAuthenticated }) {
  const [username, setUsername] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!username.trim()) {
      setAuthError('Username is required');
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        onAuthenticated({ token: data.token, username: data.username });
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch {
      setAuthError('Failed to authenticate. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="journey-shell flex items-center justify-center p-4 min-h-dvh">
      <div className="journey-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest text-[#8e8e93] uppercase mb-2">Journey</p>
          <h1 className="text-2xl font-bold text-white mb-2">
            {authMode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-[#8e8e93]">Sign in with a username to sync your progress</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm text-[#aeaeb2] mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-xl bg-[#2c2c2e] border border-[#3a3a3c] text-white focus:outline-none focus:ring-1 focus:ring-[#a3e635]"
              required
            />
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#a3e635] text-black font-semibold disabled:opacity-50"
          >
            {submitting ? '…' : authMode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
              setAuthError('');
            }}
            className="text-[#a3e635] text-sm font-medium"
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
