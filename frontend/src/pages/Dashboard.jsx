import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDocuments, deleteDocument } from '../utils/db';

const StatusBadge = ({ status }) => {
  const map = {
    Completed: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    Processing: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    Failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  const dot = {
    Completed: 'bg-[#10B981]',
    Processing: 'bg-[#3B82F6] animate-pulse',
    Failed: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${map[status] || ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || ''}`} />
      {status}
    </span>
  );
};

const FileIcon = ({ type }) => (
  <svg className={`w-5 h-5 transition-colors ${type === 'pdf' ? 'text-red-400' : 'text-[#3B82F6]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadDocuments = async () => {
      if (user?.email) {
        const data = await getDocuments(user.email);
        setDocs(data);
      }
    };
    loadDocuments();
  }, [user]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setTimeout(() => {
        setDocs(prev => prev.filter(d => d.id !== id));
        setDeletingId(null);
      }, 500);
    } catch (err) {
      console.error('Failed to delete document:', err);
      setDeletingId(null);
    }
  };

  const stats = [
    {
      label: 'Total Analyzed',
      value: docs.length.toString(),
      icon: (
        <svg className="w-6 h-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bg: 'bg-[#3B82F6]/10',
      border: 'border-[#3B82F6]/20',
    },
    {
      label: 'Time Saved',
      value: `${(docs.length * 0.75).toFixed(1)} hrs`,
      icon: (
        <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bg: 'bg-[#10B981]/10',
      border: 'border-[#10B981]/20',
    },
    {
      label: 'Secure Sessions',
      value: '100%',
      icon: (
        <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pt-28 pb-16 px-4 sm:px-6">

      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="smoke-layer" />
        <div className="particle-layer" />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 animate-fade-up">
          <div>
            <p className="text-sm font-semibold text-[#3B82F6] mb-1 uppercase tracking-widest">Dashboard</p>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Welcome back, <span className="text-gradient-blue">{user?.name?.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <p className="text-[var(--text-muted)] text-base">
              Here's an overview of your secure document analysis.
            </p>
          </div>
          <Link
            to="/app"
            id="upload-new-doc-btn"
            className="btn-glow px-7 py-3.5 text-base font-semibold flex items-center gap-2.5 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.25)] self-start md:self-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Document
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 animate-fade-up delay-100">
          {stats.map((s, i) => (
            <div key={i} className="glass-card-premium card-glow p-5 rounded-2xl flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center icon-glow shrink-0`}>
                {s.icon}
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{s.label}</div>
                <div className="text-2xl font-extrabold tracking-tight">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Documents */}
        <div className="glass-card-premium rounded-2xl overflow-hidden animate-fade-up delay-200">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-[var(--border-light)] flex items-center justify-between bg-[var(--bg-subtle)]/60">
            <div>
              <h2 className="text-lg font-bold">Recent Documents</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{docs.length} document{docs.length !== 1 ? 's' : ''} processed</p>
            </div>
            <Link to="/app" className="text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB] transition-colors flex items-center gap-1.5">
              Upload New
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {docs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-light)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[var(--text-muted)] font-medium">No documents yet</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-light)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="px-6 py-4 font-semibold">Document</th>
                    <th className="px-6 py-4 font-semibold hidden sm:table-cell">Date</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Size</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {docs.map((doc) => (
                    <tr
                      key={doc.id}
                      className={`group transition-all duration-300 hover:bg-[var(--bg-subtle)]/60 ${deletingId === doc.id ? 'opacity-0 scale-95' : 'opacity-100'}`}
                    >
                      {/* Document Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-light)] flex items-center justify-center shrink-0 group-hover:border-[#3B82F6]/30 transition-colors">
                            <FileIcon type={doc.type} />
                          </div>
                          <span className="font-medium text-[var(--text-main)] truncate max-w-[160px] md:max-w-xs text-sm">
                            {doc.name}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-[var(--text-muted)] hidden sm:table-cell">
                        {doc.date}
                      </td>

                      {/* Size */}
                      <td className="px-6 py-4 text-sm text-[var(--text-muted)] hidden md:table-cell">
                        {doc.size}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={doc.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          {/* View */}
                          <button
                            title="View Summary"
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-200"
                            onClick={() => navigate('/app', { state: { document: doc } })}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Ask AI */}
                          <button
                            title="Ask AI"
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-purple-500 hover:bg-purple-500/10 transition-all duration-200"
                            onClick={() => navigate('/app', { state: { document: doc } })}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636-6.364l.707.707M12 20v1M7.05 7.05a7 7 0 109.9 9.9" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            title="Delete"
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up delay-300">
          <Link to="/app" className="glass-card-premium card-glow p-5 rounded-2xl flex items-center gap-4 hover:border-[#3B82F6]/40 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm text-[var(--text-main)]">Upload & Analyze</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Process a new legal document with AI</div>
            </div>
          </Link>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            id="dashboard-logout-btn"
            className="glass-card-premium p-5 rounded-2xl flex items-center gap-4 hover:border-red-500/30 transition-all duration-300 group text-left w-full"
          >
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm text-[var(--text-main)]">Sign Out</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Securely end your session</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
