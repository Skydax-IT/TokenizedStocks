'use client';

import { useState } from 'react';

interface NewsletterFormProps {
  className?: string;
}

export default function NewsletterForm({ className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [honeypot, setHoneypot] = useState(''); // Hidden field for anti-spam

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!consent) {
      setState('error');
      setMessage('Please accept the terms and conditions to continue.');
      return;
    }

    setState('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          consent, 
          honeypot,
          source: 'dashboard'
        })
      });

      const json = await res.json();

      if (!res.ok) {
        setState('error');
        setMessage(json?.error ?? 'Subscription failed. Please try again.');
        return;
      }

      setState('success');
      setMessage(json?.message || 'Thanks! Please check your inbox.');
      setEmail('');
      setConsent(false);
    } catch (error) {
      setState('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Stay Updated</h3>
        <p className="text-sm text-gray-600 mt-1">
          Get weekly insights on tokenization and real-world assets. No spam, unsubscribe anytime.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute left-[-9999px]"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors"
            disabled={state === 'loading'}
          />
        </div>

        {/* GDPR Consent */}
        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
            disabled={state === 'loading'}
          />
          <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
            I consent to receiving email updates from Tokenized Stocks Dashboard. 
            I understand that I can unsubscribe at any time. 
            <span className="text-gray-500 text-xs block mt-1">
              By checking this box, you agree to our{' '}
              <a href="#" className="text-brand-600 hover:text-brand-700 underline">
                Privacy Policy
              </a>{' '}
              and consent to the processing of your email address for newsletter purposes.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={state === 'loading' || !consent}
          className="w-full btn-gradient py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
        >
          {state === 'loading' ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Subscribing...
            </div>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>
      </form>

      {/* Status Messages */}
      {state !== 'idle' && (
        <div
          className={`p-4 rounded-lg border ${
            state === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : state === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : ''
          }`}
        >
          <div className="flex items-start gap-3">
            {state === 'success' ? (
              <svg className="h-5 w-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
              {state === 'success' && (
                <p className="text-xs text-green-700 mt-1">
                  We've sent a confirmation email. Please check your inbox and spam folder.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>🔒 Your data is protected and never shared with third parties</p>
        <p>📧 You can unsubscribe at any time with one click</p>
        <p>⚡ Get insights delivered straight to your inbox</p>
      </div>
    </div>
  );
}
