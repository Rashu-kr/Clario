import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

const calculateStrength = (pwd) => {
  if (!pwd) return { level: 0, text: '', color: '', bgColor: 'bg-transparent' };
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

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = calculateStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim()) newErrors.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email.';
    if (!password) newErrors.password = 'Password is required.';
    else if (strength.level < 2) newErrors.password = 'Password is too weak. Add uppercase, numbers, and symbols.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!agreedToTerms) newErrors.terms = 'You must agree to the Terms of Service.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1300));
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const fieldClass = (fieldError) =>
    `w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border ${
      fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-[var(--border-light)] focus:border-[#3B82F6] focus:ring-[#3B82F6]/30'
    } text-[var(--text-main)] rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm placeholder:text-[var(--text-muted)]`;

  return (
    <div className="glass-card-premium card-glow p-8 md:p-10 rounded-3xl animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold mb-2 text-[var(--text-main)] tracking-tight">Create Account</h1>
        <p className="text-[var(--text-muted)] text-sm">Join Clario and start analyzing documents instantly.</p>
      </div>

      {/* Google OAuth */}
      <button
        id="google-signup-btn"
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-[var(--bg-main)] hover:bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-light)] hover:border-[#3B82F6]/40 transition-all duration-200 rounded-xl py-3 font-semibold mb-6 shadow-sm"
      >
        <GoogleIcon />
        <span>Sign up with Google</span>
      </button>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-[var(--border-light)]"></div>
        <span className="px-4 text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Or continue with email</span>
        <div className="flex-1 border-t border-[var(--border-light)]"></div>
      </div>

      {/* Form-level error */}
      {errors.form && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-sm font-medium">{errors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-main)]" htmlFor="reg-name">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="reg-name"
              className={fieldClass(errors.name)}
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-main)]" htmlFor="reg-email">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              id="reg-email"
              className={fieldClass(errors.email)}
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-main)]" htmlFor="reg-password">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="reg-password"
              className={`${fieldClass(errors.password)} pr-12`}
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {/* Password Strength */}
          {password && (
            <div className="mt-3">
              <div className="flex gap-1.5 mb-1.5">
                {[1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      strength.level >= level ? strength.bgColor : 'bg-[var(--border-light)]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
                <span className="text-[var(--text-muted)]">Use 8+ chars, uppercase, numbers &amp; symbols</span>
              </div>
            </div>
          )}
          {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-main)]" htmlFor="reg-confirm-password">Confirm Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {passwordsMatch ? (
                <svg className="w-5 h-5 text-[#10B981] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              id="reg-confirm-password"
              className={`${fieldClass(errors.confirmPassword || passwordsMismatch)} pr-12 ${passwordsMatch ? '!border-[#10B981] !focus:ring-[#10B981]/30' : ''}`}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 pt-1">
          <button
            type="button"
            id="terms-toggle"
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
              agreedToTerms
                ? 'bg-[#3B82F6] border-[#3B82F6]'
                : errors.terms
                  ? 'border-red-500'
                  : 'border-[var(--border-light)] hover:border-[#3B82F6]/50'
            }`}
            aria-label="Agree to terms"
          >
            {agreedToTerms && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <p
            className="text-sm text-[var(--text-muted)] cursor-pointer leading-relaxed"
            onClick={() => setAgreedToTerms(!agreedToTerms)}
          >
            I agree to Clario's{' '}
            <span className="text-[#3B82F6] hover:text-[#2563EB] transition-colors font-semibold" onClick={e => e.stopPropagation()}>Terms of Service</span>
            {' '}and{' '}
            <span className="text-[#3B82F6] hover:text-[#2563EB] transition-colors font-semibold" onClick={e => e.stopPropagation()}>Privacy Policy</span>
          </p>
        </div>
        {errors.terms && <p className="text-red-500 text-xs font-medium flex items-center gap-1"><svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{errors.terms}</p>}

        {/* Submit */}
        <button
          type="submit"
          id="register-submit-btn"
          disabled={isSubmitting}
          className="btn-glow w-full mt-2 py-3.5 text-base font-semibold relative flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon />
              <span>Creating account…</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Trust */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
        <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="font-medium tracking-wide">Secure &bull; Private &bull; Encrypted</span>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)] font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-[#3B82F6] hover:text-[#2563EB] transition-colors font-semibold">
          Sign in here
        </Link>
      </p>
    </div>
  );
};
