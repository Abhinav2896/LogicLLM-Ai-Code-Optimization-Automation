━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 MASTER PROMPT — AI Code Reviewer: Premium Dark UI Design System
       Senior Product Designer + UI/UX Expert Edition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a senior product designer and UI/UX expert with deep experience
building developer-focused tools and AI-powered SaaS dashboards.

Your task is to design and build a complete, modern, premium-quality
dark-themed web UI for an AI-powered Code Reviewer application using
React and Tailwind CSS.

The final result must feel like a real production-grade developer tool —
comparable to VS Code, GitHub Copilot UI, Vercel Dashboard, or
Linear.app in terms of polish, hierarchy, and visual quality.

This is NOT a student project. Every pixel must feel intentional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PROJECT PURPOSE & USER FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This application allows developers to:

  Step 1 → Paste any code snippet into an editor-style input box
  Step 2 → Click the "Analyze Code" button
  Step 3 → Wait while AI processes the code in the background
  Step 4 → View a structured AI-generated report containing:
               🐞 Bugs Found
               💡 Suggestions & Improvements
               📖 Code Explanation
               ✨ Optimized Code

KEY DESIGN CONSTRAINT:
  There is NO language selector or dropdown anywhere in the UI.
  The AI backend automatically detects the programming language.
  The UI must communicate this automatically through placeholder
  text and tooltip hints — NOT through a dropdown or selector input.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 OVERALL PAGE LAYOUT — MASTER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE WRAPPER:
  - Full viewport height: min-h-screen
  - Background: #0B0F1A (deepest dark — not pure black)
  - Font family: Inter or system-ui for UI text
  - Font family: JetBrains Mono or Fira Code for code content

CENTERED CONTAINER:
  - Max width: 1280px
  - Horizontal padding: 24px (mobile) → 48px (desktop)
  - Centered with mx-auto

MAIN BODY — TWO-COLUMN GRID LAYOUT:
  - Display: CSS Grid or Flexbox side-by-side
  - Left Panel  (Input)  : 55% width
  - Right Panel (Output) : 45% width
  - Gap between panels   : 24px–32px
  - Both panels same height (stretch to match each other)

