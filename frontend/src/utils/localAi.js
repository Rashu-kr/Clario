import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * --- TEXT EXTRACTION UTILITIES ---
 */

/**
 * Extracts raw text from a PDF file using pdfjs-dist page readers.
 */
export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  // Load the PDF structure into browser memory
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  // Loop through document pages sequentially to compile the full text
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

/**
 * Extracts raw text from a Word (.docx) file using the mammoth converter library.
 */
export async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  // Perform lightweight browser-side Docx XML parsing
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/**
 * Extracts text from a plain text (.txt) file using the browser FileReader API.
 */
export async function extractTextFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

/**
 * Orchestrator function to detect file extension and run the matching text extractor.
 */
export async function extractText(file) {
  const extension = file.name.split('.').pop().toLowerCase();

  if (extension === 'pdf') {
    return extractTextFromPdf(file);
  } else if (extension === 'docx' || extension === 'doc') {
    return extractTextFromDocx(file);
  } else if (extension === 'txt') {
    return extractTextFromTxt(file);
  } else {
    throw new Error(`Unsupported file type: ${extension}`);
  }
}

/**
 * --- SLIDING WINDOW CHUNKING ---
 * Splits long documents into smaller semantic chunks to avoid model token context window limits.
 * Uses a sliding window mechanism to preserve word contexts across boundaries.
 */
export function chunkText(text, chunkSize = 250, overlap = 40) {
  const words = text.trim().split(/\s+/);
  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunkWords = words.slice(start, end);
    const chunk = chunkWords.join(' ');

    // Filter out extremely short/meaningless trailing fragments
    if (chunk.trim().length > 30) {
      chunks.push(chunk.trim());
    }

    if (end === words.length) break;
    start += chunkSize - overlap; // Shift the start boundary back by the overlap offset
  }

  return chunks;
}

/**
 * --- LOCAL UNSUPERVISED ML ALGORITHMS ---
 */

/**
 * TF-IDF Vectorizer
 * 
 * Implements standard Term Frequency - Inverse Document Frequency vector space modeling in pure JS.
 * Maps variable-length text chunks into a normalized numerical vector space.
 */
export class TfidfVectorizer {
  constructor() {
    this.vocabulary = [];    // Unique token list
    this.vocabIndex = {};    // Token-to-dimension coordinate mappings
    this.idf = [];           // Cached IDF weights
    this.docCount = 0;
  }

  /**
   * Tokenizes text, removes punctuation, downcases, and filters common stopwords.
   */
  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'were'].includes(w));
  }

  /**
   * Fits document frequencies and transforms document strings into normalized dense arrays.
   */
  fitTransform(docs) {
    this.docCount = docs.length;
    const termDocCounts = {};
    const termFreqs = [];

    // Count word occurrences across documents
    docs.forEach((doc) => {
      const tokens = this.tokenize(doc);
      const freqs = {};
      const uniqueTokens = new Set(tokens);

      tokens.forEach(token => {
        freqs[token] = (freqs[token] || 0) + 1;
      });

      termFreqs.push(freqs);

      uniqueTokens.forEach(token => {
        termDocCounts[token] = (termDocCounts[token] || 0) + 1;
      });
    });

    // Populate dimension index mapping
    const vocabSet = new Set(Object.keys(termDocCounts));
    this.vocabulary = Array.from(vocabSet);
    this.vocabIndex = {};
    this.vocabulary.forEach((word, idx) => {
      this.vocabIndex[word] = idx;
    });

    // Compute IDF weights with smoothing to prevent zero divisions: log(N / df) + 1
    this.idf = this.vocabulary.map(word => {
      const df = termDocCounts[word] || 0;
      return Math.log((1 + this.docCount) / (1 + df)) + 1;
    });

    // Generate dense TF-IDF vectors
    const tfidfMatrix = docs.map((doc, idx) => {
      const freqs = termFreqs[idx];
      const vector = new Array(this.vocabulary.length).fill(0);

      Object.keys(freqs).forEach(word => {
        if (word in this.vocabIndex) {
          const vocabIdx = this.vocabIndex[word];
          vector[vocabIdx] = freqs[word] * this.idf[vocabIdx];
        }
      });

      // L2 Normalization: forces vector magnitude to 1.0 (so dot product equals cosine similarity)
      let sumSq = 0;
      for (let i = 0; i < vector.length; i++) {
        sumSq += vector[i] * vector[i];
      }
      const norm = Math.sqrt(sumSq);
      if (norm > 0) {
        for (let i = 0; i < vector.length; i++) {
          vector[i] /= norm;
        }
      }

      return vector;
    });

    return tfidfMatrix;
  }

  /**
   * Identifies top keywords by summing TF-IDF coordinates across all vectors.
   */
  getKeywords(tfidfMatrix, topN = 10) {
    if (this.vocabulary.length === 0) return [];

    const vocabScores = new Array(this.vocabulary.length).fill(0);
    tfidfMatrix.forEach(vector => {
      for (let i = 0; i < vector.length; i++) {
        vocabScores[i] += vector[i];
      }
    });

    const keywordScores = this.vocabulary.map((word, idx) => ({
      word,
      score: vocabScores[idx]
    }));

    keywordScores.sort((a, b) => b.score - a.score);
    return keywordScores.slice(0, topN).map(item => item.word);
  }
}

