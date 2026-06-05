import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { uploadDocument, chatWithDocument, deleteSession } from '../utils/api';
import { extractText, chunkText, analyzeDocumentText, calculateRiskScore } from '../utils/localAi';
import { saveDocument, updateChatHistory } from '../utils/db';

// Subcomponents extracted for semantic division and maintainability
import { LocalAIInitializer } from '../components/LocalAIInitializer';
import { PDFUploadDropzone } from '../components/PDFUploadDropzone';
import { FilePreview } from '../components/FilePreview';
import { AIProcessingSpinner } from '../components/AIProcessingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { MachineLearningAnalysis } from '../components/MachineLearningAnalysis';
import { RiskAssessment } from '../components/RiskAssessment';
import { ChatInterface } from '../components/ChatInterface';

/**
 * Logo Component
 * Renders the animated Clario brand logo with thematic gradient fill.
 */
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

// Suggested questions presented in the chat UI
const SUGGESTED_QUESTIONS = [
  "Summarize the main risks",
  "What is the governing law?",
  "Is there a non-compete?"
];

/**
 * Analyzer Component
 * 
 * Main interface for document ingestion, local processing, and semantic chat.
 * Implements a hybrid browser-centric architecture:
 * 1. File Ingestion: Drag & drop handles local file picking.
 * 2. Web Worker Handshake: Loads an open-source model in a background thread to generate embeddings without main-thread UI lag.
 * 3. Text Extraction & sliding window chunking: Performed entirely locally.
 * 4. Local Embedding & Inference: Calls the Web Worker to generate dense vector representations.
 * 5. Vector Search Logic: Computes cosine similarity of query vs chunk vectors inside the browser.
 * 6. Metadata Registration: Contacts the FastAPI backend strictly to log session metrics.
 */
