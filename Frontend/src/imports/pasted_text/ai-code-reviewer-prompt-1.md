━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 MASTER PROMPT — AI Code Reviewer: Full UX Enhancement Layer
        Senior Frontend Engineer + AI Experience Specialist Edition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a senior frontend engineer and UI/UX specialist with deep
expertise in React, Tailwind CSS, and building intelligent AI-powered
web experiences.

You have been given an existing React JSX codebase that was converted
from a Figma design for an AI-powered Code Reviewer application.

The visual design and layout are already complete.
Your job is NOT to redesign or restyle anything.

Your ONLY responsibilities are:
  ✅ Preserve every existing Tailwind class and layout structure exactly
  ✅ Add complete React state management with all required variables
  ✅ Implement handleAnalyze() with full async logic and exact comments
  ✅ Build an AI thinking simulation system during the loading phase
  ✅ Add metadata display (detected language, quality score, time taken)
  ✅ Add a color-coded code quality score system
  ✅ Build a structured result panel with all 5 sections
  ✅ Improve the empty state with icons and feature tags
  ✅ Add all UX micro-interactions (hover, glow, disable, transitions)
  ✅ Add Re-analyze and Clear Results controls in the output panel
  ✅ Make the entire frontend plug-and-play ready for a Node.js backend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PROJECT OVERVIEW & USER FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an AI-powered Code Reviewer application.

Complete user flow:
  Step 1 → User pastes any code snippet into the textarea input
  Step 2 → User clicks the "Analyze Code" button
  Step 3 → Frontend validates input, sets loading state, begins simulation
  Step 4 → AI thinking steps animate in the right panel while waiting
  Step 5 → Frontend sends code to the Node.js backend via POST /api/analyze
  Step 6 → Backend uses OpenAI API to analyze code and returns JSON
  Step 7 → Frontend receives and stores the structured response
  Step 8 → Right panel renders:
               · Metadata bar (language, score, time taken)
               · 🐞 Bugs Found
               · 💡 Suggestions & Improvements
               · 📖 Code Explanation
               · ✨ Optimized Code block with copy button

KEY DESIGN CONSTRAINTS:
  - There is NO language selector — the backend AI detects it automatically
  - The detected language is returned in the API response and displayed
    as a badge in the metadata bar after the result loads
  - The frontend only sends raw code; the backend handles everything else

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 STRICT RULES — READ BEFORE WRITING ANY CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✗ DO NOT redesign, restyle, or change any existing Tailwind classes
  ✗ DO NOT alter the layout structure or component hierarchy
  ✗ DO NOT add new visual components not implied by the Figma design
  ✗ DO NOT add any backend, server, or OpenAI logic in the frontend
  ✗ DO NOT add a language selector dropdown (backend handles this)
  ✗ DO NOT add new third-party libraries (only react + lucide-react)
  ✗ DO NOT use class-based components or TypeScript
  ✗ DO NOT leave TODO, placeholder, or "add logic here" comments
  ✗ DO NOT modify the required backend comment blocks — copy verbatim
  ✗ DO NOT add inline styles — Tailwind utility classes only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 STATE MANAGEMENT — ADD ALL SIX VARIABLES TO MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Declare all six state variables using React useState inside App.jsx
(or whatever the root component is named):

  const [code, setCode]                   = useState("");
  // Stores the raw code string pasted by the user into the textarea

  const [result, setResult]               = useState(null);
  // Stores the full structured JSON response returned by the backend
  // Shape: { bugs, improvements, explanation, optimized_code,
  //          language, score, time }

  const [loading, setLoading]             = useState(false);
  // Boolean — true while the API request is in progress

  const [error, setError]                 = useState("");
  // Stores error message string; empty string means no active error

  const [processingStep, setProcessingStep] = useState("");
  // Stores the current AI thinking step text shown during loading
  // Example values: "Analyzing structure...", "Detecting bugs..."

  const [metadata, setMetadata]           = useState(null);
  // Stores extracted display metadata after result loads
  // Shape: { language: "JavaScript", score: 82, time: "1.2s" }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI THINKING SIMULATION SYSTEM — FULL SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is one of the most important UX features. It makes the app feel
like a real AI system is actively working, not just waiting for a fetch.

HOW IT WORKS:
  - While loading === true, cycle through a sequence of processing
    step messages using setTimeout calls
  - Each message updates the processingStep state, which is displayed
    in the right panel as the current AI action

