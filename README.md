# LogicLLM

AI-powered code review and optimization tool powered by Google's Gemini Flash.

## Architecture Overview

LogicLLM is a full-stack code review application with a React frontend and Node.js backend. Users submit code through the frontend, which sends it to a backend that uses Google's Generative Language API with the `gemini-flash-latest` model to analyze and return structured results.

```
┌─────────────────────┐     ┌─────────────────────┐
│   Frontend (3000)   │────▶│   Backend (3001)    │
│   React + Vite      │     │   Node.js + Express│
│                     │◀────│                     │
└─────────────────────┘     └─────────────────────┘
                                    │
                                    ▼
                           ┌─────────────────────┐
                           │  Google Gemini API  │
                           │  gemini-flash-latest│
                           └─────────────────────┘
```

## Technology Stack

| Layer | Technology | Port |
|-------|------------|------|
| Frontend | React + Vite | 3000 |
| Backend | Node.js + Express | 3001 |
| AI Provider | Google Generative Language API | - |
| Model | gemini-flash-latest | - |

## Project Structure

```
LogicLLM/
├── frontend/                    # React frontend application
│   ├── src/
│   │   └── app/
│   │       ├── components/      # UI components (annotated)
│   │       │   ├── ActionBar.tsx
│   │       │   ├── BugsSection.tsx
│   │       │   ├── CodeInput.tsx
│   │       │   ├── EmptyState.tsx
│   │       │   ├── ExplanationSection.tsx
│   │       │   ├── Header.tsx
│   │       │   ├── ImprovementsSection.tsx
│   │       │   ├── MetadataBar.tsx
│   │       │   ├── OptimizedCode.tsx
│   │       │   ├── OutputPanel.tsx
│   │       │   ├── ResultSection.tsx
│   │       │   ├── SkeletonLoader.tsx
│   │       │   └── ThinkingPanel.tsx
│   │       ├── App.tsx          # Main application component
│   │       └── main.tsx         # Application entry point
│   ├── package.json
│   └── vite.config.ts           # Vite config with proxy
├── backend/                     # Node.js backend application
│   ├── src/
│   │   ├── middleware/
│   │   │   └── validator.js    # FN-004: Input validation
│   │   ├── routes/
│   │   │   └── analyze.js      # POST /api/analyze endpoint
│   │   ├── services/
│   │   │   ├── aiProvider.js   # FN-005: Gemini API adapter
│   │   │   ├── fallback.js     # FN-007: Fallback response generator
│   │   │   └── parser.js       # FN-006: Response parser/normalizer
│   │   ├── utils/
│   │   │   └── logger.js       # FN-008: Tagged logging system
│   │   └── index.js            # Express server entry point
│   ├── package.json
│   └── .env                     # Environment variables (API key)
├── runner.js                    # Server lifecycle manager (FN-001, FN-002)
├── .env.example                 # Environment template
├── backend_implementation.md    # Detailed backend documentation
└── README.md
```

## Backend Function Registry

| ID | Function | Purpose | Location |
|----|----------|---------|----------|
| FN-001 | Port Manager | Checks and frees ports 3000/3001 | runner.js |
| FN-002 | Runner Orchestrator | Starts/stops frontend and backend | runner.js |
| FN-003 | Health Check | Confirms backend is alive | backend/src/index.js |
| FN-004 | Input Validator | Validates code before AI processing | backend/src/middleware/validator.js |
| FN-005 | AI Provider Adapter | Sends code to Gemini API | backend/src/services/aiProvider.js |
| FN-006 | Response Parser | Parses AI output into stable JSON | backend/src/services/parser.js |
| FN-007 | Fallback Generator | Returns safe response if AI fails | backend/src/services/fallback.js |
| FN-008 | Logger | Tagged logging for debugging | backend/src/utils/logger.js |

## API Endpoints

### GET /health

Health check endpoint to verify backend is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-24T00:00:00.000Z",
  "service": "ai-code-reviewer-backend"
}
```

### POST /api/analyze

Analyzes code using AI and returns structured results.

**Request:**
```json
{
  "code": "function hello() { console.log('Hello'); }"
}
```

**Response:**
```json
{
  "language": "JavaScript",
  "bugs": ["bug description 1"],
  "improvements": ["improvement suggestion 1"],
  "explanation": "This function logs a greeting to the console",
  "optimized_code": "const hello = () => console.log('Hello');",
  "score": 98,
  "time": "1.5s"
}
```

## UI Component Mapping

| Component | Backend Connection | API Endpoint |
|-----------|-------------------|--------------|
| Header | NONE | - |
| CodeInput | NONE | - |
| ActionBar | FN-004 (Input Validator) | POST /api/analyze |
| EmptyState | NONE | - |
| SkeletonLoader | NONE | - |
| ThinkingPanel | NONE | - |
| ResultSection | NONE | - |
| BugsSection | FN-006 (Response Parser) | POST /api/analyze |
| ImprovementsSection | FN-006 (Response Parser) | POST /api/analyze |
| ExplanationSection | FN-006 (Response Parser) | POST /api/analyze |
| OptimizedCode | FN-006 (Response Parser) | POST /api/analyze |
| OutputPanel | FN-006 (Response Parser) | POST /api/analyze |
| MetadataBar | FN-006 (Response Parser) | POST /api/analyze |

## Data Flow

```
User enters code
       │
       ▼
