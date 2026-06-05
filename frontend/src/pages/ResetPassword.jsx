import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = ({ open }) => open ? (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
) : (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

const calculateStrength = (pwd) => {
  if (!pwd) return { level: 0, text: '', color: 'text-transparent', bgColor: 'bg-transparent' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { level: 1, text: 'Weak', color: 'text-red-500', bgColor: 'bg-red-500' };
  if (score === 3) return { level: 2, text: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
  if (score === 4) return { level: 3, text: 'Good', color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]' };
  return { level: 4, text: 'Strong', color: 'text-[#10B981]', bgColor: 'bg-[#10B981]' };
};

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const strength = calculateStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (strength.level < 2) {
      setError('Please choose a stronger password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    await resetPassword(password);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="glass-card-premium card-glow p-8 md:p-10 rounded-3xl animate-fade-up text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-[#10B981]/20 rounded-full animate-ping opacity-40"></div>
          <div className="relative w-20 h-20 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold mb-3 text-[var(--text-main)] tracking-tight">Password Updated!</h1>
        <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
          Your password has been successfully reset.<br />You can now sign in with your new password.
        </p>
        <Link
          to="/login"
          id="sign-in-now-btn"
          className="btn-glow w-full py-3.5 text-base font-semibold relative inline-flex items-center justify-center gap-2"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card-premium card-glow p-8 md:p-10 rounded-3xl animate-fade-up">
      {/* Icon */}
      <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold mb-2 text-[var(--text-main)] tracking-tight">Create New Password</h1>
        <p className="text-[var(--text-muted)] text-sm">Your new password must be different from previously used passwords.</p>
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
        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-main)]" htmlFor="reset-password">
            New Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="reset-password"
              className="w-full pl-11 pr-12 py-3 bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--text-main)] rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all shadow-sm placeholder:text-[var(--text-muted)]"
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {/* Strength Indicator */}
          {password && (
            <div className="mt-3">
              <div className="flex gap-1.5 mb-2">
                {[1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-400 ${
                      strength.level >= level ? strength.bgColor : 'bg-[var(--border-light)]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={`font-bold ${strength.color}`}>{strength.text}</span>
                <span className="text-[var(--text-muted)]">8+ chars, uppercase, numbers &amp; symbols</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-main)]" htmlFor="reset-confirm">
            Confirm New Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {passwordsMatch ? (
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className={`w-5 h-5 transition-colors ${passwordsMismatch ? 'text-red-500' : 'text-[var(--text-muted)] group-focus-within:text-[#3B82F6]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              id="reset-confirm"
              className={`w-full pl-11 pr-12 py-3 bg-[var(--bg-main)] border ${
                passwordsMismatch
                  ? 'border-red-500 focus:ring-red-500/30'
                  : passwordsMatch
                    ? 'border-[#10B981] focus:ring-[#10B981]/30'
                    : 'border-[var(--border-light)] focus:ring-[#3B82F6]/30'
              } text-[var(--text-main)] rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-2 transition-all shadow-sm placeholder:text-[var(--text-muted)]`}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {passwordsMismatch && (
            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="text-[#10B981] text-xs mt-1.5 font-medium flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              Passwords match
            </p>
          )}
        </div>

        <button
          type="submit"
          id="reset-password-submit-btn"
          disabled={isSubmitting || passwordsMismatch || strength.level < 2}
          className="btn-glow w-full mt-2 py-3.5 text-base font-semibold relative flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon />
              <span>Resetting password…</span>
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
};
