━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 MASTER PROMPT — AI Code Reviewer: Figma-to-React Enhancement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a senior frontend engineer specializing in React, Tailwind CSS,
and production-grade UI development.

You have been given an existing React JSX codebase that was exported or
converted from a Figma design for an AI-powered Code Reviewer application.

Your job is NOT to redesign or restyle the UI.
Your job is ONLY to:
  ✅ Preserve the existing Figma-based layout and Tailwind styles exactly
  ✅ Add complete React state management using useState
  ✅ Implement the handleAnalyze() function with full logic
  ✅ Add the exact backend API comments as specified below
  ✅ Add UX behavior (loading, error, clear, disable states)
  ✅ Make the frontend 100% ready to plug into a Node.js backend instantly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an AI-powered Code Reviewer web application.

User Flow:
  1. User pastes any code snippet into a textarea input
  2. User clicks the "Analyze Code" button
  3. Frontend sends the code to a Node.js backend via POST /api/analyze
  4. Backend uses OpenAI API to:
       - Auto-detect the programming language (no user input needed)
       - Analyze the code
       - Return a structured JSON response
  5. Frontend receives the response and displays:
       - 🐞 Bugs         → array of bug descriptions
       - 💡 Improvements → array of improvement suggestions
       - 📖 Explanation  → plain-English explanation of the code
       - ✨ Optimized Code → complete rewritten/improved code block

IMPORTANT:
  - There is NO language selector dropdown in the UI
  - Language detection is handled 100% by the backend AI
  - The frontend only sends raw code and receives structured JSON back

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 STRICT RULES — READ BEFORE WRITING ANY CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✗ DO NOT redesign or restyle the UI
  ✗ DO NOT change any existing Tailwind CSS class names
  ✗ DO NOT change the layout structure or component hierarchy
  ✗ DO NOT add new UI components not present in the Figma design
  ✗ DO NOT add any backend, server-side, or API logic
  ✗ DO NOT add a language selector (backend handles auto-detection)
  ✗ DO NOT add new libraries (only use what already exists in the project)
  ✗ DO NOT use class-based components
  ✗ DO NOT add TypeScript
  ✗ DO NOT leave placeholder comments like "// TODO" or "// add logic here"
  ✗ DO NOT modify comment text marked as REQUIRED — copy them verbatim

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 STATE MANAGEMENT — ADD TO MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inside the main App component (or whatever the root component is named),
declare the following four state variables using React useState:

  const [code, setCode]       = useState("");
  // Stores the raw code string the user pastes into the textarea

  const [result, setResult]   = useState(null);
  // Stores the structured JSON object returned by the backend API
  // Shape: { bugs: [], improvements: [], explanation: "", optimized_code: "" }

  const [loading, setLoading] = useState(false);
  // Boolean — true while the API call is in progress, false otherwise

  const [error, setError]     = useState("");
  // Stores any error message string to display in the UI
  // Empty string ("") means no error

These four state variables drive all dynamic behavior in the UI.
Do not add any additional state unless absolutely necessary.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ FUNCTION: handleAnalyze() — IMPLEMENT WITH EXACT COMMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create or enhance the function handleAnalyze() inside the main component.
This must be an async function.

The function must follow this EXACT structure and include ALL comments
as written below. Do NOT alter, shorten, or paraphrase any comment block.