RESPONSIVE BREAKPOINTS:
  - Desktop (lg: 1024px+) → Two-column side-by-side layout
  - Tablet  (md: 768px)   → Two-column with reduced spacing
  - Mobile  (sm: <768px)  → Single column stacked:
                             Input panel on top
                             Output panel below with top margin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 COMPLETE DESIGN SYSTEM — USE THESE VALUES EXACTLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── COLORS ──────────────────────────────────────────────────────────

  Page Background       : #0B0F1A  (zinc-950 equivalent)
  Card/Panel Background : #111827  (gray-900)
  Inner Code Background : #0F172A  (slate-900 — darkest, for textareas)
  Section Card BG       : #1A2236  (slightly lighter than panel bg)
  Border Color          : #374151  (gray-700 — subtle, not harsh)
  Border Hover          : #4B5563  (gray-600)

  Primary Gradient      : from-blue-500 (#3B82F6) → to-violet-600 (#7C3AED)
  Primary Hover Gradient: from-blue-400 → to-violet-500 (slightly brighter)
  Primary Glow          : box-shadow: 0 0 20px rgba(99, 102, 241, 0.4)

── TYPOGRAPHY ───────────────────────────────────────────────────────

  App Title             : 28–32px, font-bold, gradient text (blue→violet)
  Section Headings      : 16px, font-semibold, text-white
  Body/Paragraph Text   : 14–15px, text-gray-300 (#D1D5DB)
  Secondary/Muted Text  : 13px, text-gray-400 (#9CA3AF)
  Code Text             : 13–14px, font-mono, text-green-400 (#34D399)
  Error Text            : 13px, text-red-400 (#F87171)
  Labels/Tags           : 11–12px, uppercase, letter-spacing: 0.05em

── ACCENT COLORS (SECTION COLOR CODING) ─────────────────────────────

  Bugs Section          : Red    — #EF4444 (left border + dot + icon)
  Improvements Section  : Amber  — #F59E0B (left border + dot + icon)
  Explanation Section   : Blue   — #3B82F6 (left border + icon)
  Optimized Code Section: Violet — #8B5CF6 (left border + icon)
  Success/No Issues     : Green  — #10B981 (empty state messages)

── SPACING & RADIUS ─────────────────────────────────────────────────

  Page padding          : 24px–48px
  Panel padding         : 24px–32px
  Section card padding  : 16px–20px
  Gap between sections  : 16px
  Gap between panels    : 24px–32px

  Panel border radius   : 20px (rounded-2xl)
  Input/textarea radius : 12px (rounded-xl)
  Button radius         : 10px (rounded-xl)
  Section card radius   : 12px (rounded-xl)
  Tag/badge radius      : 6px  (rounded-md)

── SHADOWS & ELEVATION ──────────────────────────────────────────────

  Panel card shadow     : 0 4px 24px rgba(0, 0, 0, 0.4)
  Button hover shadow   : 0 0 20px rgba(99, 102, 241, 0.35)
  Section card shadow   : 0 2px 8px rgba(0, 0, 0, 0.2)
  Inner textarea shadow : inset 0 2px 8px rgba(0, 0, 0, 0.3)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔷 HEADER SECTION — TOP OF PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Position: Top of the page, above the two-panel layout
Alignment: Left-aligned inside the centered container
Bottom margin: 32px before the panels begin

ICON:
  - Use a code bracket icon </> or Terminal icon from lucide-react
  - Size: 32px × 32px
  - Background: rounded-xl with gradient bg (blue→violet)
  - Padding: 8px
  - Icon color: white
  - Displayed inline-left of the title text

APP TITLE:
  - Text: "AI Code Reviewer"
  - Font size: 28px–32px
  - Font weight: bold (700–800)
  - Color: gradient text using:
    background: linear-gradient(to right, #3B82F6, #7C3AED)
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
  - In Tailwind: bg-gradient-to-r from-blue-500 to-violet-600
                 bg-clip-text text-transparent

SUBTITLE:
  - Text: "Paste your code. AI detects the language and reviews instantly."
  - Font size: 14–15px
  - Color: text-gray-400
  - Margin top: 6px
  - Font weight: normal (400)

OPTIONAL HEADER RIGHT SIDE (if space allows):
  - A small badge or pill: "Powered by OpenAI"
  - Style: border border-gray-700, text-gray-500, rounded-full, px-3 py-1
  - Font size: 12px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧩 LEFT PANEL — INPUT SECTION (55% WIDTH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PANEL CONTAINER:
  - Background: #111827 (gray-900)
  - Border: 1px solid #374151 (gray-700)
  - Border radius: 20px
  - Padding: 24px
  - Box shadow: 0 4px 24px rgba(0, 0, 0, 0.4)
  - Full height to match right panel

── PANEL HEADER ─────────────────────────────────────────────────────

  - Left side:
      · Small icon (FileCode or Code2 from lucide-react)
      · Text: "Source Code"
      · Font: 15px, font-semibold, text-white
      · Icon color: text-blue-400
  - Right side:
      · Optional auto-detect tag: "Auto-detect language"
      · Style: bg-gray-800, text-gray-400, text-xs, rounded-md, px-2 py-1
      · Small Cpu or Wand icon before text

── CODE INPUT TEXTAREA ──────────────────────────────────────────────

  Styling:
  - Width: 100%
  - Min height: 340px — fills the card vertically
  - Max height: 500px with overflow-y: auto
  - Background: #0F172A (slate-900 — darkest code background)
  - Border: 1px solid #1E293B (slate-800 — very subtle inner border)
  - Border radius: 12px
  - Padding: 16px–20px
  - Font family: JetBrains Mono, Fira Code, or monospace
  - Font size: 13–14px
  - Line height: 1.7
  - Color: #E2E8F0 (slate-200 — off-white for code readability)
  - Resize: none (or vertical only)
  - Caret color: #3B82F6 (blue caret inside the editor)
  - Focus ring: outline: none; border-color: #3B82F6 with subtle glow

  Placeholder:
  - Text: "// Paste your code here...
           // JavaScript, Python, TypeScript, C++, Java, and more
           // AI will automatically detect the language"
  - Color: #4B5563 (gray-600 — dim, like a real editor placeholder)
  - Font style: italic

── LINE / CHARACTER COUNTER ─────────────────────────────────────────

  Below the textarea, right-aligned:
  - Text: "0 lines · 0 characters"
  - Font size: 11px
  - Color: text-gray-600
  - Updates live as user types
  - Margin top: 8px

── BOTTOM ACTION BAR ────────────────────────────────────────────────

  Layout: Flexbox, space-between, align-center
  Margin top: 16px

  LEFT SIDE — Secondary Actions:

    1. "Clear" Button:
       - Style: Ghost/outline button
       - Background: transparent
       - Border: 1px solid #374151 (gray-700)
       - Color: text-gray-400
       - Hover: border-gray-500, text-gray-200, bg-gray-800
       - Padding: 8px 16px
       - Border radius: 10px
       - Icon: X or Trash2 from lucide-react (14px, left of text)
       - Font size: 13px

    2. "Try Sample Code" Button (Optional premium feature):
       - Style: Very subtle secondary button
       - Background: transparent or bg-gray-800/50
       - Border: 1px solid #374151
       - Color: text-blue-400
       - Hover: bg-gray-800, text-blue-300
       - Icon: Lightbulb or FlaskConical (14px)
       - Font size: 13px
       - Tooltip on hover: "Load a sample to try the reviewer"

  RIGHT SIDE — Primary Action:

    "Analyze Code" Button:
    - Background: gradient — from-blue-500 to-violet-600
    - Hover: from-blue-400 to-violet-500 + glow shadow
    - Box shadow on hover: 0 0 20px rgba(99, 102, 241, 0.4)
    - Color: text-white
    - Font weight: 600 (semibold)
    - Font size: 14px
    - Padding: 10px 24px
    - Border radius: 10px
    - Transition: all 300ms ease
    - Icon: Play or Zap icon from lucide-react (14px, left of text)
    - Disabled state:
        · opacity-50
        · cursor-not-allowed
        · No hover glow
    - Loading state:
        · Icon changes to Loader2 with animate-spin class
        · Text changes to "Analyzing..."
        · Button disabled automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ LOADING STATE DESIGN — FULL SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Triggered when: loading === true (after Analyze Code is clicked)

LEFT PANEL CHANGES:
  - "Analyze Code" button shows Loader2 spinner icon + "Analyzing..." text
  - Both buttons (Analyze + Clear) become disabled
  - Textarea becomes disabled / read-only
  - Button gradient opacity stays, but cursor-not-allowed

RIGHT PANEL CHANGES — SKELETON LOADERS:
  - Replace the output content with animated skeleton blocks
  - Use animate-pulse (Tailwind) on all skeleton elements
  - Skeleton color: bg-gray-700/50 or bg-gray-800

  Skeleton layout (simulate the actual result layout):

    BLOCK 1 — Bugs Section Skeleton:
      · Short gray bar (label placeholder): w-24 h-3
      · Three rows of content: w-full h-3 rounded, varying widths
        (100%, 80%, 65%) spaced 8px apart

    BLOCK 2 — Improvements Section Skeleton:
      · Short label bar: w-32 h-3
      · Three content rows: 100%, 75%, 55%

    BLOCK 3 — Explanation Section Skeleton:
      · Short label bar: w-28 h-3
      · Four content rows: 100%, 100%, 90%, 60%

    BLOCK 4 — Optimized Code Skeleton:
      · Label bar: w-36 h-3
      · Tall dark box (simulating code block): h-32, rounded-xl

  All blocks have:
  - bg-gray-800/50 rounded-xl p-4 mb-4
  - animate-pulse class
  - Stagger animation if possible (delay-100, delay-200, etc.)

OPTIONAL LOADING TEXT:
  - Below skeleton blocks, centered small text:
    "🤖 AI is reviewing your code..."
  - Color: text-gray-500
  - Font size: 12px
  - Animated with a subtle fade or dot pulse

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RIGHT PANEL — OUTPUT SECTION (45% WIDTH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PANEL CONTAINER:
  - Background: #111827 (gray-900)
  - Border: 1px solid #374151 (gray-700)
  - Border radius: 20px
  - Padding: 24px
  - Box shadow: 0 4px 24px rgba(0, 0, 0, 0.4)
  - Overflow-y: auto (scrollable when content overflows)
  - Full height to match left panel

── PANEL HEADER ─────────────────────────────────────────────────────

  - Left side:
      · Icon: BarChart2 or Activity from lucide-react
      · Text: "Analysis Results"
      · Font: 15px, semibold, white
      · Icon color: text-violet-400
  - Right side (only when results are visible):
      · "Download Report" button (optional premium feature)
        · Icon: Download (12px)
        · Style: ghost, text-gray-500, hover: text-gray-300
        · Font size: 12px
      · Toggle pill: "Formatted / Raw JSON"
        · Styled as a small toggle switch or two-tab pill
        · bg-gray-800, rounded-full

── STATE 1: EMPTY STATE ─────────────────────────────────────────────

  Visible when: result === null AND loading === false

  Center everything vertically and horizontally inside the panel.

  Design:
  - Icon container:
      · bg-gray-800/60 rounded-2xl p-6
      · Icon: Code2 or Braces from lucide-react
      · Icon size: 48px
      · Icon color: text-gray-600
  - Primary text:
      · "Ready to analyze your code"
      · Font: 16px, font-medium, text-gray-400
      · Margin top: 16px
  - Secondary text:
      · "Paste your code on the left and click Analyze Code to get"
      · "AI-powered insights, bug detection, and optimization."
      · Font: 13px, text-gray-600
      · Line height: relaxed
      · Max width: 240px, text-center
  - Decorative elements (optional):
      · 3 small feature pills below the text:
        "🐞 Bug Detection" / "💡 Suggestions" / "✨ Optimization"
      · Style: bg-gray-800/60, text-gray-500, rounded-full, text-xs, px-3 py-1

── STATE 2: RESULT STATE ────────────────────────────────────────────

  Visible when: result !== null

  Animate in with: opacity-0 → opacity-100, translateY(8px) → translateY(0)
  Transition: 400ms ease

  The panel contains 4 stacked result section cards:

  ─────────────────────────────────────────────────────────────────
  SECTION CARD TEMPLATE (APPLIES TO ALL 4 SECTIONS):
  ─────────────────────────────────────────────────────────────────
    - Background: #1A2236 (slightly lighter than panel)
    - Border: 1px solid #1E293B (very subtle outer border)
    - Left accent border: 3px solid [accent color] on the left side
    - Border radius: 12px
    - Padding: 16px
    - Margin bottom: 12px
    - Box shadow: 0 2px 8px rgba(0,0,0,0.2)

    Section header row:
    - Left: Icon (14px) + Section Title (13px, semibold, text-white)
    - Right: Count badge (e.g., "3 issues") for bugs/improvements
             Style: bg-red-900/30 text-red-400 text-xs rounded-md px-2 py-0.5

  ─────────────────────────────────────────────────────────────────

  SECTION 1 — 🐞 BUGS FOUND
  ─────────────────────────────────────────────────────────────────
    Accent color  : Red (#EF4444)
    Icon          : Bug or AlertCircle from lucide-react, text-red-400
    Title         : "Bugs Found"
    Badge         : "{bugs.length} issue(s)" — bg-red-900/40 text-red-400

    Content (when bugs exist):
      - Unordered list, no default bullets
      - Each item:
          · Left: small filled circle — w-1.5 h-1.5 rounded-full bg-red-500
          · Text: bug description — 13px, text-gray-300, leading-relaxed
          · Margin between items: 10px
          · Hover on item row: subtle bg-red-900/10 rounded-lg transition

    Empty state (when bugs array is empty):
      - Icon: CheckCircle2 from lucide-react — text-green-400
      - Text: "✅ No bugs detected — your code looks clean!"
      - Color: text-green-400, font-size: 13px

  ─────────────────────────────────────────────────────────────────

  SECTION 2 — 💡 SUGGESTIONS & IMPROVEMENTS
  ─────────────────────────────────────────────────────────────────
    Accent color  : Amber (#F59E0B)
    Icon          : Lightbulb or Zap from lucide-react, text-amber-400
    Title         : "Suggestions & Improvements"
    Badge         : "{improvements.length} suggestion(s)" — bg-amber-900/40 text-amber-400

    Content:
      - Same list format as bugs section
      - Bullet dot color: bg-amber-500
      - Hover: bg-amber-900/10 rounded-lg transition

    Empty state:
      - Text: "✅ Code is already optimized — no improvements needed!"
      - Color: text-green-400

  ─────────────────────────────────────────────────────────────────

  SECTION 3 — 📖 CODE EXPLANATION
  ─────────────────────────────────────────────────────────────────
    Accent color  : Blue (#3B82F6)
    Icon          : BookOpen or FileText from lucide-react, text-blue-400
    Title         : "Code Explanation"
    No badge needed (paragraph content, not a list)

    Content:
      - Paragraph-style text block
      - Font size: 13–14px
      - Color: text-gray-300
      - Line height: 1.75 (leading-relaxed or leading-loose)
      - Margin top: 8px
      - Max height: 180px with overflow-y: auto if text is very long

    Empty state:
      - Text: "No explanation available for this code."
      - Color: text-gray-500, italic

  ─────────────────────────────────────────────────────────────────

  SECTION 4 — ✨ OPTIMIZED CODE (MOST IMPORTANT)
  ─────────────────────────────────────────────────────────────────
    Accent color  : Violet (#8B5CF6)
    Icon          : Sparkles or Wand2 from lucide-react, text-violet-400
    Title         : "Optimized Code"
    No badge needed

    CODE BLOCK CONTAINER:
      - Background: #0F172A (slate-900 — darkest)
      - Border: 1px solid #1E293B (slate-800)
      - Border radius: 10px
      - Padding: 16px
      - Margin top: 8px
      - Max height: 280px
      - Overflow-y: auto (scrollable code block)
      - Custom scrollbar (if CSS allows):
          scrollbar-width: thin
          scrollbar-color: #374151 transparent

    CODE TEXT:
      - Font family: JetBrains Mono, Fira Code, or monospace
      - Font size: 12–13px
      - Color: text-green-400 (#34D399)
      - Line height: 1.7
      - White-space: pre-wrap (preserve code formatting)
      - Word-break: break-word

    COPY BUTTON (top-right of code block):
      Position: absolute top-right OR flex row above the code block

      Default state:
        - Icon: Copy from lucide-react (12px)
        - Text: "Copy"
        - Style: bg-gray-700/60 hover:bg-gray-600 text-gray-300
                 text-xs, px-3 py-1, rounded-md
        - Transition: all 200ms

      After click (Copied state — 2 seconds):
        - Icon: Check from lucide-react (12px), text-green-400
        - Text: "Copied!"
        - Style: bg-green-900/40 text-green-400
        - Auto-resets to default after 2000ms

    Empty state (when optimized_code === ""):
      - Text: "No optimized version was returned."
      - Color: text-gray-500, italic, centered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ MICRO INTERACTIONS & ANIMATION SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Apply ALL of the following:

  1. BUTTON HOVER:
       - All buttons use: transition-all duration-200 ease-in-out
       - Primary button: scale(1.01) + glow shadow on hover
       - Ghost buttons: subtle bg fill + border color shift

  2. TEXTAREA FOCUS:
       - Border color transitions from gray-700 → blue-500
       - Glow: box-shadow 0 0 0 3px rgba(59, 130, 246, 0.15)
       - Transition: 200ms ease

  3. RESULT PANEL ENTRANCE:
       - Animate from: opacity-0, transform: translateY(12px)
       - Animate to  : opacity-1, transform: translateY(0)
       - Duration    : 400ms ease-out
       - Use Tailwind: transition-all duration-400
         or CSS animation keyframes

  4. SECTION CARD ENTRANCE (STAGGERED):
       - Each of the 4 result cards fades in with a stagger delay
       - Card 1: delay-0ms
       - Card 2: delay-75ms
       - Card 3: delay-150ms
       - Card 4: delay-225ms

  5. COPY BUTTON FEEDBACK:
       - Instant icon swap (Copy → Check) on click
       - Background color transitions: gray-700 → green-900/40
       - Text color transitions: gray-300 → green-400
       - Reset after exactly 2000ms

  6. SKELETON PULSE:
       - animate-pulse on all skeleton blocks
       - Color: bg-gray-700/40 and bg-gray-800/60 alternating
       - Stagger entrance of skeleton blocks if possible

  7. HOVER ON RESULT LIST ITEMS:
       - Each bug/improvement list item:
         hover: bg-white/5 rounded-lg px-2 transition-colors duration-150

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 OPTIONAL PREMIUM FEATURES (INCLUDE ALL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. "TRY SAMPLE CODE" BUTTON:
       - Clicking it auto-fills the textarea with a pre-written
         JavaScript or Python code snippet containing intentional bugs
       - The user can then click Analyze to see a real result immediately
       - Useful for demos and onboarding

  2. LIVE LINE / CHARACTER COUNTER:
       - Below the textarea, right-aligned
       - Format: "12 lines · 284 characters"
       - Updates in real-time on every keystroke
       - Color: text-gray-600, text-xs

  3. DOWNLOAD REPORT BUTTON:
       - Located in the top-right of the right panel header
       - Only visible when result !== null
       - Clicking it generates a plain-text or JSON download
         of the result object
       - Icon: Download (12px), text-gray-400
       - Style: ghost, hover: text-white

  4. TOGGLE: FORMATTED VIEW / RAW JSON:
       - Located in the top-right of the right panel header
       - Toggle between:
           · Formatted: Human-readable structured sections (default)
           · Raw JSON: Shows the raw result object as formatted JSON
                       in a code block with green monospace text
       - Style: Two-tab pill, bg-gray-800, rounded-full, text-xs

  5. AUTO-DETECT LANGUAGE BADGE:
       - After result loads, display a small detected language tag
         in the left panel header area:
         "Detected: JavaScript" or "Detected: Python"
       - Style: bg-blue-900/40 text-blue-400 text-xs px-2 py-1 rounded-md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 WHAT YOU MUST RETURN — COMPLETE FILE LIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return complete, working source code for every file:

  src/App.jsx                         → Root component, state, layout
  src/components/Header.jsx           → App title, icon, subtitle, badge
  src/components/CodeInput.jsx        → Textarea, line counter, focus styles
  src/components/ActionBar.jsx        → Clear, Try Sample, Analyze buttons
  src/components/OutputPanel.jsx      → Wrapper for result or empty state
  src/components/EmptyState.jsx       → The centered placeholder with icon
  src/components/SkeletonLoader.jsx   → Animated loading skeleton blocks
  src/components/ResultSection.jsx    → Reusable colored section card
  src/components/BugsSection.jsx      → Bugs list with red accent
  src/components/ImprovementsSection.jsx → Suggestions list with amber accent
  src/components/ExplanationSection.jsx  → Paragraph explanation with blue
  src/components/OptimizedCode.jsx    → Code block with copy button + violet

Every file must:
  ✅ Be complete — no missing logic, no placeholders
  ✅ Have JSDoc comment at the top describing the component
  ✅ Include all imports and a default export
  ✅ Use only Tailwind CSS — zero inline styles, zero custom CSS
  ✅ Be copy-paste ready with no errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FINAL QUALITY STANDARD — JUDGE YOUR OUTPUT AGAINST THIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before returning code, verify it meets ALL of these:

  ✅ Would a developer mistake this for a real commercial SaaS product?
  ✅ Does every interactive element have hover, active, and disabled states?
  ✅ Is the layout stable on mobile, tablet, and desktop?
  ✅ Do all 4 result sections have both populated AND empty states?
  ✅ Does the loading state feel like a real async operation in progress?
  ✅ Is the code block scrollable and the copy button working?
  ✅ Are all 4 section accent colors visually distinct and consistent?
  ✅ Is the typography hierarchy clear (title > label > body > secondary)?
  ✅ Are all animations smooth with proper timing and easing?
  ✅ Is there zero clutter — every element earns its place on screen?

If any of the above is "No" — fix it before returning.