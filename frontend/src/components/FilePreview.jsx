
/**
 * FilePreview Component
 * Renders selected file size and options before processing starts.
 */
export const FilePreview = ({ file, privacyMode, setPrivacyMode, startProcessing, resetAnalyzer }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-xl">
        <div className="glass-card-premium rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={resetAnalyzer} className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-[var(--text-main)] mb-1 truncate px-8">{file?.name}</h3>
          <p className="text-sm text-[var(--text-muted)] mb-10">
            {file ? (file.size / (1024 * 1024)).toFixed(2) : 0} MB • Ready for analysis
          </p>

          <div className="flex items-center justify-between p-4 mb-10 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] shadow-inner text-left">
            <div>
              <div className="text-sm font-semibold text-[var(--text-main)] mb-0.5">Privacy Mode</div>
              <div className="text-xs text-[var(--text-muted)]">Auto-delete from servers immediately after session.</div>
            </div>

            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${privacyMode ? 'bg-[#10B981]' : 'bg-[var(--border-light)]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${privacyMode ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <button onClick={startProcessing} className="btn-glow w-full text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
