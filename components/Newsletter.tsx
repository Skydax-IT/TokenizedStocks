'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      if (!res.ok) {
        setState('error');
        setMessage(json?.error ?? 'Subscription failed');
        return;
      }
      setState('success');
      setMessage('Thanks! Please check your inbox.');
      setEmail('');
    } catch {
      setState('error');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <section className="mt-10">
      <div className="table-card p-6">
        <h3 className="text-lg font-semibold">Join our free newsletter</h3>
        <p className="text-sm text-gray-600 mt-1">
          Weekly insights on tokenization and RWAs. No spam. Unsubscribe anytime.
        </p>

        {/* Beehiiv embed placeholder — replace with your embed snippet */}
        <div className="mt-4 rounded-md border border-dashed border-gray-300 p-4 text-xs text-gray-500">
          Paste your Beehiiv embedded form snippet here (optional). We also provide a direct API
          signup form below.
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-3 sm:flex sm:items-center">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full sm:max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="btn-gradient w-full sm:w-auto"
          >
            {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>

        {state !== 'idle' && (
          <p
            className={`mt-2 text-sm ${
              state === 'success' ? 'text-green-600' : state === 'error' ? 'text-red-600' : ''
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-3 text-xs text-gray-500">
          Note: Replace `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` in `.env` or Vercel project
          settings. See `app/api/newsletter/route.ts`.
        </p>
      </div>
    </section>
  );
}

