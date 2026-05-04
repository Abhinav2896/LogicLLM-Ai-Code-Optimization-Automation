# Backend Implementation Documentation

## 1. Project Overview

**Project Name:** LogicLLM

**Project Goal:** Build a code-review application where a React frontend accepts user code, sends it to a Node.js backend, which calls a Python RAG microservice that uses Google's Gemini API with retrieval-augmented generation to provide enhanced code reviews.

**Frontend:** React + Vite on port 3000
**Backend:** Node.js + Express on port 3001
**RAG Service:** Python + FastAPI on port 8000

---

## 2. Backend Architecture

### Technology Stack
- **Runtime:** Node.js (backend), Python 3.10+ (RAG service)
- **Framework:** Express.js (backend), FastAPI (RAG service)
- **AI Provider:** Google Generative Language API via LangChain
- **Model:** `gemini-flash-latest` (default, configurable via env)
- **Vector Store:** FAISS with HuggingFace Embeddings (`all-MiniLM-L6-v2`)
- **Logging:** Custom logger with tagged log levels

### Server Configuration
| Service | Port | Technology |
|---------|------|------------|
| Frontend | 3000 | React + Vite |
| Backend | 3001 | Node.js + Express |
| RAG Service | 8000 | Python + FastAPI |

---

## 3. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Port 3000)                      │
│                      React + Vite — NO CHANGE                   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    POST /api/analyze { code }
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NODE.JS BACKEND (Port 3001)                    │
│                                                                    │
│  FN-004: validator.js ──► FN-005-RAG: ragClient.js              │
│                                    │                              │
│                          POST http://localhost:8000/analyze       │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    { code, language_hint }
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PYTHON RAG SERVICE (Port 8000)                  │
│                  FastAPI + LangChain + FAISS                      │
│                                                                    │
│  1. Receive code from Node.js                                     │
│  2. Embed code query → FAISS vector search                        │
│  3. Retrieve top-2 relevant knowledge chunks                       │
│  4. Inject context into structured Gemini prompt                  │
│  5. Call Gemini API                                              │
│  6. Parse + return structured JSON                               │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    Vector Similarity Search
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FAISS VECTOR STORE (local disk)                  │
│                  LangChain FAISS + HuggingFace Embeddings          │
│                                                                    │
│  Knowledge base:                                                  │
│  - Language-specific best practices (Python, JS, TS, Java)        │
│  - Common bug patterns per language                               │
│  - Security vulnerability patterns                               │
│  - Performance optimization techniques                           │
│  - Clean code / SOLID principles                                 │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    Gemini API call (with injected context)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  GOOGLE GEMINI API                                │
│                  gemini-2.0-flash                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Backend Function Registry

| Function ID | Function Name | Purpose |
|-------------|---------------|---------|
| FN-001 | Port Manager | Checks and frees ports 3000, 3001, and 8000 |
| FN-002 | Runner Orchestrator | Starts/stops all services |
| FN-003 | Health Check (Node) | Confirms backend alive at /health |
| FN-003b | Health Check (RAG) | Confirms RAG service alive at :8000/health |
| FN-004 | Input Validator | Validates incoming code before processing |
| FN-005 | AI Provider Adapter | Direct Gemini caller (DEPRECATED) |
| FN-005-RAG | RAG Client | HTTP client to Python RAG service |
| FN-006 | Response Parser/Normalizer | Parses AI output into stable JSON |
| FN-007 | Fallback Generator | Generates safe response if AI fails |
| FN-008 | Logger | Logs all request/response lifecycle events |
| FN-009 | RAG Pipeline | FAISS retrieval + Gemini call orchestration |
| FN-010 | Vector Store | FAISS index build/load/search |

---

## 5. Node.js Files

### 5.1 — `backend/src/services/ragClient.js` (FN-005-RAG)

HTTP client that calls the Python RAG service instead of calling Gemini directly.

**Responsibilities:**
- POST to `http://localhost:8000/analyze` with `{ code: string }`
- Timeout: 120000ms
- Return stable payload from `response.data.data`
- Preserve compatibility by returning parser-ready JSON string
- Log all RAG-related events with `[RAG]` tag

**Function signature:**
```javascript
analyzeCode(code: string) → Promise<{ success: boolean, data: string, time: string }>
```

### 5.2 — `backend/src/services/aiProvider.js` (DEPRECATED)

Original direct Gemini API caller. Kept with deprecation comment as fallback reference.

### 5.3 — `backend/src/routes/analyze.js` (MINIMAL CHANGE)

Only change: import `ragClient.js` instead of `aiProvider.js`

```javascript
// Change:
import analyzeCode from '../services/ragClient.js';
// Instead of:
import callAIProvider from '../services/aiProvider.js';
```

### 5.4 — `backend/package.json`

