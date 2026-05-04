const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Upload a document to the Clario backend.
 * @param {File} file - The file to upload
 * @param {(progress: number) => void} onProgress - Progress callback (0-100)
 * @returns {Promise<{status, file_name, file_size_mb, summary, extracted_chars}>}
 */
export async function uploadDocument(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress?.(pct);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          // FastAPI error detail is in data.detail
          reject(new Error(data.detail || `Server error (${xhr.status})`));
        }
      } catch {
        reject(new Error('Invalid response from server.'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error — could not reach the server. Is the backend running?'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Request timed out. The server took too long to respond.'));
    });

    xhr.timeout = 120_000; // 2 minutes for large files + AI processing
    xhr.open('POST', `${API_BASE}/upload`);
    xhr.send(formData);
  });
}
