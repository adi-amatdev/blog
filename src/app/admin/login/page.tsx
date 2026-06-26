'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, KeyRound } from 'lucide-react';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const redirect = searchParams.get('redirect') || '/admin';
      router.push(redirect);
      return;
    }

    const data = await res.json();
    if (data.needsSetup) {
      setNeedsSetup(true);
      setError('');
    } else {
      setError(data.error || 'Invalid password');
    }
    setLoading(false);
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to set password');
      setLoading(false);
    }
  }

  if (needsSetup) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <KeyRound size={24} className="text-accent" />
            <h1 className="text-2xl font-bold tracking-tight">Set Password</h1>
          </div>
          <p className="text-sm text-muted mb-6 text-center">
            No admin password is set. Create one to secure the admin panel.
          </p>
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium mb-1">New Password</label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                minLength={8}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                minLength={8}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              <KeyRound size={16} />
              {loading ? 'Setting password...' : 'Set Password & Log In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center text-muted">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
