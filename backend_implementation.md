# Backend Implementation Documentation

## 1. Project Overview

**Project Name:** LogicLLM

**Project Goal:** Build a code-review application where a React frontend accepts user code, sends it to a Node.js backend, which uses Google's Generative Language API with the `gemini-flash-latest` model to analyze the code and return structured results.

**Frontend:** React + Vite application running on port 3000
**Backend:** Node.js + Express server running on port 3001

---

## 2. Backend Architecture

### Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Provider:** Google Generative Language API (via fetch)
- **Model:** `gemini-flash-latest`
- **Logging:** Custom logger with tagged log levels

### Server Configuration
- **Port:** 3001 (fixed, no dynamic switching)
- **Frontend URL:** http://localhost:3000
- **CORS:** Enabled for frontend origin

---

## 3. UI-to-Backend Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Port 3000)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ fetch('/api/analyze', { body: { code } })
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND (Port 3001)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   FN-004: Input Validator                │    │
│  │              Validates code is string, not empty         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                │                                 │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 FN-005: AI Provider Adapter              │    │
│  │     Sends code to Gemini API with gemini-flash model    │    │
│  │              Receives complete response                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                │                                 │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              FN-006: Response Parser/Normalizer          │    │
│  │      Parses AI output into structured JSON response      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                │                                 │
│                                ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                FN-007: Fallback Generator                │    │
│  │     Returns safe fallback if AI fails at any step       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                │                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ JSON Response
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend receives:                                              │
│  {                                                               │
│    language: string,        // Auto-detected programming language │
│    bugs: string[],          // Array of bug descriptions          │
│    improvements: string[],  // Array of suggestions               │
│    explanation: string,     // Plain-English explanation          │
│    optimized_code: string,  // Optimized version of code          │
│    score: number,           // Code quality score 0-100            │
│    time: string             // Processing time                    │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Backend Function Registry

| Function ID | Function Name | Purpose |
|-------------|---------------|---------|
| FN-001 | Port Manager | Checks and frees ports 3000 and 3001 |
| FN-002 | Runner Orchestrator | Starts/stops frontend and backend servers |
| FN-003 | Health Check | Confirms backend is alive at /health |
| FN-004 | Input Validator | Validates incoming code before processing |
| FN-005 | AI Provider Adapter | Sends code to Gemini API, handles response |
| FN-006 | Response Parser/Normalizer | Parses AI output into stable JSON |
| FN-007 | Fallback Generator | Generates safe response if AI fails |
| FN-008 | Logger | Logs all request/response lifecycle events |

---

## 5. Detailed Function Specifications

### FN-001 — Port Manager

**Purpose:** Ensures ports 3000 and 3001 are available before launching servers.

**Responsibilities:**
- Check if ports 3000 and 3001 are in use
- Attempt to kill processes using these ports
- Report if ports cannot be freed
- Fail loudly if ports remain occupied

**Implementation Location:** `runner.js`

**Port Check Logic:**
```
1. Check port 3000 → if occupied, get PID
2. Check port 3001 → if occupied, get PID
3. Kill processes on both ports
4. Verify ports are free
5. If not free after kill attempts, exit with error
```

---

### FN-002 — Runner Orchestrator

**Purpose:** Manages the lifecycle of both frontend and backend servers.

**Responsibilities:**
- Start frontend (Vite) on port 3000
- Start backend (Express) on port 3001
- Stream logs to terminal
- Handle Ctrl+C graceful shutdown
- Coordinate startup order (backend first, then frontend)

**Implementation Location:** `runner.js`

**Startup Sequence:**
```
1. Check port availability (FN-001)
2. Start backend server
3. Wait for backend to be ready
4. Start frontend server
5. Log startup completion
6. Monitor for shutdown signal
```

**Shutdown Sequence:**
```
1. Receive Ctrl+C signal
2. Log shutdown requested
3. Kill frontend process
4. Kill backend process
5. Log shutdown completed
6. Exit process
```

---

### FN-003 — Health Check

**Purpose:** Confirms backend is alive and responding.

**Endpoint:** `GET /health`

**Request:** None

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-24T00:00:00.000Z",
  "service": "ai-code-reviewer-backend"
}
```

**Error Cases:** None (always returns 200 if server is running)

**UI Component:** None (internal health check only)

---

### FN-004 — Input Validator

**Purpose:** Validates incoming code before sending to AI provider.

**Responsibilities:**
- Ensure code is a string
- Reject empty or whitespace-only input
- Apply length limits (max 50,000 characters)
- Log validation results

**Input Schema:**
```json
{
  "code": "string"
}
```

**Validation Rules:**
| Rule | Error Message |
|------|---------------|
| code must exist | "Code is required" |
| code must be string | "Code must be a string" |
| code not empty | "Code cannot be empty" |
| code within length | "Code exceeds maximum length of 50,000 characters" |

**Output Schema:**
```json
{
  "valid": true,
  "code": "validated code string"
}
```
or
```json
{
  "valid": false,
  "error": "error message"
}
```

**Error Cases:**
- Returns `{ valid: false, error: "..." }` for any validation failure
- Logs validation failure with FN-008 logger

**UI Component:** App.tsx (via handleAnalyze)

---

### FN-005 — AI Provider Adapter

**Purpose:** Sends validated code to Gemini API and handles responses.

**Responsibilities:**
- Construct prompt for code review
- Call Google Generative Language API with gemini-flash-latest model
- Handle response JSON
- Manage API credentials securely via environment variables

**AI Request Configuration:**
```javascript
{
  model: "gemini-flash-latest",
  url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": API_KEY
  },
  body: {
    contents: [
      {
        parts: [{ text: codeReviewPrompt + userCode }]
      }
    ]
  }
}
```

**Code Review Prompt:**
```
You are an expert code reviewer. Analyze the following code and provide a detailed review.

