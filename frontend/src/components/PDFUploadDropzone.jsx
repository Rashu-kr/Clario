import { useState } from 'react';

/**
 * PDFUploadDropzone Component
 * Ingests files (PDF, DOCX, TXT) via drag-and-drop or file system browse.
 */
export const PDFUploadDropzone = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fade-up">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-main)] mb-4 tracking-tight">Select a document to analyze</h1>
          <p className="text-lg text-[var(--text-muted)]">Clario's AI will extract insights, summarize risks, and let you chat with the contents.</p>
        </div>

        <div
          className={`glass-card-premium card-glow rounded-3xl p-2 transition-all duration-500 transform ${
            isDragging ? 'scale-[1.02] shadow-[0_0_50px_rgba(59,130,246,0.2)]' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`border-2 border-dashed rounded-2xl p-16 md:p-24 text-center transition-all duration-300 relative overflow-hidden ${
            isDragging ? 'border-[#3B82F6]/50 bg-[#3B82F6]/5' : 'border-[var(--border-light)] hover:border-[#3B82F6]/30 hover:bg-[var(--bg-main)]/50'
          }`}>
            {isDragging && <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-transparent animate-pulse-slow"></div>}

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 mb-8 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-light)] flex items-center justify-center shadow-lg relative">
                <div className="absolute inset-0 rounded-full bg-[#3B82F6]/20 animate-ping opacity-20"></div>
                <svg className="w-10 h-10 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-[var(--text-main)]">
                {isDragging ? 'Drop it here!' : 'Drag & drop your document'}
              </h3>

              <p className="text-[var(--text-muted)] mb-10 max-w-lg mx-auto leading-relaxed flex flex-col items-center gap-2">
                <span>Supports PDF, DOCX, and TXT files up to 25MB.</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-full text-xs font-semibold mt-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  100% Secure & Private: Your documents never leave your device. All AI processing and vector storage happen completely within your browser via WASM.
                </span>
              </p>

              <input type="file" id="fileUpload" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />

              <label htmlFor="fileUpload" className="btn-primary cursor-pointer text-lg px-10">
                Browse Files
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            100% Client-Side Processing
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            IndexedDB Local Storage
          </div>
        </div>
      </div>
    </div>
  );
};