Added `axios` dependency for HTTP calls to RAG service.

---

## 6. Python RAG Service Files

### 6.1 — `rag_service/vector_store.py`

FAISS index management:
- `build_index()`: Chunk knowledge files, embed, save to FAISS
- `load_index()`: Load pre-built index (auto-build if missing)
- `search(query, k)`: Return top-k relevant chunks

### 6.2 — `rag_service/rag_pipeline.py`

Core RAG orchestration:
1. Load vector store (cached)
2. Search FAISS for top-2 relevant chunks
3. Build prompt with context
4. Call Gemini via LangChain
5. Parse and return safe JSON (fallback object on parse failure)

### 6.3 — `rag_service/main.py`

FastAPI application with startup warmup to reduce first-request latency.

**Endpoints:**
- `GET /health` — Health check
- `POST /analyze` — Code analysis
  - Returns `{ "success": true, "data": { ...analysis... } }`

### 6.4 — `rag_service/ingest.py`

Standalone script to build FAISS index from knowledge base.

---

## 7. Knowledge Base Files

Located in `rag_service/data/knowledge_base/`:

| File | Content |
|------|---------|
| python_best_practices.md | PEP8, type hints, exception handling, dataclasses |
| javascript_best_practices.md | ES6+, async/await, destructuring, modules |
| typescript_best_practices.md | Strict mode, generics, utility types |
| java_best_practices.md | Stream API, Optional, immutability |
| common_security_bugs.md | SQL injection, XSS, deserialization, SSRF |
| performance_patterns.md | Caching, indexing, connection pooling |
| clean_code_principles.md | SOLID, DRY, meaningful names |

---

## 8. Data Flow

```
User enters code
       │
       ▼
┌──────────────────┐
│  CodeInput.tsx   │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  ActionBar.tsx   │
└──────────────────┘
       │
       ▼
│  App.tsx         │  POST /api/analyze
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-004: validator.js                   │
│  - Checks code is string                 │
│  - Validates not empty                  │
│  - Max 50,000 characters                │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-005-RAG: ragClient.js               │
│  - HTTP POST to RAG service             │
│  - 120s timeout                          │
│  - Returns JSON string                   │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  RAG Service (Port 8000)                │
│  - FN-010: Load FAISS index             │
│  - Search top-2 relevant chunks          │
│  - FN-009: Build prompt + call Gemini   │
│  - Return structured JSON               │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-006: parser.js                      │
│  - Parse JSON response                   │
│  - Calculate score                       │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  FN-007: fallback.js (on error)         │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  JSON Response to Frontend               │
└─────────────────────────────────────────┘
```

---

## 9. Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| GEMMA_API_KEY | rag_service | Google Generative Language API key |
| RAG_PORT | runner.js | RAG service port (default 8000) |
| EMBEDDING_MODEL | rag_service | HuggingFace model (default all-MiniLM-L6-v2) |
| GEMINI_MODEL | rag_service | Gemini model (default gemini-flash-latest) |

---

## 10. Error Handling

| Failure Point | Expected Behavior |
|---------------|-------------------|
| FAISS index missing | Auto-build on startup |
| RAG service down | ragClient throws → FN-007 fallback |
| RAG timeout (>120s) | ragClient throws → FN-007 fallback |
| Gemini API error | HTTP 500 → ragClient throws → FN-007 |
| JSON parse failure | HTTP 500 → ragClient throws → FN-007 |

---

## 11. Running the Application

### First-time Setup
```bash
cd backend
npm install
cd ..\rag_service
python -m venv .venv_local
.venv_local\Scripts\activate
pip install -r requirements.txt
python ingest.py
```

### Start All Services
```bash
node runner.js
```

### Services
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- RAG Service: http://localhost:8000

---

## 12. Function Specifications

### FN-001 — Port Manager
Checks and frees ports 3000, 3001, and 8000.

### FN-002 — Runner Orchestrator
Manages lifecycle of all three services (RAG, backend, frontend).

### FN-003 — Health Check (Node)
`GET /health` — Confirms backend is alive.

### FN-003b — Health Check (RAG)
`GET :8000/health` — Confirms RAG service is alive.

### FN-004 — Input Validator
Validates code is string, not empty, max 50,000 chars.

### FN-005 — AI Provider Adapter
DEPRECATED. Direct Gemini API caller kept as fallback.

### FN-005-RAG — RAG Client
HTTP client to Python RAG service with retry logic.

### FN-006 — Response Parser
Parses AI JSON output, calculates score.

### FN-007 — Fallback Generator
Returns safe fallback response on errors.

### FN-008 — Logger
Tagged logging for all backend events.

### FN-009 — RAG Pipeline
Core RAG orchestration in Python.

### FN-010 — Vector Store
FAISS index management for knowledge retrieval.
