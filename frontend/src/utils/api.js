// Resolve host base target for FastAPI REST API endpoints
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * uploadDocument
 * 
 * Registers the document session with the backend metadata controller.
 * Sends the file to extract filename and size, logging session activity on the server.
 * Discards file streams immediately afterwards to guarantee low server memory consumption.
 * 
 * Returns: { status, session_id, file_name, file_size_mb, rag_enabled }
 */
export async function uploadDocument(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    // Track upload byte streams progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress?.(pct);
      }
    });

    // Complete callback resolve
    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.detail || `Server error (${xhr.status})`));
        }
      } catch {
        reject(new Error('Invalid response from server.'));
      }
    });

    // Error and Timeout states checks
    xhr.addEventListener('error', () => {
      reject(new Error('Network error — could not reach the server. Is the backend running?'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Request timed out. The server took too long to respond.'));
    });

    xhr.timeout = 120_000;
    xhr.open('POST', `${API_BASE}/upload`);
    xhr.send(formData);
  });
}

/**
 * chatWithDocument
 * 
 * Proxies the RAG chat question and the context chunks retrieved locally by the browser
 * to the backend chat API. The backend serves as a secure proxy to call Gemini without exposing keys.
 * 
 * Returns: { answer, retrieved_chunks, rag_enabled }
 */
export async function chatWithDocument(sessionId, question, contextChunks = []) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      question,
      context_chunks: contextChunks
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || `Server error (${response.status})`);
  }
  return data;
}

/**
 * deleteSession
 * 
 * Invokes session deletion endpoints on backend memory to purge metadata.
 */
export async function deleteSession(sessionId) {
  try {
    await fetch(`${API_BASE}/session/${sessionId}`, { method: 'DELETE' });
  } catch {
    // Gracefully ignore cleanup check exceptions
  }
}

/**
 * analyzeFileUnsupervised
 * CONFIRMED STUB: Main logic is executed directly browser-side in unsupervisedAnalyzer.jsx.
 */
export async function analyzeFileUnsupervised(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/unsupervised/analyze-file`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || `Server error (${response.status})`);
  }
  return data;
}

/**
 * askFileUnsupervised
 * CONFIRMED STUB: Main similarity search logic is executed directly browser-side.
 */
export async function askFileUnsupervised(file, question) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_BASE}/api/unsupervised/ask-file?question=${encodeURIComponent(question)}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || `Server error (${response.status})`);
  }
  return data;
}