─────────────────────────────────────────────────────────────
FULL FUNCTION IMPLEMENTATION (COPY THIS EXACTLY):
─────────────────────────────────────────────────────────────

  const handleAnalyze = async () => {

    // --- Input Validation ---
    // If the textarea is empty or contains only whitespace,
    // show an error message and stop execution immediately.
    if (!code.trim()) {
      setError("⚠️ Please paste some code before analyzing.");
      return;
    }

    // Reset previous state before starting a new request
    setError("");       // Clear any old error messages
    setLoading(true);   // Show loading spinner on button
    setResult(null);    // Clear previous result from UI

    // =====================================================
    // 🔥 BACKEND CONNECTION START
    // =====================================================
    // This is where the frontend connects to the backend API.
    //
    // Endpoint : POST /api/analyze
    // Method   : POST
    //
    // What frontend sends:
    // {
    //   code: user input code (raw string)
    // }
    //
    // What backend does:
    //   - Receives the raw code string
    //   - Uses OpenAI API to analyze it
    //   - Auto-detects the programming language (no user input needed)
    //   - Builds a structured AI prompt internally
    //   - Returns a structured JSON response to the frontend
    //
    // This backend is built using Node.js + Express + OpenAI SDK
    // and is deployed on Vercel as a serverless function.
    //
    // The relative URL "/api/analyze" works automatically on Vercel
    // because the frontend and backend are deployed together.
    // =====================================================

    try {

      // ACTUAL API CALL HAPPENS HERE
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
        // ^ Sends the user's raw code as a JSON payload to the backend
      });

      // =====================================================
      // 🔥 BACKEND CONNECTION END
      // =====================================================

      // --- HTTP Error Handling ---
      // If the server returned a non-2xx status code,
      // throw an error with the status for debugging.
      if (!response.ok) {
        throw new Error(
          `Backend returned an error. Status: ${response.status}`
        );
      }

      // =====================================================
      // 🔥 BACKEND RESPONSE HANDLING START
      // =====================================================
      // Expected response format from backend:
      //
      // {
      //   bugs:           [],   // Array of bug description strings
      //   improvements:   [],   // Array of improvement suggestion strings
      //   explanation:    "",   // Plain-English string explaining the code
      //   optimized_code: ""    // Full optimized version of the code as a string
      // }
      //
      // This response object is parsed from JSON, stored in the
      // `result` state variable, and then rendered in the UI by
      // the OutputPanel component (or equivalent display section).
      //
      // If any field is missing or empty, the UI should handle it
      // gracefully (e.g., show "No bugs found" if bugs array is empty).
      // =====================================================

      const data = await response.json();
      // ^ Parses the JSON response body into a JavaScript object

      setResult(data);
      // ^ Stores the structured response in state — triggers UI re-render
      // ^ setResult(data) stores: { bugs, improvements, explanation, optimized_code }

      // =====================================================
      // 🔥 BACKEND RESPONSE HANDLING END
      // =====================================================

    } catch (err) {

      // --- Error Catch Block ---
      // Handles network failures, server errors, or JSON parse errors.
      // Displays a user-friendly message in the UI.
      setError(
        "❌ Something went wrong while analyzing your code. " +
        "Please check the backend connection and try again."
      );
      console.error("handleAnalyze Error:", err);
      // ^ Log the full error to the console for developer debugging

    } finally {

      // Always runs after try or catch — resets loading state
      setLoading(false);
      // ^ Re-enables the Analyze button and hides the spinner

    }

  };

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 WIRE UP HANDLERS — CONNECT STATE TO EXISTING UI ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Without changing the visual structure, connect state to existing elements:

TEXTAREA (Code Input):
  - Bind value to the `code` state:          value={code}
  - Bind onChange to update state:           onChange={(e) => setCode(e.target.value)}
  - Disable during loading:                  disabled={loading}

ANALYZE BUTTON:
  - Bind onClick to handleAnalyze:           onClick={handleAnalyze}
  - Disable while loading:                   disabled={loading}
  - Show dynamic label:
      · When loading === false → "Analyze Code"
      · When loading === true  → "Analyzing..." with a spinner icon

CLEAR BUTTON:
  - Bind onClick to a handleClear function:  onClick={handleClear}
  - handleClear should reset all state:
      setCode("");
      setResult(null);
      setError("");
  - Disable while loading:                   disabled={loading}

ERROR MESSAGE BLOCK:
  - Render conditionally:                    {error && <div>...</div>}
  - Display the error string from state
  - Keep the existing error styling from Figma (do not add new styles)

