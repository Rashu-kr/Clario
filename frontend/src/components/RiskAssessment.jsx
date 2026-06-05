
/**
 * RiskAssessment Component
 * Shows risk score counts breakdown and overall audit status.
 */
export const RiskAssessment = ({ riskCounts, overallRisk, getRiskBadgeClass }) => {
  return (
    <section className="animate-fade-up delay-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          ML Risk Assessment
        </h3>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskBadgeClass(overallRisk)}`}>
          {overallRisk} Risk
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">{riskCounts.high}</div>
          <div className="text-[11px] text-[var(--text-muted)]">High</div>
        </div>

        <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-center">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{riskCounts.medium}</div>
          <div className="text-[11px] text-[var(--text-muted)]">Medium</div>
        </div>

        <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/10 p-3 text-center">
          <div className="text-lg font-bold text-[#10B981]">{riskCounts.low}</div>
          <div className="text-[11px] text-[var(--text-muted)]">Low</div>
        </div>
      </div>

      <div className="bg-[var(--bg-subtle)] border border-[var(--border-light)] rounded-2xl p-5 shadow-sm">
        <h4 className="font-semibold text-[var(--text-main)] text-sm mb-2">
          Custom Machine Learning Output
        </h4>

        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Document chunks are classified using your trained TF-IDF + Logistic Regression models.
        </p>
      </div>
    </section>
  );
};
