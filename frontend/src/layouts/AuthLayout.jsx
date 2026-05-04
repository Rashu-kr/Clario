import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 relative z-20">
      <svg viewBox="0 0 40 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logo-grad-auth)" />
        <path d="M12 28V12L28 20L12 28Z" fill="#FFFFFF" />
        <circle cx="28" cy="20" r="4" fill="#60A5FA" />
        <defs>
          <linearGradient id="logo-grad-auth" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-sans text-2xl font-bold tracking-tight text-[var(--text-main)]">Clario</span>
    </div>
  );
};

export const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-[var(--bg-main)] font-sans transition-colors duration-500 overflow-hidden relative">
      
      {/* Global Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none parallax-layer-1">
        <div className="smoke-layer"></div>
        <div className="particle-layer"></div>
      </div>

      {/* Theme Toggle Navbar (Absolute) */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
        <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#3B82F6] hover:border-[#3B82F6]/50 transition-all shadow-sm">
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>
      </div>

      {/* Left side - Form Container */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center px-6 sm:px-12 relative z-10 pt-20 lg:pt-0">
        <div className="w-full max-w-md mx-auto relative">
          <Outlet />
        </div>
      </div>

      {/* Right side - Trust Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] relative items-center justify-center p-12 overflow-hidden border-l border-[var(--border-light)] bg-[var(--bg-subtle)]/50 backdrop-blur-sm z-10">
        
        {/* Abstract Glowing Orbs in Trust Panel */}
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#3B82F6]/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-[#10B981]/15 rounded-full blur-[90px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 w-full max-w-md animate-fade-in delay-200">
          
          {/* Glowing Shield Illustration */}
          <div className="w-24 h-24 mx-auto mb-10 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#3B82F6]/20 rounded-full animate-ping opacity-30"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-[#3B82F6]/40 to-[#10B981]/40 rounded-full blur-xl"></div>
            <div className="w-16 h-16 glass-card-premium card-glow rounded-2xl flex items-center justify-center border border-[#3B82F6]/40 shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10">
              <svg className="w-8 h-8 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-[var(--text-main)] mb-4 text-center tracking-tight">
            Enterprise-Grade <br/>Document Analysis
          </h2>
          <p className="text-[var(--text-muted)] text-center mb-10 text-lg">
            Join thousands of professionals who trust Clario's encrypted AI engine to analyze their most important agreements.
          </p>

          <div className="space-y-4">
            <div className="glass-card-premium p-4 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20 shrink-0">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <h4 className="text-[var(--text-main)] font-semibold text-sm">End-to-End Encryption</h4>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">Your files are encrypted during transit and processing.</p>
              </div>
            </div>

            <div className="glass-card-premium p-4 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20 shrink-0">
                <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <h4 className="text-[var(--text-main)] font-semibold text-sm">Private AI Analysis</h4>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">Isolated inference models ensure data privacy.</p>
              </div>
            </div>

            <div className="glass-card-premium p-4 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </div>
              <div>
                <h4 className="text-[var(--text-main)] font-semibold text-sm">Auto-Delete After Session</h4>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">Zero retention. Documents wiped permanently.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
