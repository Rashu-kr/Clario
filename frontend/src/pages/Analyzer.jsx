import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { uploadDocument } from '../utils/api';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logo-grad-analyzer)" />
        <path d="M12 28V12L28 20L12 28Z" fill="#FFFFFF" />
        <circle cx="28" cy="20" r="4" fill="#60A5FA" />
        <defs>
          <linearGradient id="logo-grad-analyzer" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-sans text-xl font-bold tracking-tight text-[var(--text-main)]">Clario</span>
    </Link>
  );
};

// Processing steps definition
const PROCESSING_STEPS = [
  "Securely uploading...",
  "Reading document...",
  "Extracting key clauses...",
  "Evaluating risks...",
  "Preparing summary..."
];

const SUGGESTED_QUESTIONS = [
  "Summarize the main risks",
  "What is the governing law?",
  "Is there a non-compete?"
];

export const Analyzer = () => {
  const { theme, toggleTheme } = useTheme();
  const [state, setState] = useState('upload'); // 'upload', 'preview', 'processing', 'results', 'error'
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [explainMode, setExplainMode] = useState('professional');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiResult, setApiResult] = useState(null); // { summary, file_name, file_size_mb }
  const [apiError, setApiError] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'I have successfully analyzed your document. What would you like to know?' }
  ]);

  // Handle Drag & Drop
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setState('preview');
  };

  const resetAnalyzer = () => {
    setState('upload');
    setFile(null);
    setApiResult(null);
    setApiError('');
    setUploadProgress(0);
    setProcessingStepIndex(0);
    setMessages([{ role: 'ai', content: 'I have successfully analyzed your document. What would you like to know?' }]);
  };

  const startProcessing = async () => {
    setState('processing');
    setProcessingStepIndex(0);
    setUploadProgress(0);
    setApiError('');

    // Animate steps while upload + AI runs in parallel
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < PROCESSING_STEPS.length - 1) {
        setProcessingStepIndex(step);
      }
    }, 900);

    try {
      const result = await uploadDocument(file, (pct) => setUploadProgress(pct));
      clearInterval(interval);
      setProcessingStepIndex(PROCESSING_STEPS.length - 1);
      setApiResult(result);
      setMessages([{ role: 'ai', content: 'I have successfully analyzed your document. What would you like to know?' }]);
      setTimeout(() => setState('results'), 600);
    } catch (err) {
      clearInterval(interval);
      setApiError(err.message || 'An unexpected error occurred.');
      setState('error');
    }
  };

  const handleSendMessage = (e, explicitMessage = null) => {
    if (e) e.preventDefault();
    const msgText = explicitMessage || chatInput;
    if (!msgText.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: msgText }];
    setMessages(newMessages);
    if (!explicitMessage) setChatInput('');
    
    setTimeout(() => {
      setMessages([...newMessages, { role: 'ai', content: 'Based on my analysis, Section 4.2 covers that specific scenario. It explicitly states that the governing law is Delaware.' }]);
    }, 1200);
  };

  const getSummaryContent = () => {
    // Use real AI summary if available
    if (apiResult?.summary) {
      return apiResult.summary
        .split('\n')
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }
    // Fallback mock
    return [
      "This is a standard Non-Disclosure Agreement (NDA) between two parties.",
      "The duration of confidentiality is 5 years from the date of disclosure.",
      "Jurisdiction is explicitly set to the State of Delaware."
    ];
  };

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex flex-col font-sans transition-colors duration-500">
      
      {/* Background Orbs specific to Analyzer */}
      {(state === 'upload' || state === 'preview') && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden parallax-layer-2">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#3B82F6]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border-light)] flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
        <Logo />
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>
          
          {(state === 'results' || state === 'preview' || state === 'error') && (
            <button onClick={resetAnalyzer} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              Start New Analysis
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/50 flex items-center justify-center text-[#3B82F6] font-bold text-sm">
            RK
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        
        {/* STATE: UPLOAD */}
        {state === 'upload' && (
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
                      <svg className="w-10 h-10 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    
                    <h3 className="text-2xl font-semibold mb-3 text-[var(--text-main)]">
                      {isDragging ? 'Drop it here!' : 'Drag & drop your document'}
                    </h3>
                    <p className="text-[var(--text-muted)] mb-10 max-w-md mx-auto leading-relaxed">
                      Supports PDF, DOCX, and TXT files up to 25MB. All files are encrypted during transfer and instantly deleted after processing.
                    </p>
                    
                    <input type="file" id="fileUpload" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
                    <label htmlFor="fileUpload" className="btn-primary cursor-pointer text-lg px-10">
                      Browse Files
                    </label>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  End-to-End Encrypted
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Private AI Processing
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE: PREVIEW */}
        {state === 'preview' && (
          <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-xl">
              <div className="glass-card-premium rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <button onClick={resetAnalyzer} className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>

                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-1 truncate px-8">{file?.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-10">{(file?.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis</p>

                {/* Privacy Toggle */}
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
        )}

        {/* STATE: PROCESSING */}
        {state === 'processing' && (
          <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
            <div className="text-center w-full max-w-md relative">
              <div className="absolute inset-0 bg-[#3B82F6]/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
              
              <div className="relative z-10 glass-card-premium p-12 rounded-3xl border border-[#3B82F6]/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden">

                {/* Upload Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1.5 bg-[#3B82F6] transition-all duration-300 ease-out" style={{ width: `${uploadProgress || ((processingStepIndex + 1) / PROCESSING_STEPS.length) * 100}%` }}></div>

                {/* Premium Spinner */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--border-light)]"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-[#3B82F6] border-t-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#3B82F6] animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 tracking-tight">Analyzing Document</h2>
                
                {/* Step List */}
                <div className="space-y-3 text-left max-w-[250px] mx-auto">
                  {PROCESSING_STEPS.map((stepStr, i) => {
                    const isCompleted = i < processingStepIndex;
                    const isActive = i === processingStepIndex;
                    return (
                      <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${isActive ? 'text-[var(--text-main)] scale-105 font-medium' : isCompleted ? 'text-[#10B981]' : 'text-[var(--text-muted)] opacity-50'}`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
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
        )}

        {/* STATE: ERROR */}
        {state === 'error' && (
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
        )}

        {/* STATE: RESULTS & CHAT */}
        {state === 'results' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden animate-fade-in bg-[var(--bg-main)]">
            
            {/* Left Column: Summary Card */}
            <div className="w-full lg:w-1/3 bg-[var(--bg-main)] border-r border-[var(--border-light)] overflow-y-auto z-10 shadow-[10px_0_30px_rgba(0,0,0,0.02)] relative">
              <div className="p-8 pb-6 border-b border-[var(--border-light)] sticky top-0 bg-[var(--bg-main)]/90 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/20">
                    <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-[var(--text-main)] truncate text-lg">{apiResult?.file_name || file?.name || 'Document.pdf'}</h2>
                    <p className="text-sm text-[#10B981] font-medium flex items-center gap-1.5 mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Analysis Complete{apiResult?.file_size_mb ? ` • ${apiResult.file_size_mb} MB` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-10">
                
                {/* Explain Mode Toggle */}
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

                {/* Executive Summary */}
                <section className="animate-fade-up">
                  <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Executive Summary
                  </h3>
                  <ul className="space-y-4">
                    {getSummaryContent().map((text, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-main)] leading-relaxed">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0 shadow-[0_0_8px_#3B82F6]"></div>
                        <div>{text}</div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Risk Meter */}
                <section className="animate-fade-up delay-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      Risk Assessment
                    </h3>
                    {/* Meter Gauge Visual */}
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-6 rounded-full bg-[#10B981]"></div>
                      <div className="h-1.5 w-6 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                      <div className="h-1.5 w-6 rounded-full bg-[var(--border-light)]"></div>
                      <span className="text-xs font-bold text-orange-500 ml-1">Medium</span>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 text-sm mb-2">Broad Definition of Confidential Info</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300/80 leading-relaxed">Clause 2.1 defines confidential info very broadly, which may include publicly available data if not challenged.</p>
                  </div>
                </section>
              </div>
            </div>

            {/* Right Column: AI Chat */}
            <div className="w-full lg:w-2/3 bg-[var(--bg-subtle)] flex flex-col h-[calc(100vh-64px)] relative">
              {/* Background gradient for chat */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-main)] opacity-50 pointer-events-none"></div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 relative z-10 scroll-smooth">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                    <div className={`max-w-[85%] md:max-w-[75%] text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#3B82F6] text-white rounded-2xl rounded-tr-sm px-6 py-4' : 'glass-card-premium text-[var(--text-main)] rounded-2xl rounded-tl-sm px-6 py-4 border border-[var(--border-light)] relative'}`}>
                      {msg.role === 'ai' && (
                        <div className="absolute -left-3 -top-3 w-7 h-7 rounded-full bg-[#10B981] border-2 border-[var(--bg-subtle)] flex items-center justify-center shadow-md">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="px-6 md:px-8 pb-8 pt-4 border-t border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-xl relative z-20">
                
                {/* Suggested Questions */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(null, q)}
                      className="text-xs font-medium bg-[var(--bg-subtle)] border border-[var(--border-light)] text-[var(--text-muted)] hover:text-[#3B82F6] hover:border-[#3B82F6]/50 px-3 py-1.5 rounded-full transition-all hover:shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question about your document..."
                    className="relative w-full pl-6 pr-16 py-4 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-main)] text-[var(--text-main)] focus:outline-none focus:ring-0 transition-all shadow-inner placeholder-[var(--text-muted)]"
                  />
                  <button 
                    type="submit" 
                    disabled={!chatInput.trim()}
                    className="absolute right-2 top-2 bottom-2 w-12 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[var(--border-light)] disabled:text-[var(--text-muted)] text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none hover:scale-105 active:scale-95"
                  >
                    <svg className="w-5 h-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </form>
                <div className="text-center mt-4 text-xs font-medium text-[var(--text-muted)] opacity-70">
                  AI can make mistakes. Consider verifying critical legal or financial information.
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};