IMPLEMENTATION:

  const runThinkingSimulation = () => {
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
      // Each step appears 900ms after the previous one
    });
  };

  Call runThinkingSimulation() immediately before the fetch call
  inside handleAnalyze().

  Clear processingStep by calling setProcessingStep("") inside the
  finally block after loading is complete.

DISPLAY IN RIGHT PANEL (during loading === true):
  - A single animated row in the center/top of the right panel
  - Icon: Loader2 with animate-spin from lucide-react (text-blue-400)
  - Text: display processingStep value dynamically
  - Font: 13px, text-gray-300
  - Below that: animated skeleton blocks (4 sections)
  - The step text transitions smoothly as it updates

DESIGN OF THE THINKING DISPLAY BLOCK:
  - Container: flex flex-col items-center justify-center gap-3
  - Icon row: Loader2 (16px, animate-spin, text-violet-400) + step text
  - Step text: text-sm text-gray-300, with transition-all duration-300
  - Below step text: a subtle progress dots animation
    "· · ·" cycling with opacity pulse
  - Bottom of the block: "Powered by OpenAI" in text-gray-600 text-xs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ FUNCTION: handleAnalyze() — IMPLEMENT WITH ALL EXACT COMMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create or enhance handleAnalyze() inside the main component.
This is an async function. Follow this exact structure:

─────────────────────────────────────────────────────────────────────
FULL FUNCTION — COPY THIS EXACTLY INCLUDING ALL COMMENTS:
─────────────────────────────────────────────────────────────────────

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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 FUNCTION: handleClear() — FULL RESET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleClear = () => {
    setCode("");
    setResult(null);
    setError("");
    setMetadata(null);
    setProcessingStep("");
    // ^ Resets every piece of state — restores the empty/initial UI
    // ^ Does NOT trigger an API call under any circumstance
  };

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 FUNCTION: handleReanalyze() — RE-RUN WITHOUT CLEARING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleReanalyze = () => {
    // Clears only the previous result and re-triggers analysis
    // Keeps the code in the textarea intact
    setResult(null);
    setMetadata(null);
    setError("");
    handleAnalyze();
    // ^ Reuses the same code currently in the textarea
  };

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 WIRE UP HANDLERS — CONNECT STATE TO EXISTING UI ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Without changing any visual structure, connect state to elements:

TEXTAREA:
  value={code}
  onChange={(e) => setCode(e.target.value)}
  disabled={loading}
  // Remains visible and readable but not editable while loading

ANALYZE BUTTON:
  onClick={handleAnalyze}
  disabled={loading}
  // Label: loading ? "Analyzing..." : "Analyze Code"
  // Icon:  loading ? <Loader2 className="animate-spin" /> : <Play />

CLEAR BUTTON:
  onClick={handleClear}
  disabled={loading}

RE-ANALYZE BUTTON (inside result panel, only when result !== null):
  onClick={handleReanalyze}
  disabled={loading}
  // Label: "Re-analyze"
  // Icon:  RefreshCw from lucide-react

CLEAR RESULTS BUTTON (inside result panel, only when result !== null):
  onClick={() => { setResult(null); setMetadata(null); }}
  // Label: "Clear Results"
  // Icon:  X from lucide-react

ERROR BLOCK:
  {error && (
    <div className="...existing error styles...">
      {error}
    </div>
  )}

OUTPUT PANEL:
  {loading && <ThinkingPanel processingStep={processingStep} />}
  {result && !loading && <ResultPanel result={result} metadata={metadata} />}
  {!result && !loading && <EmptyState />}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ LOADING STATE — FULL SYSTEM SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When loading === true, apply ALL of the following simultaneously:

LEFT PANEL CHANGES:
  - "Analyze Code" button icon → Loader2 with animate-spin
  - "Analyze Code" button text → "Analyzing..."
  - Both "Analyze Code" and "Clear" buttons → disabled + opacity-50
    + cursor-not-allowed
  - Textarea → disabled, pointer-events-none

