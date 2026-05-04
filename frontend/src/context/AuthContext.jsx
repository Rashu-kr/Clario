import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check persistent storage on mount
  useEffect(() => {
    const local = localStorage.getItem('clario_user');
    const session = sessionStorage.getItem('clario_user');
    const stored = local || session;
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const login = (email, password, rememberMe = false) => {
    const mockUser = { id: 1, name: 'Demo User', email };
    setUser(mockUser);
    if (rememberMe) {
      localStorage.setItem('clario_user', JSON.stringify(mockUser));
    } else {
      sessionStorage.setItem('clario_user', JSON.stringify(mockUser));
    }
    return Promise.resolve(mockUser);
  };

  const register = (name, email, password) => {
    const mockUser = { id: Date.now(), name, email };
    setUser(mockUser);
    sessionStorage.setItem('clario_user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clario_user');
    sessionStorage.removeItem('clario_user');
  };

  const forgotPassword = (email) => {
    return new Promise(resolve => setTimeout(resolve, 1200));
  };

  const resetPassword = (newPassword) => {
    return new Promise(resolve => setTimeout(resolve, 1200));
  };

  // Show a full-screen loader while hydrating auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-light)]"></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin"></div>
          </div>
          <span className="text-sm text-[var(--text-muted)] font-medium tracking-wide">Loading Clario…</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