┌──────────────────┐
│  CodeInput.tsx   │  User types/pastes code
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  ActionBar.tsx   │  User clicks analyze button
└──────────────────┘
       │
       ▼
│  App.tsx         │  Sends POST /api/analyze
       │
       ▼
┌─────────────────────────────────────────┐
│           Vite Proxy (3000→3001)        │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-004: Input Validator                │
│  - Checks code is string                │
│  - Validates not empty                  │
│  - Max 50,000 characters                │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-005: AI Provider Adapter            │
│  - Constructs prompt                    │
│  - Calls Gemini API                      │
│  - Receives complete response            │
│  - gemini-flash-latest model            │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-006: Response Parser                │
│  - Parses AI JSON output               │
│  - Calculates score                     │
│  - Normalizes response structure        │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-007: Fallback Generator (on error)  │
│  - Returns safe fallback response       │
│  - Prevents frontend crashes            │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         JSON Response to Frontend       │
└─────────────────────────────────────────┘
```

## Logging System

All backend logs use tagged format:

```
[timestamp] [LEVEL] [TAG] message
```

**Log Levels:**

| Level | Tag | Description |
|-------|-----|-------------|
| INFO | SERVER, AI, RUNNER | General operational events |
| DEBUG | PORT, REQUEST, VALIDATOR, PARSER | Detailed debugging info |
| SUCCESS | SERVER, AI, PORT | Successful operations |
| WARN | PORT, FALLBACK | Warning conditions |
| ERROR | PORT, PARSER, SERVER | Error conditions |

**Example Logs:**

```
[2026-04-24T10:30:00.000Z] [INFO] [SERVER] Backend server starting on port 3001
[2026-04-24T10:30:01.000Z] [DEBUG] [PORT] Port 3001 is available
[2026-04-24T10:30:05.000Z] [INFO] [AI] Calling Gemini API...
[2026-04-24T10:30:07.000Z] [SUCCESS] [AI] Response received in 1.5s
[2026-04-24T10:30:07.000Z] [DEBUG] [PARSER] JSON parsed successfully
```

## Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GEMMA_API_KEY=your_google_api_key_here
```

**Required:**

| Variable | Description |
|----------|-------------|
| GEMMA_API_KEY | API key for Google Generative Language API |

**How to get an API key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key with access to the Generative Language API
3. Copy the key and add it to your `.env` file

### Port Configuration

| Port | Service | Fixed |
|------|---------|-------|
| 3000 | Frontend (Vite) | Yes |
| 3001 | Backend (Express) | Yes |

**Note:** Ports are fixed and cannot be changed. If ports are occupied, the runner will attempt to free them. If it cannot, startup fails with a clear error.

## Runner.js Commands

```bash
node runner.js start    # Start both servers
node runner.js stop     # Stop both servers
node runner.js restart  # Restart both servers
```

Or simply run:
```bash
node runner.js
```

## Response Schema

The backend always returns valid JSON with this structure:

```typescript
interface AnalysisResponse {
  language: string;       // Auto-detected programming language
  bugs: string[];          // Array of bug/error descriptions
  improvements: string[]; // Array of suggestion strings
  explanation: string;    // Plain English code explanation
  optimized_code: string; // Optimized version of code
  score: number;          // Quality score 0-100
  time: string;           // Processing time (e.g., "1.5s")
}
```

## Error Handling

| Error Type | HTTP Status | Handling |
|------------|-------------|----------|
| Invalid input | 400 | Return validation error |
| AI API error | 500 | Trigger fallback (FN-007) |
| Parse error | 500 | Trigger fallback (FN-007) |
| Network error | 500 | Trigger fallback (FN-007) |

## Score Calculation

```
score = 100
score -= (bugs.length * 5)
score -= (improvements.length * 2)
score = max(0, score)
```

- Each bug found: -5 points
- Each improvement suggestion: -2 points
- Minimum score: 0

## Supported Models

You can configure which Gemini model to use by modifying the `model` variable in `backend/src/services/aiProvider.js`:

| Model | Description |
|-------|-------------|
| gemini-flash-latest | Fast, cost-effective for code review |
| gemini-2.0-flash | Latest Gemini 2.0 Flash model |
| gemini-1.5-flash | Stable Gemini 1.5 Flash model |
| gemini-1.5-pro | Higher quality but slower |
| gemini-2.0-pro | Most capable Gemini 2.0 model |
