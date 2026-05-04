import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    await forgotPassword(email);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="glass-card-premium card-glow p-8 md:p-10 rounded-3xl animate-fade-up text-center">
        {/* Animated Success Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-[#10B981]/20 rounded-full animate-ping opacity-40"></div>
          <div className="relative w-20 h-20 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold mb-3 text-[var(--text-main)] tracking-tight">Check your inbox</h1>
        <p className="text-[var(--text-muted)] text-sm mb-2 leading-relaxed">
          We've sent a password reset link to:
        </p>
        <p className="font-bold text-[var(--text-main)] text-base mb-6 bg-[var(--bg-subtle)] px-4 py-2 rounded-lg border border-[var(--border-light)] inline-block">
          {email}
        </p>
        <p className="text-[var(--text-muted)] text-xs mb-8">
          Didn't receive it? Check your spam folder or wait a few minutes.
        </p>

        <Link
          to="/login"
          id="back-to-login-btn"
          className="btn-glow w-full py-3.5 text-base font-semibold relative inline-flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sign In
        </Link>

        <button
          type="button"
          className="mt-4 w-full py-3 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-light)] hover:border-[#3B82F6]/40 rounded-xl transition-all duration-200"
          onClick={() => { setIsSuccess(false); setEmail(''); }}
        >
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card-premium card-glow p-8 md:p-10 rounded-3xl animate-fade-up">
      {/* Icon */}
      <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold mb-2 text-[var(--text-main)] tracking-tight">Forgot Password?</h1>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          No worries. Enter your email and we'll send you a secure reset link.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-main)]" htmlFor="forgot-email">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              id="forgot-email"
              className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--text-main)] rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all shadow-sm placeholder:text-[var(--text-muted)]"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <button
          type="submit"
          id="send-reset-link-btn"
          disabled={isSubmitting}
          className="btn-glow w-full py-3.5 text-base font-semibold relative flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon />
              <span>Sending link…</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Reset Link
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium">
        <Link
          to="/login"
          className="text-[var(--text-muted)] hover:text-[var(--text-main)] inline-flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sign In
        </Link>
      </p>
    </div>
  );
};
