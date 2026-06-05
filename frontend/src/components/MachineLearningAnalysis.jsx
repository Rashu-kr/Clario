
/**
 * MachineLearningAnalysis Component
 * Lists extracted document chunks and highlights their classified risk level and clause type.
 */
export const MachineLearningAnalysis = ({ mlAnalysis, getRiskBadgeClass }) => {
  if (!mlAnalysis || mlAnalysis.length === 0) return null;

  return (
    <section className="animate-fade-up delay-100">
      <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Machine Learning Analysis
      </h3>

      <div className="space-y-4">
        {mlAnalysis.slice(0, 5).map((item) => (
          <div key={item.chunk_index} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-subtle)] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Chunk {item.chunk_index}
              </span>

              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getRiskBadgeClass(item.risk_level)}`}>
                {item.risk_level} Risk
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-4">
              {item.chunk}
            </p>

            <div className="mt-3">
              <span className="inline-flex rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-3 py-1 text-[11px] font-semibold text-[#3B82F6]">
                {item.clause_type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
