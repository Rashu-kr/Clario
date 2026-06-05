import { useState } from "react";
import {
  extractText,
  analyzeDocumentText,
  answerQuestion,
} from "../utils/localAi";

/**
 * UnsupervisedAnalyzer Component
 * 
 * Demonstrates local-only unsupervised machine learning operations.
 * Renders file picker interface, displays local clustering output themes,
 * risk scores, keywords, and performs browser-side evidence retrieval for user queries.
 */
export default function UnsupervisedAnalyzer() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  /**
   * Reads file and calculates local TF-IDF vector matrix,
   * runs K-Means clustering, keywords extraction, and document risk assessments.
   */
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setAnalysis(null);
      setAnswer(null);

      // Extract raw text from target document file format
      const text = await extractText(file);
      setExtractedText(text);

      // Execute local mathematical analysis routines
      const result = analyzeDocumentText(text);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Evaluates text similarity coordinates to return top matched segments
   * answering the user question locally.
   */
  const handleAsk = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setError("");
      setAsking(true);
      setAnswer(null);

      let text = extractedText;
      if (!text) {
        text = await extractText(file);
        setExtractedText(text);
      }

      // Query chunk similarity vectors in JS
      const result = answerQuestion(text, question);
      setAnswer(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Unsupervised ML Document Analyzer
          </h1>
          <p className="mt-2 text-slate-600">
            Analyze documents using TF-IDF, K-Means clustering, cosine similarity,
            keyword extraction, and risk scoring without external AI API.
          </p>
        </div>

        {/* Ingest Card */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <label className="block text-sm font-medium text-slate-700">
            Upload PDF, DOCX, or TXT
          </label>

          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-3 block w-full rounded-lg border border-slate-300 p-3"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Document"}
          </button>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
              {error}
            </p>
          )}
        </div>

        {/* Local Analysis Statistics display */}
        {analysis && (
          <div className="mt-6 grid gap-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
              <p className="mt-3 text-slate-700">{analysis.summary}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Risk Level */}
              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-slate-900">
                  Risk Score
                </h2>
                <p className="mt-3 text-4xl font-bold text-slate-900">
                  {analysis.risk_score}/100
                </p>
                <p className="mt-1 text-slate-600">
                  Risk Level:{" "}
                  <span className="font-semibold">{analysis.risk_level}</span>
                </p>

                {analysis.risk_reasons?.length > 0 && (
                  <ul className="mt-4 list-disc pl-5 text-slate-700">
                    {analysis.risk_reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Keyword tags */}
              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-slate-900">
                  Keywords
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.keywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Clusters and themes derived via browser K-Means */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-slate-900">
                Detected Clusters / Themes
              </h2>

              <div className="mt-4 grid gap-4">
                {analysis.clusters?.map((cluster) => (
                  <div
                    key={cluster.cluster_id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <h3 className="font-semibold text-slate-900">
                      Cluster {cluster.cluster_id}: {cluster.theme}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Total Sections: {cluster.total_sections}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {cluster.keywords?.map((keyword, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most representative average sections */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-slate-900">
                Important Sections
              </h2>

              <div className="mt-4 grid gap-4">
                {analysis.important_sections?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-600">
                      Importance Score: {item.importance_score}%
                    </p>
                    <p className="mt-2 text-slate-700">{item.section}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Browser-side vector evidence query section */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-900">
            Ask Question From Document
          </h2>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Example: What is this document about?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 p-3"
            />

            <button
              onClick={handleAsk}
              disabled={asking}
              className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {asking ? "Finding..." : "Ask"}
            </button>
          </div>

          {answer && (
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">Answer</h3>
              <p className="mt-2 text-slate-700">{answer.answer}</p>

              <p className="mt-3 text-sm font-semibold text-slate-600">
                Relevance Score: {answer.relevance_score}%
              </p>

              <h4 className="mt-4 font-semibold text-slate-900">
                Evidence Sections
              </h4>

              <div className="mt-3 grid gap-3">
                {answer.evidence?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-slate-50 p-3 text-slate-700"
                  >
                    <p className="text-sm font-semibold">
                      Match Score: {item.score}%
                    </p>
                    <p className="mt-2">{item.section}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}