/**
 * Computes Dot Product between two vectors.
 */
export function dotProduct(v1, v2) {
  let sum = 0;
  const len = Math.min(v1.length, v2.length);
  for (let i = 0; i < len; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
}

/**
 * K-Means Clustering
 * 
 * Groups vector representations into thematic clusters using iterative centroid shifting.
 */
export function kmeans(matrix, nClusters, maxIterations = 10) {
  const nDocs = matrix.length;
  if (nDocs === 0) return { labels: [], centroids: [] };
  const nDims = matrix[0].length;
  const k = Math.min(nClusters, nDocs);

  // Initialize centroids from random documents
  let centroids = [];
  const selectedIdx = new Set();
  while (centroids.length < k) {
    const randomIdx = Math.floor(Math.random() * nDocs);
    if (!selectedIdx.has(randomIdx)) {
      selectedIdx.add(randomIdx);
      centroids.push([...matrix[randomIdx]]);
    }
  }

  let labels = new Array(nDocs).fill(-1);
  let centroidsChanged = true;
  let iter = 0;

  // Run clustering loops
  while (centroidsChanged && iter < maxIterations) {
    centroidsChanged = false;
    iter++;

    // Assignment: assign each point to its closest centroid
    const newLabels = [];
    for (let i = 0; i < nDocs; i++) {
      let bestSim = -Infinity;
      let bestLabel = 0;

      for (let c = 0; c < k; c++) {
        const sim = dotProduct(matrix[i], centroids[c]);
        if (sim > bestSim) {
          bestSim = sim;
          bestLabel = c;
        }
      }
      newLabels.push(bestLabel);
    }

    // Convergence Check: stop if label assignments stabilize
    for (let i = 0; i < nDocs; i++) {
      if (labels[i] !== newLabels[i]) {
        labels = newLabels;
        centroidsChanged = true;
        break;
      }
    }

    if (!centroidsChanged) break;

    // Update Centroids: compute mean of assigned coordinates
    const newCentroids = Array.from({ length: k }, () => new Array(nDims).fill(0));
    const counts = new Array(k).fill(0);

    for (let i = 0; i < nDocs; i++) {
      const label = labels[i];
      counts[label]++;
      for (let d = 0; d < nDims; d++) {
        newCentroids[label][d] += matrix[i][d];
      }
    }

    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        for (let d = 0; d < nDims; d++) {
          newCentroids[c][d] /= counts[c];
        }
        // Normalize centroids to maintain cosine unit metrics
        let sumSq = 0;
        for (let d = 0; d < nDims; d++) {
          sumSq += newCentroids[c][d] * newCentroids[c][d];
        }
        const norm = Math.sqrt(sumSq);
        if (norm > 0) {
          for (let d = 0; d < nDims; d++) {
            newCentroids[c][d] /= norm;
          }
        }
      } else {
        newCentroids[c] = [...centroids[c]];
      }
    }
    centroids = newCentroids;
  }

  return { labels, centroids };
}

