import { pipeline, env } from '@xenova/transformers';

/**
 * Transformers Environment Configuration
 * Disables searching local disk paths for models to force loading/caching
 * from Hugging Face / remote CDN, saving cache directly in the browser's Cache API.
 */
env.allowLocalModels = false;

// Global reference to the loaded embeddings pipeline
let embedder = null;

/**
 * Singleton Embedder Instance Resolver
 * Downloads the Xenova/all-MiniLM-L6-v2 ONNX model (approx. 22MB) on first execution
 * and caches it. Reports download progress via the provided progress callback.
 */
async function getEmbedder(progress_callback) {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      progress_callback
    });
  }
  return embedder;
}

/**
 * Web Worker Message Listener
 * Handles asynchronous background computations:
 * 1. 'init': Resolves ONNX model cache initialization and reports progress events.
 * 2. 'embed': Computes 384-dimensional dense vectors for document chunks.
 * 3. 'cosine_similarity': Executes vector similarity calculations.
 */
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  if (type === 'init') {
    // --- PIPELINE HANDSHAKE INITIALIZATION ---
    try {
      await getEmbedder((progress) => {
        if (progress.status === 'progress') {
          // Report download progress bytes back to the React UI main thread
          self.postMessage({
            type: 'init_progress',
            data: {
              file: progress.file,
              progress: progress.progress || (progress.loaded / progress.total),
              loaded: progress.loaded,
              total: progress.total
            }
          });
        }
      });
      self.postMessage({ type: 'init_complete' });
    } catch (error) {
      self.postMessage({ type: 'error', data: error.message });
    }
  } else if (type === 'embed') {
    // --- INFERENCE EMBEDDING GENERATION ---
    const { texts } = data;
    try {
      const model = await getEmbedder();
      const embeddings = [];

      for (const text of texts) {
        // Pooling: 'mean' averages token embeddings. Normalize: true normalizes to L2 distance.
        const output = await model(text, { pooling: 'mean', normalize: true });
        
        // Convert the Float32 ONNX tensor data into a standard JavaScript array
        const vector = Array.from(output.data);
        embeddings.push(vector);
      }

      self.postMessage({ type: 'embed_complete', data: { embeddings } });
    } catch (error) {
      self.postMessage({ type: 'error', data: error.message });
    }
  } else if (type === 'cosine_similarity') {
    // --- COSINE SIMILARITY RETRIEVAL CALCULATIONS ---
    const { queryEmbedding, chunkEmbeddings } = data;
    try {
      // Since outputs from our model are pre-normalized (L2 norm = 1),
      // Cosine Similarity is computed simply as the Dot Product between query & chunk vectors
      const similarities = chunkEmbeddings.map((chunkVec) => {
        let dotProduct = 0;
        const len = Math.min(queryEmbedding.length, chunkVec.length);
        for (let i = 0; i < len; i++) {
          dotProduct += queryEmbedding[i] * chunkVec[i];
        }
        return dotProduct;
      });
      self.postMessage({ type: 'cosine_similarity_complete', data: { similarities } });
    } catch (error) {
      self.postMessage({ type: 'error', data: error.message });
    }
  }
});
