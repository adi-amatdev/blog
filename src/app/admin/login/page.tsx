'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn } from 'lucide-react';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
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
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid password');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