For the code below, identify:
1. Bugs and issues (if any)
2. Suggestions for improvements (if any)
3. A plain English explanation of what the code does
4. An optimized version of the code (if improvements are possible)

Provide your response in valid JSON format:
{
  "bugs": ["bug1 description", "bug2 description"],
  "improvements": ["improvement1", "improvement2"],
  "explanation": "plain English explanation",
  "optimized_code": "optimized code or original if already optimal"
}

Code to review:
[pasted code here]
```

**Response Handling:**
- Parse JSON response from Gemini API
- Extract text from `data.candidates[0].content.parts[0].text`
- Return complete response
- Handle API errors gracefully

**Error Cases:**
- API key missing → Returns error to FN-006
- API timeout → Returns error to FN-006
- API rate limit → Returns error to FN-006
- Network error → Returns error to FN-006

**UI Component:** App.tsx (via POST /api/analyze)

---

### FN-006 — Response Parser / Normalizer

**Purpose:** Parses AI response and normalizes it into the app's expected schema.

**Responsibilities:**
- Parse raw AI text output into JSON
- Validate required fields exist
- Calculate code quality score
- Record processing time
- Ensure frontend always receives stable JSON

**Output Schema:**
```json
{
  "language": "JavaScript",
  "bugs": ["bug description 1", "bug description 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "explanation": "This code does X by Y...",
  "optimized_code": "const optimized = true;",
  "score": 85,
  "time": "1.2s"
}
```

**Score Calculation:**
- Starts at 100
- -5 for each bug found
- -2 for each improvement suggestion
- Minimum score: 0

**Language Detection:**
- AI model auto-detects from code content
- Stored in response for metadata display

**Error Cases:**
- JSON parse failure → Triggers FN-007 fallback
- Missing required fields → Triggers FN-007 fallback
- Invalid response structure → Triggers FN-007 fallback

**UI Components:**
- BugsSection (receives `result.bugs`)
- ImprovementsSection (receives `result.improvements`)
- ExplanationSection (receives `result.explanation`)
- OptimizedCode (receives `result.optimized_code`)
- MetadataBar (receives `metadata` with language, score, time)

---

### FN-007 — Fallback Generator

**Purpose:** Generates a safe fallback response when AI processing fails.

**Responsibilities:**
- Detect AI processing failures
- Return valid, safe response to prevent frontend crashes
- Log fallback usage for monitoring
- Maintain response schema consistency

**Fallback Response:**
```json
{
  "language": "Unknown",
  "bugs": [],
  "improvements": ["Consider reviewing the code manually for potential issues."],
  "explanation": "Unable to analyze code due to a processing error. Please try again or check your connection.",
  "optimized_code": "",
  "score": 0,
  "time": "0ms"
}
```

**When Triggered:**
- Gemini API returns non-200 status
- Gemini API times out
- JSON parsing fails
- Network errors occur

**UI Component:** All result components receive fallback data

---

### FN-008 — Logger

**Purpose:** Provides comprehensive logging throughout the backend.

**Log Levels and Tags:**
- `[INFO]` - General operational information
- `[DEBUG]` - Detailed debugging information
- `[SUCCESS]` - Successful operations
- `[WARN]` - Warning conditions
- `[ERROR]` - Error conditions

**Logged Events:**
| Event | Log Level | Tag |
|-------|-----------|-----|
| Server startup | INFO | SERVER |
| Port check | DEBUG | PORT |
| Port occupied | WARN | PORT |
| Process killed | INFO | PORT |
| Request received | DEBUG | REQUEST |
| Validation result | DEBUG | VALIDATOR |
| AI call start | INFO | AI |
| AI call finish | SUCCESS | AI |
| Parse success | DEBUG | PARSER |
| Parse failure | ERROR | PARSER |
| Fallback triggered | WARN | FALLBACK |
| Response sent | DEBUG | RESPONSE |
| Health check | DEBUG | HEALTH |
| Shutdown requested | INFO | SERVER |
| Shutdown completed | INFO | SERVER |

**Log Format:**
```
[timestamp] [LEVEL] [TAG] message
Example: [2026-04-24T00:00:00.000Z] [INFO] [SERVER] Backend server starting on port 3001
```

---

## 6. UI Component Mapping to Backend Functions

| UI Component | Backend Function ID | Backend Function Name | API Endpoint |
|--------------|-------------------|---------------------|--------------|
| Header | NONE | N/A | NONE |
| CodeInput | NONE | N/A | NONE |
| ActionBar | FN-004 | Input Validator | POST /api/analyze |
| EmptyState | NONE | N/A | NONE |
| SkeletonLoader | NONE | N/A | NONE |
| ThinkingPanel | NONE | N/A | NONE |
| ResultSection | NONE | N/A | NONE |
| BugsSection | FN-006 | Response Parser | POST /api/analyze |
| ImprovementsSection | FN-006 | Response Parser | POST /api/analyze |
| ExplanationSection | FN-006 | Response Parser | POST /api/analyze |
| OptimizedCode | FN-006 | Response Parser | POST /api/analyze |
| OutputPanel | FN-006 | Response Parser | POST /api/analyze |
| MetadataBar | FN-006 | Response Parser | POST /api/analyze |

---

## 7. Input → Process → Output Descriptions

### POST /api/analyze

**Input (Request Body):**
```json
{
  "code": "function hello() { console.log('Hello'); }"
}
```

**Process Flow:**
```
1. Receive request
2. Log request received (FN-008)
3. Validate input (FN-004)
4. If invalid → return 400 error
5. Log validation success (FN-008)
6. Start timer
7. Send to AI Provider (FN-005)
8. Receive Gemini API response
9. Parse response (FN-006)
10. Calculate score
11. Stop timer
12. Log success (FN-008)
13. Return normalized JSON
```

**Output (Response):**
```json
{
  "language": "JavaScript",
  "bugs": [],
  "improvements": ["Consider using const instead of var"],
  "explanation": "This function logs a greeting to the console",
  "optimized_code": "const hello = () => console.log('Hello');",
  "score": 98,
  "time": "1.5s"
}
```

**Error Output (on failure):**
```json
{
  "error": "description of error",
  "fallback": true
}
```

---

## 8. Error Handling Design

### Error Types and Handling

| Error Type | HTTP Status | Handling |
|------------|-------------|----------|
| Invalid input (FN-004) | 400 | Return validation error message |
| AI API error (FN-005) | 500 | Trigger fallback (FN-007) |
| Parse error (FN-006) | 500 | Trigger fallback (FN-007) |
| Network error | 500 | Trigger fallback (FN-007) |
| Server error | 500 | Return generic error message |

### Error Response Format
```json
{
  "error": "Human-readable error message",
  "fallback": true,  // only present if fallback was used
  "details": "Technical details for debugging"  // only in development
}
```

---

## 9. Logging Design

### Logger Implementation

```javascript
const log = {
  info: (tag, message) => console.log(`[${new Date().toISOString()}] [INFO] [${tag}] ${message}`),
  debug: (tag, message) => console.log(`[${new Date().toISOString()}] [DEBUG] [${tag}] ${message}`),
  success: (tag, message) => console.log(`[${new Date().toISOString()}] [SUCCESS] [${tag}] ${message}`),
  warn: (tag, message) => console.log(`[${new Date().toISOString()}] [WARN] [${tag}] ${message}`),
  error: (tag, message) => console.log(`[${new Date().toISOString()}] [ERROR] [${tag}] ${message}`)
};
```

### Request/Response Logging

Every API request logs:
- Request ID (generated UUID)
- Method and path
- Request body (sanitized)
- Validation result
- AI call start/end
- Response status
- Response time

---

## 10. Runner Behavior

### runner.js Responsibilities

1. **Port Management (FN-001)**
   - Check ports 3000 and 3001
   - Kill processes on occupied ports
   - Verify ports are free before proceeding

2. **Server Startup (FN-002)**
   - Start backend on port 3001
   - Wait for backend health check to pass
   - Start frontend on port 3000
   - Display startup logs

3. **Process Monitoring**
   - Monitor both server processes
   - Display combined output
   - Handle process exits

4. **Graceful Shutdown**
   - Listen for Ctrl+C
   - Kill both processes
   - Log shutdown sequence
   - Exit cleanly

### Startup Logs
```
[INFO] [RUNNER] Starting LogicLLM...
[INFO] [PORT] Checking port 3000...
[DEBUG] [PORT] Port 3000 is available
[INFO] [PORT] Checking port 3001...
[DEBUG] [PORT] Port 3001 is available
[INFO] [RUNNER] Starting backend server on port 3001...
[SUCCESS] [SERVER] Backend server ready
[INFO] [RUNNER] Starting frontend server on port 3000...
[SUCCESS] [SERVER] Frontend server ready
[INFO] [RUNNER] All servers running. Press Ctrl+C to stop.
```

### Port Occupation Handling
```
[INFO] [PORT] Checking port 3000...
[WARN] [PORT] Port 3000 is occupied by PID 12345
[INFO] [PORT] Killing process on port 3000...
[SUCCESS] [PORT] Process killed
[INFO] [PORT] Checking port 3001...
[ERROR] [PORT] Port 3001 is still occupied after kill attempt
[ERROR] [RUNNER] Cannot start servers. Ports unavailable.
[INFO] [RUNNER] Shutting down...
```

---

## 11. Environment Variable Usage

| Variable | Description | Required | Location Used |
|----------|-------------|----------|---------------|
| GEMMA_API_KEY | API key for Google Generative Language API | YES | FN-005 (AI Provider Adapter) |
| FRONTEND_PORT | Frontend server port (fixed: 3000) | NO (default 3000) | FN-002 |
| BACKEND_PORT | Backend server port (fixed: 3001) | NO (default 3001) | FN-002 |

### Environment File (.env)
```
GEMMA_API_KEY=your_google_api_key_here
```

### Getting an API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key with access to the Generative Language API
3. Copy the key to your `.env` file

---

## 12. File Responsibilities

### Project Structure
```
LogicLLM/
├── frontend/                    # React frontend (Vite)
│   ├── src/
│   │   └── app/
│   │       ├── components/      # UI Components (annotated)
│   │       ├── App.tsx          # Main app with API calls
│   │       └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── index.js             # Express server entry
│   │   ├── routes/
│   │   │   └── analyze.js       # POST /api/analyze
│   │   ├── middleware/
│   │   │   └── validator.js     # FN-004 Input Validator
│   │   ├── services/
│   │   │   ├── aiProvider.js    # FN-005 AI Provider Adapter (Gemini)
│   │   │   ├── parser.js        # FN-006 Response Parser
│   │   │   └── fallback.js      # FN-007 Fallback Generator
│   │   └── utils/
│   │       └── logger.js        # FN-008 Logger
│   └── package.json
├── runner.js                    # FN-001 & FN-002 (Port Manager + Orchestrator)
├── backend_implementation.md    # This documentation
└── README.md
```

### Backend File Details

**`backend/src/index.js`**
- Express server setup
- CORS configuration
- Route mounting
- Health check endpoint (FN-003)
- Error handling middleware
- dotenv configuration for GEMMA_API_KEY

**`backend/src/routes/analyze.js`**
- POST /api/analyze endpoint
- Coordinates FN-004, FN-005, FN-006, FN-007
- Request logging (FN-008)
- Response formatting

**`backend/src/middleware/validator.js`**
- FN-004 Input Validator
- Validates code property
- Returns validation result

**`backend/src/services/aiProvider.js`**
- FN-005 AI Provider Adapter
- Google Generative Language API integration
- Direct fetch calls with X-goog-api-key header
- Response parsing from Gemini API format

**`backend/src/services/parser.js`**
- FN-006 Response Parser
- JSON parsing from AI output
- Schema validation
- Score calculation

**`backend/src/services/fallback.js`**
- FN-007 Fallback Generator
- Safe response generation
- Error-aware fallback

**`backend/src/utils/logger.js`**
- FN-008 Logger
- Tagged log levels
- Timestamp formatting
- Console output

---

## 13. API Reference

### GET /health

**Description:** Health check endpoint

**Request:**
```http
GET /health HTTP/1.1
Host: localhost:3001
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-04-24T00:00:00.000Z",
  "service": "ai-code-reviewer-backend"
}
```

---

### POST /api/analyze

**Description:** Analyze code and return review results

**Request:**
```http
POST /api/analyze HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "code": "function add(a, b) { return a + b; }"
}
```

**Response (200):**
```json
{
  "language": "JavaScript",
  "bugs": [],
  "improvements": ["Consider adding type hints if using TypeScript"],
  "explanation": "This function takes two numbers and returns their sum",
  "optimized_code": "const add = (a, b) => a + b;",
  "score": 98,
  "time": "1.2s"
}
```

**Response (400 - Validation Error):**
```json
{
  "error": "Code cannot be empty"
}
```

**Response (500 - Fallback):**
```json
{
  "language": "Unknown",
  "bugs": [],
  "improvements": ["Unable to analyze code. Please try again."],
  "explanation": "An error occurred during analysis.",
  "optimized_code": "",
  "score": 0,
  "time": "0ms",
  "fallback": true
}
```

---

## 14. Supported Gemini Models

The AI Provider Adapter supports any Gemini model available in the Google Generative Language API. To change models, modify the `model` variable in `backend/src/services/aiProvider.js`.

| Model | Description |
|-------|-------------|
| gemini-flash-latest | Fast, cost-effective for code review (default) |
| gemini-2.0-flash | Latest Gemini 2.0 Flash model |
| gemini-1.5-flash | Stable Gemini 1.5 Flash model |
| gemini-1.5-pro | Higher quality but slower |
| gemini-2.0-pro | Most capable Gemini 2.0 model |

### Changing the Model

In `backend/src/services/aiProvider.js`:

```javascript
const model = 'gemini-1.5-pro';  // Change this to any available model
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
```
