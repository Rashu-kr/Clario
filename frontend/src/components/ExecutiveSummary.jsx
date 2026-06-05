
/**
 * ExecutiveSummary Component
 * Renders the document executive summary and simplicity explain-mode toggles.
 */
export const ExecutiveSummary = ({ summaryContent, explainMode, setExplainMode }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-subtle)] p-1 rounded-lg flex items-center text-sm font-medium border border-[var(--border-light)] shadow-inner">
        {['professional', 'simple', 'eli5'].map((mode) => (
          <button
            key={mode}
            onClick={() => setExplainMode(mode)}
            className={`flex-1 py-1.5 rounded-md capitalize transition-all duration-200 ${explainMode === mode ? 'bg-white dark:bg-[#1E293B] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            {mode}
          </button>
        ))}
      </div>

      <section className="animate-fade-up">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Executive Summary
        </h3>

        <ul className="space-y-4">
          {summaryContent.map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-main)] leading-relaxed">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0 shadow-[0_0_8px_#3B82F6]"></div>
              <div>{text}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
