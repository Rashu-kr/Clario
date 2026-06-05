
/**
 * LocalAIInitializer Component
 * Displays progress of WASM model loading/cache initialization.
 */
export const LocalAIInitializer = ({ modelStatusText, modelProgress }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-xl animate-fade-up">
        <div className="glass-card-premium rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent animate-pulse-slow"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--border-light)]"></div>
              <div className="absolute inset-0 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin" style={{ animationDuration: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#3B82F6] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14c1.49 0 2.702-1.228 2.5-2.73C21.758 9.143 19.82 8 18 8h-.079c-.563-2.18-2.402-4-4.921-4-2.857 0-5.13 2.228-5 5.069C4.982 9.176 3 11.238 3 13.5c0 2.485 2.015 4.5 4.5 4.5h12" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[var(--text-main)]">Initializing Local AI Model Cache</h3>
            <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto leading-relaxed text-sm">
              {modelStatusText}
            </p>
            <div className="w-full bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border-light)] mb-2 relative">
              <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all duration-300" style={{ width: `${modelProgress}%` }}></div>
            </div>
            <span className="text-xs font-semibold text-[#3B82F6]">{modelProgress}% Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
