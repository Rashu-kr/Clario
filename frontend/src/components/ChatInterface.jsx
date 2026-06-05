
/**
 * ChatInterface Component
 * Renders scrollable conversation feed, suggestion chips, and question submission form.
 */
export const ChatInterface = ({
  messages,
  chatInput,
  setChatInput,
  isChatLoading,
  handleSendMessage,
  chatEndRef,
  suggestedQuestions
}) => {
  return (
    <div className="w-full lg:w-2/3 bg-[var(--bg-subtle)] flex flex-col h-[calc(100vh-64px)] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-main)] opacity-50 pointer-events-none"></div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 relative z-10 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            <div className={`max-w-[85%] md:max-w-[75%] text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#3B82F6] text-white rounded-2xl rounded-tr-sm px-6 py-4' : 'glass-card-premium text-[var(--text-main)] rounded-2xl rounded-tl-sm px-6 py-4 border border-[var(--border-light)] relative'}`}>
              {msg.role === 'ai' && (
                <div className="absolute -left-3 -top-3 w-7 h-7 rounded-full bg-[#10B981] border-2 border-[var(--bg-subtle)] flex items-center justify-center shadow-md">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}

              {msg.loading ? (
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : msg.content}

              {Array.isArray(msg.chunks) && msg.chunks.length > 0 && (
                <div className="mt-2 text-[11px] text-[var(--text-muted)] opacity-60">
                  📎 {msg.chunks.length} document chunks retrieved via RAG
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      <div className="px-6 md:px-8 pb-8 pt-4 border-t border-[var(--border-light)] bg-[var(--bg-main)]/80 backdrop-blur-xl relative z-20">
        {suggestedQuestions && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(null, q)}
                className="text-xs font-medium bg-[var(--bg-subtle)] border border-[var(--border-light)] text-[var(--text-muted)] hover:text-[#3B82F6] hover:border-[#3B82F6]/50 px-3 py-1.5 rounded-full transition-all hover:shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        )}

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
            disabled={!chatInput.trim() || isChatLoading}
            className="absolute right-2 top-2 bottom-2 w-12 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[var(--border-light)] disabled:text-[var(--text-muted)] text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none hover:scale-105 active:scale-95"
          >
            {isChatLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>

        <div className="text-center mt-4 text-xs font-medium text-[var(--text-muted)] opacity-70">
          AI can make mistakes. Consider verifying critical legal or financial information.
        </div>
      </div>
    </div>
  );
};