/**
 * Assigns category themes based on clustered TF-IDF keyword heuristics.
 */
export function detectTheme(keywords) {
  const keywordText = keywords.join(' ').toLowerCase();

  const billingWords = ["bill", "billing", "invoice", "amount", "payment", "paid", "due", "charge"];
  const medicalWords = ["patient", "diagnosis", "doctor", "treatment", "medicine", "hospital", "symptom"];
  const claimWords = ["claim", "policy", "insurance", "rejected", "approved", "verification", "proof"];
  const riskWords = ["missing", "mismatch", "pending", "delay", "reject", "error", "failed"];

  if (riskWords.some(word => keywordText.includes(word))) return "Risk / Issue Related";
  if (claimWords.some(word => keywordText.includes(word))) return "Claim / Insurance Related";
  if (billingWords.some(word => keywordText.includes(word))) return "Billing / Payment Related";
  if (medicalWords.some(word => keywordText.includes(word))) return "Medical / Patient Related";
  return "General Document Information";
}

/**
 * Calculates a basic heuristic Risk Score based on occurance weights of legal/billing risk terms.
 */
export function calculateRiskScore(text) {
  const riskTerms = {
    "rejected": 15,
    "reject": 15,
    "missing": 12,
    "mismatch": 12,
    "pending": 8,
    "delay": 8,
    "failed": 10,
    "error": 7,
    "incomplete": 10,
    "not approved": 15,
    "verification": 5,
    "proof": 5,
    "claim": 5,
    "policy": 4
  };

  const textLower = text.toLowerCase();
  let score = 0;
  const reasons = [];

  Object.entries(riskTerms).forEach(([term, weight]) => {
    const regex = new RegExp(term.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\//g, '\\/'), 'g');
    const matches = textLower.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      // Score adds capped at double-weight limit per token keyword type
      const addedScore = Math.min(count * weight, weight * 2);
      score += addedScore;
      reasons.push(`Found risk term '${term}' ${count} time(s)`);
    }
  });

  score = Math.min(score, 100);
  let level = "Low";
  if (score >= 70) level = "High";
  else if (score >= 40) level = "Medium";

  return {
    risk_score: score,
    risk_level: level,
    risk_reasons: reasons.slice(0, 6)
  };
}

/**
 * Selects chunks containing the highest similarity to the average document vector
 * to serve as important/representative summary snippets.
 */
export function getImportantSections(chunks, tfidfMatrix, topN = 3) {
  if (chunks.length === 0) return [];

  const nDocs = chunks.length;
  const nDims = tfidfMatrix[0].length;

  // Calculate average document centroid vector
  const avgVector = new Array(nDims).fill(0);
  tfidfMatrix.forEach(vector => {
    for (let d = 0; d < nDims; d++) {
      avgVector[d] += vector[d];
    }
  });

  for (let d = 0; d < nDims; d++) {
    avgVector[d] /= nDocs;
  }

  // Normalize average vector
  let sumSq = 0;
  for (let d = 0; d < nDims; d++) {
    sumSq += avgVector[d] * avgVector[d];
  }
  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (let d = 0; d < nDims; d++) {
      avgVector[d] /= norm;
    }
  }

  // Calculate cosine similarities (dot products)
  const similarities = tfidfMatrix.map(vector => dotProduct(vector, avgVector));

  const items = similarities.map((sim, idx) => ({
    section: chunks[idx],
    importance_score: Math.round(sim * 100 * 100) / 100
  }));

  items.sort((a, b) => b.importance_score - a.importance_score);
  return items.slice(0, Math.min(topN, chunks.length));
}

/**
 * Formulates a dynamic markdown executive summary.
 */
