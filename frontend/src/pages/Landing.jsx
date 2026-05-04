import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Logo = () => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logo-grad)" />
        <path d="M12 28V12L28 20L12 28Z" fill="#FFFFFF" />
        <circle cx="28" cy="20" r="4" fill="#60A5FA" />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-sans text-2xl font-bold tracking-tight text-[var(--text-main)]">Clario</span>
    </div>
  );
};

export const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-premium-dark min-h-screen font-sans text-[var(--text-main)] overflow-hidden">
      
      {/* Background Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none parallax-layer-1">
        <div className="smoke-layer"></div>
        <div className="particle-layer"></div>
        <div className="animated-mesh opacity-50"></div>
        <div className="neural-dots opacity-30"></div>
        <div className="animated-grid opacity-20"></div>
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none parallax-layer-2">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2 delay-200"></div>
        <div className="floating-orb orb-3 delay-400"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">How it Works</a>
            <a href="#features" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Features</a>
            <a href="#security" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors rounded-full hover:bg-[var(--border-light)]">
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
            <Link to="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Sign in</Link>
            <Link to="/app" className="btn-primary py-2.5 px-6 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-32">
        
        {/* 1. Hero Section */}
        <section className="px-6 pb-24 text-center max-w-6xl mx-auto pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-light)] text-[var(--text-muted)] text-sm font-medium mb-8 animate-fade-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]"></span>
            </span>
            Clario AI Document Analyzer 2.0 is live
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-[var(--text-main)] mb-6 leading-[1.05] animate-fade-up delay-100">
            Understand Any Document. <br/>
            <span className="text-gradient-blue">Instantly.</span>
          </h1>
          
          <p className="text-xl text-[var(--text-muted)] mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-up delay-200">
            Upload private documents and get clear summaries, key insights, and instant answers with AI. Stop reading 50-page contracts. Let Clario do the work.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up delay-300">
            <Link to="/app" className="btn-glow text-lg">
              Analyze Your Document
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4 group">
              See How It Works
            </a>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-3 text-sm font-medium text-[var(--text-muted)] animate-fade-up delay-400">
            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Encrypted uploads</div>
            <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div>
            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Private analysis</div>
            <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div>
            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Secure processing</div>
          </div>

          {/* Premium 3D Hero Mockup */}
          <div className="mt-24 relative animate-fade-up delay-400 perspective-container">
            {/* Floating Particles */}
            <div className="particle w-16 h-20 top-10 -left-10 flex items-center justify-center text-[#3B82F6] opacity-60">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <div className="particle w-20 h-24 bottom-20 -right-12 flex items-center justify-center text-[#10B981] opacity-60" style={{ animationDelay: '1s', animationDuration: '12s' }}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/20 to-transparent blur-[100px] -z-10 rounded-full"></div>
            
            <div className="hero-3d-card glass-card-premium rounded-2xl p-2 mx-auto max-w-5xl">
              <div className="bg-[var(--bg-main)] rounded-xl overflow-hidden flex flex-col md:flex-row border border-[var(--border-light)] h-[450px]">
                {/* Mockup Left: Upload */}
                <div className="w-full md:w-1/3 border-r border-[var(--border-light)] p-6 flex flex-col bg-[var(--bg-subtle)]">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="border-2 border-dashed border-[#3B82F6]/30 rounded-xl flex-1 flex flex-col items-center justify-center bg-[#3B82F6]/5 relative overflow-hidden group cursor-pointer transition-colors hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <svg className="w-12 h-12 text-[#3B82F6] mb-4 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <div className="text-sm font-semibold text-[var(--text-main)] mb-1">Drop Private_Doc.pdf</div>
                    <div className="text-xs text-[#10B981] flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Encrypted & Ready
                    </div>
                  </div>
                </div>
                {/* Mockup Right: Chat/Summary */}
                <div className="w-full md:w-2/3 p-8 bg-[var(--bg-main)] flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl"></div>
                  
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--border-light)]">
                    <div className="w-8 h-8 rounded bg-[#3B82F6]/20 flex items-center justify-center border border-[#3B82F6]/30">
                      <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-main)] text-sm">Document Analysis</h3>
                      <p className="text-xs text-[var(--text-muted)]">AI has summarized 52 pages into 3 insights.</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-5 relative z-10">
                    <div className="flex justify-end animate-fade-up">
                      <div className="bg-[#3B82F6] text-white text-sm px-5 py-3 rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(59,130,246,0.2)]">
                        Does this contract have a non-compete clause?
                      </div>
                    </div>
                    <div className="flex justify-start animate-fade-up delay-200">
                      <div className="bg-[var(--bg-subtle)] text-[var(--text-main)] text-sm px-5 py-4 rounded-2xl rounded-tl-sm leading-relaxed max-w-[85%] border border-[var(--border-light)] shadow-sm relative">
                        <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#10B981] border-2 border-[var(--bg-main)] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        Yes, found in <span className="text-[#60A5FA] font-medium cursor-pointer hover:underline">Section 5.1</span>. It states you cannot work for a direct competitor for a period of <strong>12 months</strong> after termination within a 50-mile radius.
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border border-[var(--border-light)] rounded-xl p-3 bg-[var(--bg-subtle)]/80 backdrop-blur flex items-center shadow-sm relative z-10">
                    <div className="text-sm text-[var(--text-muted)] pl-3 flex-1 font-medium">Ask anything about your document...</div>
                    <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Trust Badges */}
        <section className="py-10 border-y border-[var(--border-light)] bg-[var(--bg-subtle)]/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            {['Bank-Grade Security', '100% Private', 'End-to-End Encrypted', 'Lightning Fast'].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-[var(--text-main)]">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {badge}
              </div>
            ))}
          </div>
        </section>

        {/* 3. How It Works */}
        <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] mb-6">From Upload to Insight in <span className="text-gradient-blue">Seconds</span>.</h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">Clario uses state-of-the-art AI to instantly read, comprehend, and analyze your documents.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Securely upload your document. We encrypt it instantly.' },
              { step: '02', title: 'Analyze', desc: 'Our AI engine reads and comprehends every single clause.' },
              { step: '03', title: 'Summarize', desc: 'Get a human-readable summary of the most important points.' },
              { step: '04', title: 'Ask', desc: 'Chat directly with your document to find specific answers.' }
            ].map((item, i) => (
              <div key={i} className="glass-card-premium p-8 rounded-2xl relative overflow-hidden group">
                <div className="text-6xl font-black text-[var(--border-light)] absolute -top-4 -right-4 transition-transform duration-500 group-hover:scale-110">{item.step}</div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 mt-4 relative z-10">{item.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Feature Cards */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-[var(--border-light)] relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] mb-6">Powerful Features. <br/>Zero Complexity.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-premium card-glow p-8 rounded-2xl md:col-span-2 group">
              <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-6 border border-[#3B82F6]/20 icon-glow transition-all duration-300">
                <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 relative z-10">Smart Summary</h3>
              <p className="text-[var(--text-muted)] relative z-10">Instantly condense 100-page documents into 1-page executive summaries. Know exactly what you're signing before you sign it.</p>
            </div>
            
            <div className="glass-card-premium card-glow p-8 rounded-2xl group">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 icon-glow transition-all duration-300">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 relative z-10">Risk Highlights</h3>
              <p className="text-[var(--text-muted)] relative z-10">Automatically flag unusual clauses and hidden risks.</p>
            </div>

            <div className="glass-card-premium card-glow p-8 rounded-2xl group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 icon-glow transition-all duration-300">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 relative z-10">Ask Anything</h3>
              <p className="text-[var(--text-muted)] relative z-10">Chat directly with your document. Ask specific questions and get exact answers instantly.</p>
            </div>

            <div className="glass-card-premium card-glow p-8 rounded-2xl group">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 icon-glow transition-all duration-300">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 relative z-10">Multi-document</h3>
              <p className="text-[var(--text-muted)] relative z-10">Supports PDF, DOCX, TXT, and scanned image documents flawlessly.</p>
            </div>

            <div className="glass-card-premium card-glow p-8 rounded-2xl group">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-6 border border-[#10B981]/20 icon-glow transition-all duration-300">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 relative z-10">Privacy First</h3>
              <p className="text-[var(--text-muted)] relative z-10">Zero data retention. Once your session ends, documents are permanently wiped.</p>
            </div>
          </div>
        </section>

        {/* 5. Document Types */}
        <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--text-main)] mb-4">Analyze Any Document Type</h2>
            <p className="text-[var(--text-muted)]">Trained on millions of legal, financial, and personal documents.</p>
          </div>
          
          {/* Scrollable Container for Document Types */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex overflow-x-auto pb-8 pt-4 px-4 gap-4 snap-x hide-scrollbar">
              {[
                'Insurance Policies', 'Job Offer Letters', 'Employment Contracts', 
                'Rental Agreements', 'Lease Agreements', 'Loan Documents', 
                'Bank Statements', 'Tax Documents', 'Legal Agreements', 
                'Business Contracts', 'NDAs (Non-Disclosure)', 'Terms & Conditions', 
                'Privacy Policies', 'FIR / Police Reports', 'Government Documents', 
                'Medical Records', 'Financial Reports', 'Investment Papers', 
                'Salary Slips', 'Invoices & Bills'
              ].map((doc, i) => (
                <div key={i} className="glass-card-premium card-glow p-5 rounded-xl flex items-center gap-4 shrink-0 min-w-[280px] snap-center group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center border border-[var(--border-light)] shrink-0 icon-glow transition-all duration-300">
                    <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <span className="font-semibold text-[var(--text-main)] relative z-10">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Security Section & Final CTA */}
        <section id="security" className="py-32 px-6 max-w-4xl mx-auto text-center border-t border-[var(--border-light)] relative">
          {/* Subtle glow behind CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#3B82F6]/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
          
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mb-8">
            <svg className="w-8 h-8 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] mb-6">Built for private and sensitive documents.</h2>
          <p className="text-xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed">
            Your data is encrypted at rest and in transit. Analysis is performed securely, and your documents are permanently wiped after your session.
          </p>
          
          <Link to="/app" className="btn-glow text-xl px-10 py-5 mx-auto w-full sm:w-auto inline-flex">
            Start analyzing with confidence
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border-light)] bg-[var(--bg-main)] relative z-20">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Logo />
              <span className="text-sm text-[var(--text-muted)] border-l border-[var(--border-light)] pl-4">© 2026 Clario Inc.</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--text-main)] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--text-main)] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[var(--text-main)] transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