RIGHT PANEL CHANGES:
  Replace content with the Thinking Panel:

  TOP ROW — AI Thinking Steps Display:
    - Icon: Loader2 (animate-spin, text-violet-400, size 16px)
    - Text: current processingStep value (updates every ~900ms)
    - Font: text-sm, text-gray-300
    - transition-all duration-300 on the text to smooth the step change
    - Below: three animated dots "· · ·" using animate-pulse

  SKELETON BLOCKS BELOW:
    Show 4 animated skeleton cards simulating the 4 result sections.
    Each block uses animate-pulse.

    Block 1 — Bugs Skeleton:
      · bg-gray-800/50 rounded-xl p-4 mb-3
      · Label bar: w-20 h-2.5 bg-gray-700 rounded mb-3
      · Content rows: w-full h-2 bg-gray-700/60 rounded (3 rows,
        widths: 100%, 80%, 65%, spaced gap-2)

    Block 2 — Improvements Skeleton:
      · Same structure, label bar w-28, rows: 100%, 75%, 55%

    Block 3 — Explanation Skeleton:
      · Label bar w-24, four rows: 100%, 100%, 90%, 60%

    Block 4 — Optimized Code Skeleton:
      · Label bar w-32
      · Tall block: h-28 bg-gray-800 rounded-xl (simulates code block)

    STAGGER DELAYS on blocks:
      · Block 1: no delay
      · Block 2: animation-delay 100ms
      · Block 3: animation-delay 200ms
      · Block 4: animation-delay 300ms

  FOOTER TEXT (bottom of right panel, centered):
    "🤖 AI is reviewing your code..."
    Font: text-xs, text-gray-600

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESULT PANEL — FULL STRUCTURE SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visible only when: result !== null AND loading === false

Animate entrance: opacity-0 → opacity-100, translateY(10px) → translateY(0)
Duration: 400ms ease-out