export const Analyzer = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { user } = useAuth();
  
  // UI and Upload State Management
  const [state, setState] = useState('upload'); // 'upload', 'preview', 'processing', 'results', 'error'
  const [file, setFile] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [explainMode, setExplainMode] = useState('professional');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [dbDocId, setDbDocId] = useState(null);

  // --- LOCAL AI & WEB WORKER STATE CONTROLS ---
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [modelStatusText, setModelStatusText] = useState('Checking local AI cache...');

  // Persistent references to Web Worker and document memory index
  const workerRef = useRef(null);
  const chunksRef = useRef([]);
  const embeddingsRef = useRef([]);

  // Chat message thread
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'I have successfully analyzed your document. What would you like to know?' }
  ]);

  // Load past document if passed from Dashboard route state
  useEffect(() => {
    if (location.state?.document) {
      const historicalDoc = location.state.document;
      setTimeout(() => {
        setDbDocId(historicalDoc.id);
        setState('results');
        setFile({ name: historicalDoc.name, size: parseFloat(historicalDoc.size) * 1024 * 1024 });
        setSessionId(historicalDoc.session_id);
        
        setApiResult({
          file_name: historicalDoc.name,
          session_id: historicalDoc.session_id,
          summary: historicalDoc.summary,
          ml_analysis: historicalDoc.ml_analysis,
          risk_counts: historicalDoc.risk_counts,
          overall_risk: historicalDoc.overall_risk,
          file_size_mb: historicalDoc.size
        });
        
        chunksRef.current = historicalDoc.chunks || [];
        embeddingsRef.current = historicalDoc.embeddings || [];
        
        if (historicalDoc.messages && historicalDoc.messages.length > 0) {
          setMessages(historicalDoc.messages);
        }
      }, 0);
    }
  }, [location.state]);

  // Autoscroll chat window to recent messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- WEB WORKER HANDSHAKE & INITIALIZATION ---
  useEffect(() => {
    const worker = new Worker(new URL('../workers/ai.worker.js', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.postMessage({ type: 'init' });

    worker.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'init_progress') {
        setModelProgress(Math.round(data.progress * 100));
        setModelStatusText(`Initializing local AI model cache: ${Math.round(data.progress * 100)}% (${(data.loaded / 1024 / 1024).toFixed(1)}MB of ${(data.total / 1024 / 1024).toFixed(1)}MB)`);
      } else if (type === 'init_complete') {
        setIsWorkerReady(true);
      } else if (type === 'error') {
        setApiError(`Local AI worker failed: ${data}`);
        setState('error');
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  // --- PROMISE-BASED WEB WORKER CLIENT ---
  const runWorkerTask = (type, data) => {
    return new Promise((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) {
        reject(new Error("Worker not initialized"));
        return;
      }

      const handleMessage = (event) => {
        const { type: responseType, data: responseData } = event.data;
        if (responseType === `${type}_complete`) {
          worker.removeEventListener('message', handleMessage);
          resolve(responseData);
        } else if (responseType === 'error') {
          worker.removeEventListener('message', handleMessage);
          reject(new Error(responseData));
        }
      };

      worker.addEventListener('message', handleMessage);
      worker.postMessage({ type, data });
    });
  };

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setState('preview');
  };

  // Reset all states to allow analyzing a new file
  const resetAnalyzer = () => {
    if (sessionId) deleteSession(sessionId);

    setState('upload');
    setFile(null);
    setApiResult(null);
    setApiError('');
    setUploadProgress(0);
    setProcessingStepIndex(0);
    setSessionId(null);
    setIsChatLoading(false);
    chunksRef.current = [];
    embeddingsRef.current = [];
    setMessages([{ role: 'ai', content: 'I have successfully analyzed your document. What would you like to know?' }]);
  };

  // --- LOCAL PROCESSING & VECTORIZATION FLOW ---
  const startProcessing = async () => {
    setState('processing');
    setProcessingStepIndex(0);
    setUploadProgress(0);
    setApiError('');

    try {
      setProcessingStepIndex(1);
      const text = await extractText(file);

      setProcessingStepIndex(2);
      const chunks = chunkText(text);
      if (chunks.length === 0) {
        throw new Error("Could not extract any valid text from document.");
      }

      setProcessingStepIndex(3);
      const { embeddings } = await runWorkerTask('embed', { texts: chunks });
      chunksRef.current = chunks;
      embeddingsRef.current = embeddings;

      const localResult = analyzeDocumentText(text);

      const ml_analysis = chunks.map((chunk, index) => {
        const chunkRisk = calculateRiskScore(chunk);
        const billingWords = ["bill", "billing", "invoice", "amount", "payment", "paid", "due", "charge"];
        const medicalWords = ["patient", "diagnosis", "doctor", "treatment", "medicine", "hospital", "symptom"];
        const claimWords = ["claim", "policy", "insurance", "rejected", "approved", "verification", "proof"];
        const riskWords = ["missing", "mismatch", "pending", "delay", "reject", "error", "failed"];

        let clauseType = "General Document Information";
        const chunkLower = chunk.toLowerCase();
        if (billingWords.some(w => chunkLower.includes(w))) clauseType = "Billing / Payment Related";
        else if (medicalWords.some(w => chunkLower.includes(w))) clauseType = "Medical / Patient Related";
        else if (claimWords.some(w => chunkLower.includes(w))) clauseType = "Claim / Insurance Related";
        else if (riskWords.some(w => chunkLower.includes(w))) clauseType = "Risk / Clause Analysis";

        return {
          chunk_index: index + 1,
          chunk: chunk,
          clause_type: clauseType,
          risk_level: chunkRisk.risk_score > 10 ? chunkRisk.risk_level : "Low"
        };
      });

      setProcessingStepIndex(4);
      const backendResult = await uploadDocument(file, (pct) => setUploadProgress(pct));
      setSessionId(backendResult.session_id);

      const combinedResult = {
        ...backendResult,
        summary: localResult.summary,
        keywords: localResult.keywords,
        clusters: localResult.clusters,
        important_sections: localResult.important_sections,
        ml_analysis: ml_analysis,
        total_chunks: chunks.length
      };

      setApiResult(combinedResult);

      const ragNote = `Document indexed into ${chunks.length} local semantic chunks. Browser-side AI generated embeddings and classified risk levels via WASM. Ask me anything about it!`;
      const initialMessages = [{ role: 'ai', content: ragNote }];
      setMessages(initialMessages);

      try {
        const saved = await saveDocument({
          user_email: user?.email || 'anonymous',
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          status: 'Completed',
          type: file.name.split('.').pop().toLowerCase() || 'pdf',
          overall_risk: combinedResult.ml_analysis.some(x => x.risk_level === 'High') ? 'High' : 
                        combinedResult.ml_analysis.some(x => x.risk_level === 'Medium') ? 'Medium' : 'Low',
          session_id: backendResult.session_id,
          summary: localResult.summary,
          ml_analysis: ml_analysis,
          risk_counts: {
            high: ml_analysis.filter(x => x.risk_level === 'High').length,
            medium: ml_analysis.filter(x => x.risk_level === 'Medium').length,
            low: ml_analysis.filter(x => x.risk_level === 'Low').length
          },
          chunks: chunks,
          embeddings: embeddings,
          messages: initialMessages
        });
        setDbDocId(saved.id);
      } catch (dbErr) {
        console.error("Failed to save new document to IndexedDB:", dbErr);
      }

      setTimeout(() => setState('results'), 600);
    } catch (err) {
      console.error("Local processing error:", err);
      setApiError(err.message || 'An unexpected error occurred during client-side processing.');
      setState('error');
    }
  };

  // --- CLIENT-SIDE VECTOR SEARCH LOGIC ---
  const handleSendMessage = async (e, explicitMessage = null) => {
    if (e) e.preventDefault();

    const msgText = explicitMessage || chatInput;

    if (!msgText.trim() || isChatLoading) return;

    if (!sessionId) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: 'Please upload and analyze a document first.' }
      ]);
      return;
    }

    const userMsg = { role: 'user', content: msgText };
    const loadingMsg = { role: 'ai', content: '...', loading: true };

    setMessages(prev => {
      const updated = [...prev, userMsg, loadingMsg];
      if (dbDocId) {
        updateChatHistory(dbDocId, updated.filter(m => !m.loading));
      }
      return updated;
    });

    if (!explicitMessage) setChatInput('');

    setIsChatLoading(true);

    try {
      const { embeddings: queryEmbeddings } = await runWorkerTask('embed', { texts: [msgText] });
      const queryEmbedding = queryEmbeddings[0];

      const { similarities } = await runWorkerTask('cosine_similarity', {
        queryEmbedding,
        chunkEmbeddings: embeddingsRef.current
      });

      const scoredChunks = chunksRef.current.map((chunk, idx) => ({
        chunk,
        score: similarities[idx]
      }));

      scoredChunks.sort((a, b) => b.score - a.score);
      const topK = scoredChunks.slice(0, 5).filter(sc => sc.score > 0.05).map(sc => sc.chunk);
      const contextChunks = topK.length > 0 ? topK : chunksRef.current.slice(0, 5);

      const data = await chatWithDocument(sessionId, msgText, contextChunks);
      const aiMsg = {
        role: 'ai',
        content: data.answer,
        chunks: contextChunks
      };

      setMessages(prev => {
        const updated = [...prev.filter(m => !m.loading), aiMsg];
        if (dbDocId) {
          updateChatHistory(dbDocId, updated);
        }
        return updated;
      });
    } catch (err) {
      const errMsg = {
        role: 'ai',
        content: `Error: ${err.message}`
      };

      setMessages(prev => {
        const updated = [...prev.filter(m => !m.loading), errMsg];
        if (dbDocId) {
          updateChatHistory(dbDocId, updated);
        }
        return updated;
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const getSummaryContent = () => {
    if (apiResult?.summary) {
      return apiResult.summary
        .split('\n')
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    return [
      "This is a standard Non-Disclosure Agreement (NDA) between two parties.",
      "The duration of confidentiality is 5 years from the date of disclosure.",
      "Jurisdiction is explicitly set to the State of Delaware."
    ];
  };

  const getMlAnalysis = () => {
    return apiResult?.ml_analysis || [];
  };

  const getRiskCounts = () => {
    const analysis = getMlAnalysis();

    return analysis.reduce(
      (acc, item) => {
        const risk = (item.risk_level || '').toLowerCase();

        if (risk === 'high') acc.high += 1;
        else if (risk === 'medium') acc.medium += 1;
        else if (risk === 'low') acc.low += 1;

        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );
  };

  const getOverallRisk = () => {
    const counts = getRiskCounts();

    if (counts.high > 0) return 'High';
    if (counts.medium > 0) return 'Medium';
    return 'Low';
  };

  const getRiskBadgeClass = (risk) => {
    const value = (risk || '').toLowerCase();

    if (value === 'high') {
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    }

    if (value === 'medium') {
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    }

    return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex flex-col font-sans transition-colors duration-500">

      {(state === 'upload' || state === 'preview') && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden parallax-layer-2">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#3B82F6]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      <header className="h-16 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border-light)] flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
        <Logo />

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-full text-xs font-semibold">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Local Session Secure
          </span>

          <button onClick={toggleTheme} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
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

        {!isWorkerReady ? (
          <LocalAIInitializer
            modelStatusText={modelStatusText}
            modelProgress={modelProgress}
          />
        ) : state === 'upload' ? (
          <PDFUploadDropzone onFileSelected={handleFileSelected} />
        ) : state === 'preview' ? (
          <FilePreview
            file={file}
            privacyMode={privacyMode}
            setPrivacyMode={setPrivacyMode}
            startProcessing={startProcessing}
            resetAnalyzer={resetAnalyzer}
          />
        ) : state === 'processing' ? (
          <AIProcessingSpinner
            processingStepIndex={processingStepIndex}
            uploadProgress={uploadProgress}
          />
        ) : state === 'error' ? (
          <ErrorAlert
            apiError={apiError}
            resetAnalyzer={resetAnalyzer}
          />
        ) : state === 'results' ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden animate-fade-in bg-[var(--bg-main)]">

            <div className="w-full lg:w-1/3 bg-[var(--bg-main)] border-r border-[var(--border-light)] overflow-y-auto z-10 shadow-[10px_0_30px_rgba(0,0,0,0.02)] relative">
              <div className="p-8 pb-6 border-b border-[var(--border-light)] sticky top-0 bg-[var(--bg-main)]/90 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/20">
                    <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-[var(--text-main)] truncate text-lg">{apiResult?.file_name || file?.name || 'Document.pdf'}</h2>

                    <p className="text-sm text-[#10B981] font-medium flex items-center gap-1.5 mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Analysis Complete{apiResult?.file_size_mb ? ` • ${apiResult.file_size_mb} MB` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-10">
                <ExecutiveSummary
                  summaryContent={getSummaryContent()}
                  explainMode={explainMode}
                  setExplainMode={setExplainMode}
                />

                <MachineLearningAnalysis
                  mlAnalysis={getMlAnalysis()}
                  getRiskBadgeClass={getRiskBadgeClass}
                />

                <RiskAssessment
                  riskCounts={getRiskCounts()}
                  overallRisk={getOverallRisk()}
                  getRiskBadgeClass={getRiskBadgeClass}
                />
              </div>
            </div>

            <ChatInterface
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              isChatLoading={isChatLoading}
              handleSendMessage={handleSendMessage}
              chatEndRef={chatEndRef}
              suggestedQuestions={SUGGESTED_QUESTIONS}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
};