export function buildSummary(keywords, clusters, risk) {
  const mainTopics = keywords.slice(0, 8).join(', ');
  const clusterThemes = clusters.map(c => c.theme);
  const uniqueThemes = Array.from(new Set(clusterThemes));

  let summary = `This document mainly focuses on: ${mainTopics || 'general themes'}.`;
  if (uniqueThemes.length > 0) {
    summary += ` The detected themes are: ${uniqueThemes.join(', ')}.`;
  }
  summary += ` The calculated risk level is ${risk.risk_level} with a risk score of ${risk.risk_score}/100.`;

  return summary;
}

/**
 * Top-level Orchestrator for Unsupervised Document Analysis.
 * Runs complete extraction-to-clustering metrics locally.
 */
export function analyzeDocumentText(text) {
  const chunks = chunkText(text);

  if (chunks.length === 0) {
    return {
      summary: "No valid text found in the document.",
      keywords: [],
      clusters: [],
      important_sections: [],
      risk_score: 0,
      risk_level: "Low",
      risk_reasons: [],
      total_chunks: 0
    };
  }

  const vectorizer = new TfidfVectorizer();
  const tfidfMatrix = vectorizer.fitTransform(chunks);

  const keywords = vectorizer.getKeywords(tfidfMatrix);
  
  const numberClusters = Math.min(3, chunks.length);
  const { labels } = kmeans(tfidfMatrix, numberClusters);

  const clusters = [];
  for (let c = 0; c < numberClusters; c++) {
    const indices = [];
    labels.forEach((lbl, idx) => {
      if (lbl === c) indices.push(idx);
    });

    if (indices.length === 0) continue;

    const clusterMatrix = indices.map(idx => tfidfMatrix[idx]);
    const clusterKeywords = vectorizer.getKeywords(clusterMatrix, 8);
    const sampleSections = indices.slice(0, 2).map(idx => chunks[idx].slice(0, 300));

    clusters.push({
      cluster_id: c,
      theme: detectTheme(clusterKeywords),
      keywords: clusterKeywords,
      total_sections: indices.length,
      sample_sections: sampleSections
    });
  }

  const risk = calculateRiskScore(text);
  const important_sections = getImportantSections(chunks, tfidfMatrix);
  const summary = buildSummary(keywords, clusters, risk);

  return {
    summary,
    keywords,
    clusters,
    important_sections,
    risk_score: risk.risk_score,
    risk_level: risk.risk_level,
    risk_reasons: risk.risk_reasons,
    total_chunks: chunks.length
  };
}

/**
 * Answers a user's question locally using a simple TF-IDF vector similarity matcher.
 */
export function answerQuestion(text, question) {
  const chunks = chunkText(text);

  if (chunks.length === 0) {
    return {
      answer: "No valid document text found.",
      relevance_score: 0,
      evidence: []
    };
  }

  // Treat the question as a document and project it into TF-IDF vector space
  const documents = [...chunks, question];
  const vectorizer = new TfidfVectorizer();
  const tfidfMatrix = vectorizer.fitTransform(documents);

  // Extract vectors
  const chunkVectors = tfidfMatrix.slice(0, -1);
  const questionVector = tfidfMatrix[tfidfMatrix.length - 1];

  // Calculate cosine similarity scores
  const similarities = chunkVectors.map(vec => dotProduct(questionVector, vec));

  const evidence = [];
  similarities.forEach((sim, idx) => {
    const score = Math.round(sim * 100 * 100) / 100;
    if (score > 0) {
      evidence.push({
        section: chunks[idx],
        score
      });
    }
  });

  // Sort chunks by TF-IDF similarity distance
  evidence.sort((a, b) => b.score - a.score);

  if (evidence.length === 0) {
    return {
      answer: "I could not find a strong matching answer in this document.",
      relevance_score: 0,
      evidence: []
    };
  }

  const bestScore = evidence[0].score;
  const answer = "Based on the document, the most relevant information is found in the evidence sections below.";

  return {
    answer,
    relevance_score: bestScore,
    evidence: evidence.slice(0, 3)
  };
}
