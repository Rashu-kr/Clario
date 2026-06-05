
/**
 * ErrorAlert Component
 * Renders document ingestion or analysis failure alert messages.
 */
export const ErrorAlert = ({ apiError, resetAnalyzer }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="glass-card-premium rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">Upload Failed</h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">{apiError}</p>

          <button onClick={resetAnalyzer} className="btn-glow w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
