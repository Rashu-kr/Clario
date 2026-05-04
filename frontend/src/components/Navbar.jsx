import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <svg viewBox="0 0 40 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logo-grad-nav)" />
      <path d="M12 28V12L28 20L12 28Z" fill="#FFFFFF" />
      <circle cx="28" cy="20" r="4" fill="#60A5FA" />
      <defs>
        <linearGradient id="logo-grad-nav" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
    </svg>
    <span className="font-sans text-2xl font-bold tracking-tight text-[var(--text-main)] group-hover:text-[#3B82F6] transition-colors duration-300">
      Clario
    </span>
  </Link>
);

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`relative text-sm font-medium transition-colors duration-200 px-1 py-0.5 ${
      active
        ? 'text-[#3B82F6]'
        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
    }`}
  >
    {children}
    {active && (
      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#3B82F6] rounded-full" />
    )}
  </Link>
);

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <NavLink to="/#how-it-works">How it Works</NavLink>
                <NavLink to="/#features">Features</NavLink>
                <NavLink to="/#security">Security</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
                <NavLink to="/app" active={isActive('/app')}>Upload</NavLink>
              </>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all rounded-full hover:bg-[var(--border-light)] hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  id="get-started-nav-btn"
                  className="btn-primary py-2.5 px-5 text-sm rounded-xl"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-1 pl-3 border-l border-[var(--border-light)]">
                {/* Avatar Dropdown */}
                <div className="relative">
                  <button
                    id="user-avatar-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[var(--border-light)] transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#3B82F6]/20">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-semibold text-[var(--text-main)] leading-tight">{user?.name}</div>
                      <div className="text-xs text-[var(--text-muted)] leading-tight truncate max-w-[120px]">{user?.email}</div>
                    </div>
                    <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border-light)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-up">
                      <div className="px-4 py-3.5 border-b border-[var(--border-light)] bg-[var(--bg-subtle)]/50">
                        <div className="font-semibold text-sm text-[var(--text-main)] truncate">{user?.name}</div>
                        <div className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user?.email}</div>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--border-light)] rounded-xl transition-colors">
                          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link to="/app" className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--border-light)] rounded-xl transition-colors">
                          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Document
                        </Link>
                      </div>
                      <div className="p-1.5 border-t border-[var(--border-light)]">
                        <button
                          id="navbar-logout-btn"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors rounded-full">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-main)] rounded-xl hover:bg-[var(--border-light)] transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[var(--bg-main)]/97 backdrop-blur-xl pt-24 px-6 flex flex-col">
          {!isAuthenticated ? (
            <>
              <div className="flex flex-col gap-1 mb-8">
                {[['/#how-it-works', 'How it Works'], ['/#features', 'Features'], ['/#security', 'Security']].map(([to, label]) => (
                  <Link key={to} to={to} className="text-2xl font-bold text-[var(--text-main)] py-3 border-b border-[var(--border-light)]">
                    {label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pb-12 flex flex-col gap-3">
                <Link to="/login" className="btn-secondary w-full text-center py-4 text-base">Sign In</Link>
                <Link to="/register" className="btn-primary w-full text-center py-4 text-base rounded-xl">Get Started</Link>
              </div>
            </>
          ) : (
            <>
              {/* User Info */}
              <div className="flex items-center gap-4 pb-6 mb-2 border-b border-[var(--border-light)]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-bold text-[var(--text-main)] text-lg">{user?.name}</div>
                  <div className="text-sm text-[var(--text-muted)]">{user?.email}</div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {[
                  ['/dashboard', 'Dashboard', isActive('/dashboard')],
                  ['/app', 'Upload Document', isActive('/app')],
                ].map(([to, label, active]) => (
                  <Link
                    key={to}
                    to={to}
                    className={`text-xl font-bold py-3.5 border-b border-[var(--border-light)] transition-colors ${
                      active ? 'text-[#3B82F6]' : 'text-[var(--text-main)]'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="mt-auto mb-12 text-xl font-bold text-red-500 text-left py-3.5 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </>
  );
};
