
const PROCESSING_STEPS = [
  "Securely uploading...",
  "Reading document...",
  "Extracting key clauses...",
  "Running ML risk analysis...",
  "Preparing summary..."
];

/**
 * AIProcessingSpinner Component
 * Displays steps/status items when a document is being processed.
 */
export const AIProcessingSpinner = ({ processingStepIndex, uploadProgress }) => {
  const progressPercent = uploadProgress || ((processingStepIndex + 1) / PROCESSING_STEPS.length) * 100;

  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
      <div className="text-center w-full max-w-md relative">
        <div className="absolute inset-0 bg-[#3B82F6]/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        <div className="relative z-10 glass-card-premium p-12 rounded-3xl border border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden">
          <div className="absolute bottom-0 left-0 h-1.5 bg-[#3B82F6] transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }}></div>

          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-light)]"></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#3B82F6] border-t-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#3B82F6] animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 tracking-tight">Analyzing Document</h2>

          <div className="space-y-3 text-left max-w-[250px] mx-auto">
            {PROCESSING_STEPS.map((stepStr, i) => {
              const isCompleted = i < processingStepIndex;
              const isActive = i === processingStepIndex;

              return (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${isActive ? 'text-[var(--text-main)] scale-105 font-medium' : isCompleted ? 'text-[#10B981]' : 'text-[var(--text-muted)] opacity-50'}`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-4 h-4 shrink-0 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin"></div>
                  ) : (
                    <div className="w-4 h-4 shrink-0 rounded-full border-2 border-[var(--border-light)]"></div>
                  )}

                  {stepStr}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