RENDER ORDER (top to bottom):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCK 1 — METADATA BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Layout: flex flex-row gap-3 flex-wrap items-center
  Margin bottom: 16px

  Contains 3 badges/pills:

  1. Language Badge:
     - Text: "Detected: {metadata.language}"
     - Icon: Code2 (10px, left of text)
     - Style: bg-blue-900/40 text-blue-400 text-xs px-3 py-1 rounded-full
       border border-blue-800/50

  2. Score Badge:
     - Text: "Score: {metadata.score}/100"
     - Icon: BarChart2 (10px, left of text)
     - Color logic based on score value:
         score >= 80 → bg-green-900/40 text-green-400 border-green-800/50
         score >= 50 → bg-amber-900/40 text-amber-400 border-amber-800/50
         score  < 50 → bg-red-900/40   text-red-400   border-red-800/50
     - Style: text-xs px-3 py-1 rounded-full border

  3. Time Badge:
     - Text: "Time: {metadata.time}"
     - Icon: Clock (10px, left of text)
     - Style: bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full
       border border-gray-700

  Right side of metadata bar:
     - Re-analyze button:
         Icon: RefreshCw (12px) + "Re-analyze" text
         Style: ghost, text-gray-500 hover:text-white text-xs
     - Clear Results button:
         Icon: X (12px) + "Clear" text
         Style: ghost, text-gray-500 hover:text-red-400 text-xs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCK 2 — 🐞 BUGS SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Accent: Red (#EF4444)
  Icon: Bug or AlertCircle (lucide-react), text-red-400
  Title: "Bugs Found"
  Left border: border-l-2 border-red-500

  Header badge (top right of section):
    - "{result.bugs.length} issue(s)"
    - bg-red-900/40 text-red-400 text-xs px-2 py-0.5 rounded-md

  Content when bugs.length > 0:
    - Unordered list, gap-y-2.5 between items
    - Each item row:
        · Left: w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0
        · Text: bug string, text-gray-300 text-sm leading-relaxed
        · Optional line reference: if bug starts with "Line N:"
          → render "Line N:" in text-red-400 font-mono text-xs
          → then the rest of the description in text-gray-300
        · Hover: bg-red-900/10 rounded-lg px-2 transition-colors duration-150

  Empty state (bugs.length === 0):
    - Icon: CheckCircle2 (text-green-400, 16px)
    - Text: "✅ No bugs detected — your code looks clean!"
    - Color: text-green-400 text-sm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCK 3 — 💡 SUGGESTIONS & IMPROVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Accent: Amber (#F59E0B)
  Icon: Lightbulb or Zap, text-amber-400
  Title: "Suggestions & Improvements"
  Left border: border-l-2 border-amber-500

  Header badge:
    - "{result.improvements.length} suggestion(s)"
    - bg-amber-900/40 text-amber-400

  Content: same list format as bugs
    - Bullet dot: bg-amber-500
    - Hover: bg-amber-900/10

  Empty state:
    - Text: "✅ Code is already well-structured — no improvements needed!"
    - Color: text-green-400

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCK 4 — 📖 CODE EXPLANATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Accent: Blue (#3B82F6)
  Icon: BookOpen or FileText, text-blue-400
  Title: "Code Explanation"
  Left border: border-l-2 border-blue-500
  No count badge (paragraph content, not a list)

  Content:
    - <p> tag with result.explanation
    - Font: text-sm, text-gray-300, leading-relaxed (line-height: 1.75)
    - Max height: 180px, overflow-y: auto if text is long
    - Margin top: 8px

  Empty state:
    - Text: "No explanation available for this snippet."
    - Color: text-gray-500, italic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCK 5 — ✨ OPTIMIZED CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Accent: Violet (#8B5CF6)
  Icon: Sparkles or Wand2, text-violet-400
  Title: "Optimized Code"
  Left border: border-l-2 border-violet-500

  HEADER ROW:
    - Left: Icon + Title
    - Right: Copy button

  COPY BUTTON — DEFAULT STATE:
    - Icon: Copy (12px) + "Copy" text
    - Style: bg-gray-700/60 hover:bg-gray-600 text-gray-300
      text-xs px-3 py-1 rounded-md transition-all duration-200

  COPY BUTTON — AFTER CLICK (copied state, 2 seconds):
    - Icon: Check (12px, text-green-400) + "Copied!" text
    - Style: bg-green-900/40 text-green-400
    - Logic:
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
          navigator.clipboard.writeText(result.optimized_code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        };

  CODE BLOCK CONTAINER:
    - Background: bg-slate-900 (#0F172A)
    - Border: border border-slate-800
    - Border radius: rounded-xl
    - Padding: p-4
    - Margin top: mt-2
    - Max height: max-h-72 (288px)
    - Overflow: overflow-y-auto
    - Custom scrollbar if possible:
        scrollbar-thin scrollbar-track-transparent
        scrollbar-thumb-gray-700

  CODE TEXT:
    - Element: <pre><code>
    - Font: font-mono (JetBrains Mono or Fira Code preferred)
    - Font size: text-xs or text-[13px]
    - Color: text-green-400
    - Line height: leading-relaxed (1.7)
    - White-space: pre-wrap
    - Word-break: break-word

  Empty state (optimized_code === ""):
    - Text: "No optimized version was returned for this code."
    - Color: text-gray-500, italic, text-center

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CODE QUALITY SCORE SYSTEM — FULL LOGIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The score is received from the backend as an integer 0–100.
It is stored in metadata.score and displayed in the metadata bar.

COLOR CODING LOGIC (apply consistently everywhere score appears):

  score >= 80  →  Green  : text-green-400,  bg-green-900/40,  border-green-800/50
  score >= 50  →  Amber  : text-amber-400,  bg-amber-900/40,  border-amber-800/50
  score  < 50  →  Red    : text-red-400,    bg-red-900/40,    border-red-800/50

HELPER FUNCTION (reuse across components):

  const getScoreColor = (score) => {
    if (score >= 80) return {
      text: "text-green-400",
      bg: "bg-green-900/40",
      border: "border-green-800/50"
    };
    if (score >= 50) return {
      text: "text-amber-400",
      bg: "bg-amber-900/40",
      border: "border-amber-800/50"
    };
    return {
      text: "text-red-400",
      bg: "bg-red-900/40",
      border: "border-red-800/50"
    };
  };

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📭 EMPTY STATE — ENHANCED DESIGN SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visible when: result === null AND loading === false

Replace any static placeholder text with this enhanced empty state.
Keep all existing container and background styles from Figma.
Only replace the inner content of the empty area.

LAYOUT: flex flex-col items-center justify-center text-center gap-4
Centered both vertically and horizontally in the available space.

ICON CONTAINER:
  - bg-gray-800/60 rounded-2xl p-5
  - Icon: Code2 or Braces from lucide-react
  - Size: w-10 h-10 (40px × 40px)
  - Color: text-gray-600

PRIMARY TEXT:
  - "Ready to analyze your code"
  - Font: text-base (16px), font-medium, text-gray-400
  - Margin top: mt-3

SECONDARY TEXT:
  - "Paste your code on the left and click Analyze Code"
  - "to get AI-powered insights, bug detection, and optimization."
  - Font: text-sm (13px), text-gray-600, leading-relaxed
  - Max width: max-w-[220px], centered

FEATURE TAGS (3 small pills):
  Layout: flex flex-row gap-2 flex-wrap justify-center mt-3

  Tag 1: "🐞 Bug Detection"
  Tag 2: "💡 Suggestions"
  Tag 3: "✨ Optimization"

  Tag style (each):
    - bg-gray-800/60
    - text-gray-500
    - text-xs
    - px-3 py-1
    - rounded-full
    - border border-gray-700

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ BUTTON INTERACTIONS & MICRO-ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Apply ALL of the following without changing existing Tailwind classes.
Only add these interaction classes on top of what already exists:

PRIMARY "ANALYZE CODE" BUTTON:
  - Add: transition-all duration-200
  - Add: hover:scale-[1.02]
  - Add: hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]
  - Disabled state: opacity-50 cursor-not-allowed scale-100 shadow-none

SECONDARY BUTTONS (Clear, Re-analyze):
  - Add: transition-all duration-150
  - Add: hover:scale-[1.01]
  - Disabled state: opacity-50 cursor-not-allowed

TEXTAREA FOCUS:
  - Add: focus:border-blue-500
  - Add: focus:ring-2 focus:ring-blue-500/20
  - Add: transition-all duration-200

RESULT SECTION CARDS ENTRANCE (staggered):
  Apply Tailwind animation-delay using inline styles
  or CSS custom properties if Tailwind JIT supports it:

    Card 1 (Bugs):         style={{ animationDelay: "0ms" }}
    Card 2 (Improvements): style={{ animationDelay: "75ms" }}
    Card 3 (Explanation):  style={{ animationDelay: "150ms" }}
    Card 4 (Optimized):    style={{ animationDelay: "225ms" }}

  Each card: animate-in fade-in slide-in-from-bottom-2 duration-400
  (or use a CSS keyframe equivalent if Tailwind animate-in is unavailable)

RESULT LIST ITEM HOVER:
  Each bug/improvement list item row:
    - hover:bg-white/5 rounded-lg px-2 -mx-2
    - transition-colors duration-150

COPY BUTTON TRANSITION:
  - transition-all duration-200 on the copy button
  - Icon swap from Copy → Check should feel instant (no delay)
  - Background color transition: 200ms ease

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 WHAT YOU MUST RETURN — COMPLETE FILE LIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return complete, working source code for every file:

  src/App.jsx
    → Root component: all 6 state vars, handleAnalyze, handleClear,
      handleReanalyze, layout wiring, conditional rendering

  src/components/CodeInput.jsx
    → Textarea with value/onChange/disabled, line+char counter

  src/components/ActionBar.jsx
    → Analyze, Clear, Try Sample buttons with all states

  src/components/ThinkingPanel.jsx
    → Skeleton loaders + processingStep display + "AI is reviewing" text

  src/components/EmptyState.jsx
    → Icon, primary text, secondary text, three feature tag pills

  src/components/MetadataBar.jsx
    → Language badge, score badge (color-coded), time badge,
      Re-analyze + Clear Results buttons

  src/components/ResultPanel.jsx
    → Wrapper: MetadataBar + all 4 section components stacked

  src/components/BugsSection.jsx
    → Red-accented card, list with line refs, empty state

  src/components/ImprovementsSection.jsx
    → Amber-accented card, bullet list, empty state

  src/components/ExplanationSection.jsx
    → Blue-accented card, paragraph with scroll, empty state

  src/components/OptimizedCode.jsx
    → Violet-accented card, code block, copy button with feedback

Every file must:
  ✅ Be complete — no missing logic, imports, or exports
  ✅ Have a JSDoc comment at the very top describing the component
  ✅ Contain zero placeholder or TODO comments
  ✅ Use only Tailwind CSS — no inline styles, no custom CSS files
  ✅ Work as a cohesive, copy-paste-ready single-page application

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FINAL QUALITY CHECKLIST — VERIFY BEFORE RETURNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before returning any code, verify every item below is "Yes":

  ✅ Does the original Figma UI look visually identical to before?
  ✅ Do all 6 state variables exist and are all wired to the correct UI?
  ✅ Does handleAnalyze() contain ALL required backend comment blocks?
  ✅ Does the AI thinking simulation cycle through all 4 steps correctly?
  ✅ Is the metadata bar showing language, score, and time after result?
  ✅ Is the score color-coded green/amber/red by value correctly?
  ✅ Do all 4 result sections have both a populated AND an empty state?
  ✅ Is the loading state fully disabling all interactive elements?
  ✅ Is the copy button switching to "Copied!" and resetting after 2s?
  ✅ Are the Re-analyze and Clear Results buttons working correctly?
  ✅ Does the empty state show the icon, text, and all 3 feature tags?
  ✅ Is every animation smooth with correct timing and easing?
  ✅ Is there zero inline CSS — Tailwind only throughout?
  ✅ Are all file imports and exports correct and complete?
  ✅ Does this feel like a real production AI tool, not a student project?

If any answer is "No" — fix it before returning the code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━