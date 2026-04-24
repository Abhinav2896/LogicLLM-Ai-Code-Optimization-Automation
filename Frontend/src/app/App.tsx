/**
 * App Component
 * Root component, state, layout
 */
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ActionBar from './components/ActionBar';
import OutputPanel from './components/OutputPanel';
import { FileCode, Cpu } from 'lucide-react';

export default function App() {
  const [code, setCode]                   = useState("");
  const [result, setResult]               = useState<any>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [processingStep, setProcessingStep] = useState("");
  const [metadata, setMetadata]           = useState<any>(null);
  
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const handleAnalyze = async () => {

    // --- Step 1: Input Validation ---
    // Prevent empty submissions and show inline error message
    if (!code.trim()) {
      setError("⚠️ Please paste some code before analyzing.");
      return;
    }

    // --- Step 2: Reset State ---
    // Clear previous results, errors, and metadata before new request
    setError("");
    setLoading(true);
    setResult(null);
    setMetadata(null);
    setProcessingStep("");

    // --- Step 3: AI Thinking Simulation ---
    // Cycles through processing messages to simulate AI activity
    // This runs in parallel while the actual API call is in progress
    const steps = [
      "Analyzing structure...",
      "Detecting bugs...",
      "Generating improvements...",
      "Optimizing code...",
    ];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setProcessingStep(step);
      }, index * 900);
    });

    // =====================================================
    // 🔥 BACKEND CONNECTION START
    // =====================================================
    // This is where the frontend sends the user's code to
    // the Node.js backend for AI-powered analysis.
    //
    // Endpoint  : POST /api/analyze
    // Method    : POST
    //
    // Request Body sent from frontend:
    // {
    //   code: user input (raw string — any programming language)
    // }
    //
    // Backend Responsibilities:
    //   1. Receive the raw code string
    //   2. Auto-detect the programming language using AI
    //   3. Analyze code with OpenAI API using a structured prompt
    //   4. Generate: bugs, improvements, explanation, optimized_code
    //   5. Calculate a code quality score (0–100)
    //   6. Record time taken for analysis
    //   7. Return structured JSON to the frontend
    //
    // Backend Stack    : Node.js + Express + OpenAI SDK
    // Deployment       : Vercel serverless function at /api/analyze
    // The relative URL "/api/analyze" resolves automatically on Vercel
    // =====================================================

    try {

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
        // ^ Sends only the raw code — backend handles everything else
      });

      // =====================================================
      // 🔥 BACKEND CONNECTION END
      // =====================================================

      // --- HTTP Error Check ---
      // If server returned 4xx or 5xx, throw for the catch block
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // =====================================================
      // 🔥 BACKEND RESPONSE HANDLING START
      // =====================================================
      // The backend returns a fully structured JSON object.
      //
      // Expected response shape:
      // {
      //   bugs:           [],        // Array of bug description strings
      //   improvements:   [],        // Array of improvement strings
      //   explanation:    "",        // Plain-English code explanation
      //   optimized_code: "",        // Full optimized code as a string
      //   language:       "JavaScript", // Auto-detected by AI
      //   score:          82,        // Code quality score 0–100
      //   time:           "1.2s"     // Time taken by backend to process
      // }
      //
      // The full object is stored in `result` state.
      // Metadata fields (language, score, time) are also extracted
      // into the `metadata` state for the metadata bar display.
      // =====================================================

      const data = await response.json();

      setResult(data);
      // ^ Triggers the full result panel to render in the UI

      setMetadata({
        language: data.language,
        score: data.score,
        time: data.time,
      });
      // ^ Drives the metadata bar at the top of the result panel

      // =====================================================
      // 🔥 BACKEND RESPONSE HANDLING END
      // =====================================================

    } catch (err) {

      // --- Error Handling ---
      // Covers network failures, server errors, and JSON parse errors
      setError(
        "❌ Something went wrong while analyzing your code. " +
        "Please check your connection and try again."
      );
      console.error("handleAnalyze Error:", err);

    } finally {

      // Always runs — clean up loading and thinking simulation state
      setLoading(false);
      setProcessingStep("");
      // ^ Hides spinner and clears AI thinking text

    }
  };

  const handleClear = () => {
    setCode("");
    setResult(null);
    setError("");
    setMetadata(null);
    setProcessingStep("");
    // ^ Resets every piece of state — restores the empty/initial UI
    // ^ Does NOT trigger an API call under any circumstance
  };

  const handleReanalyze = () => {
    // Clears only the previous result and re-triggers analysis
    // Keeps the code in the textarea intact
    setResult(null);
    setMetadata(null);
    setError("");
    handleAnalyze();
    // ^ Reuses the same code currently in the textarea
  };

  const handleSample = () => {
    setCode(`function processUser(user) {\n  let x = 42;\n  console.log("Processing: " + user.name);\n  return user.id;\n}`);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-review-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#D1D5DB] font-sans antialiased overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-100">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full min-h-[650px]">
          {/* Left Panel: Input (55%) */}
          <div className="lg:col-span-7 flex flex-col bg-[#111827] border border-[#374151] rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] h-full w-full">
            {/* Input Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-[18px] h-[18px] text-blue-400" />
                <h2 className="text-[15px] font-semibold text-white">Source Code</h2>
              </div>
              
              {metadata?.language ? (
                <div className="flex items-center gap-1.5 bg-blue-900/40 text-blue-400 text-xs px-2.5 py-1 rounded-md border border-blue-800/50">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Detected: {metadata.language}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-md border border-gray-700/50">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Auto-detect language</span>
                </div>
              )}
            </div>
            
            <CodeInput 
              code={code} 
              setCode={setCode} 
              disabled={loading} 
            />

            {error && (
              <div className="mt-4 px-3 py-2.5 bg-red-900/20 border border-red-900/50 rounded-xl text-[13px] text-red-400">
                {error}
              </div>
            )}

            <ActionBar 
              loading={loading}
              onClear={handleClear}
              onSample={handleSample}
              onAnalyze={handleAnalyze}
              hasCode={code.trim().length > 0}
            />
          </div>

          {/* Right Panel: Output (45%) */}
          <div className="lg:col-span-5 h-full w-full lg:min-h-[700px]">
            <OutputPanel
              loading={loading}
              result={result}
              metadata={metadata}
              processingStep={processingStep}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onDownload={handleDownload}
              onReanalyze={handleReanalyze}
              onClearResults={() => { setResult(null); setMetadata(null); }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