OUTPUT SECTION:
  - Render conditionally:                    {result && <OutputPanel result={result} />}
  - Only visible after a successful API response
  - Pass the result object as a prop to the output display component

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ UX BEHAVIOR REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Implement these UX behaviors WITHOUT changing the Figma visual design.
Only add logic — styles already exist from Figma export.

  1. LOADING STATE:
       - "Analyze Code" button text changes to "Analyzing..."
       - A spinner icon (lucide-react Loader2 with animate-spin) appears
         inside the button next to the text
       - Both "Analyze Code" and "Clear" buttons become disabled
       - Textarea becomes read-only or disabled during the API call

  2. EMPTY INPUT VALIDATION:
       - If user clicks "Analyze Code" with an empty textarea,
         show an error message immediately without making any API call
       - Error message: "⚠️ Please paste some code before analyzing."
       - The error should appear in the existing error display area from Figma

  3. CLEAR BUTTON:
       - Resets code to ""
       - Resets result to null (hides output section)
       - Resets error to "" (hides error block)
       - Does NOT trigger any API call
       - Should be disabled while loading === true

  4. RESULT DISPLAY:
       - Output section is completely hidden when result === null
       - Only appears after a successful API response
       - Each section (Bugs, Improvements, Explanation, Optimized Code)
         should handle empty arrays or strings gracefully:
           · bugs.length === 0       → Show "✅ No bugs found!"
           · improvements.length === 0 → Show "✅ Looks clean!"
           · explanation === ""      → Show "No explanation available."
           · optimized_code === ""   → Show "No optimized code returned."

  5. COPY CODE BUTTON (if present in Figma design):
       - Uses navigator.clipboard.writeText(result.optimized_code)
       - After copying, button label changes to "✅ Copied!" for 2 seconds
       - Then resets back to the original label automatically

  6. ERROR STATE:
       - Error block is hidden when error === ""
       - Visible only when error is a non-empty string
       - Cleared automatically when a new handleAnalyze() call starts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 EXPECTED BACKEND RESPONSE SHAPE (FOR REFERENCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The frontend expects the following JSON structure from /api/analyze.
Use this shape for result state handling and conditional rendering:

  {
    "bugs": [
      "Variable `x` is declared but never used.",
      "Possible null reference on line 12."
    ],
    "improvements": [
      "Use const instead of let for variables that don't change.",
      "Add error handling around the async operation."
    ],
    "explanation": "This code defines a function that fetches user data
                    from an external API and logs it to the console.
                    It uses async/await for asynchronous handling.",
    "optimized_code": "const fetchUser = async (id) => {\n  try {\n    ..."
  }

Map each key to its display section:
  result.bugs           → 🐞 Bugs section
  result.improvements   → 💡 Improvements section
  result.explanation    → 📖 Explanation section
  result.optimized_code → ✨ Optimized Code block

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT REQUIREMENT — WHAT YOU MUST RETURN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return the complete updated source code for ALL components, including:

  ✅ The existing Figma layout preserved exactly as-is
  ✅ All four useState variables added and wired up
  ✅ handleAnalyze() implemented with ALL required comments verbatim
  ✅ handleClear() implemented
  ✅ Textarea, buttons, error block, and output section all connected to state
  ✅ Conditional rendering for error and output sections
  ✅ Loading UX (spinner, disabled states, dynamic button label)
  ✅ Copy button logic (if the Figma design includes a copy button)
  ✅ Zero placeholder or TODO comments remaining in the code
  ✅ Every file complete and copy-paste ready — no missing imports or exports

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FINAL GOAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The final output should be:
  - Visually identical to the original Figma design
  - Logically complete with full state and API handling
  - Backend-ready: a developer can connect Node.js in under 5 minutes
  - Beginner-friendly: every backend touchpoint is clearly labeled
  - Production-ready: no TODOs, no missing logic, no broken states