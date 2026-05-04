# LogicLLM

AI-powered code review and optimization tool powered by Google's Gemini Flash with RAG (Retrieval-Augmented Generation).

## Architecture Overview

LogicLLM is a full-stack code review application with a React frontend, Node.js backend, and Python RAG microservice. Users submit code through the frontend, which sends it to the backend that calls a Python RAG service. The RAG service retrieves relevant best practices from a knowledge base and uses Gemini to analyze the code.

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Frontend (3000)   │────▶│   Backend (3001)    │────▶│   RAG Service (8000)│
│   React + Vite      │     │   Node.js + Express│     │   FastAPI + LangChain│
│                     │◀────│                     │◀────│                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────────┐
                                                           │   FAISS Vector Store │
                                                           │   (Knowledge Base)   │
                                                           └─────────────────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────────┐
                                                           │   Google Gemini API  │
                                                           │   gemini-flash-latest│
                                                           └─────────────────────┘
```

## Technology Stack

| Layer | Technology | Port |
|-------|------------|------|
| Frontend | React + Vite | 3000 |
| Backend | Node.js + Express | 3001 |
| RAG Service | Python + FastAPI + LangChain | 8000 |
| Vector Store | FAISS + HuggingFace Embeddings | - |
| AI Provider | Google Generative Language API | - |
| Model | gemini-flash-latest (configurable) | - |

## Project Structure

```
LogicLLM/
├── frontend/                          # React frontend application (NO CHANGE)
│   ├── src/
│   │   └── app/
│   │       ├── components/            # UI components
│   │       ├── App.tsx                # Main application component
│   │       └── main.tsx               # Application entry point
│   └── ...
├── backend/                           # Node.js backend application
│   ├── src/
│   │   ├── index.js                   # Express server entry point
│   │   ├── routes/
│   │   │   └── analyze.js             # POST /api/analyze endpoint
│   │   ├── middleware/
│   │   │   └── validator.js           # FN-004: Input validation
│   │   ├── services/
│   │   │   ├── aiProvider.js          # FN-005: DEPRECATED (kept as backup)
│   │   │   ├── ragClient.js           # FN-005-RAG: RAG service client
│   │   │   ├── parser.js              # FN-006: Response parser
│   │   │   └── fallback.js            # FN-007: Fallback generator
│   │   └── utils/
│   │       └── logger.js              # FN-008: Tagged logging system
│   └── package.json
├── rag_service/                       # Python RAG microservice
│   ├── main.py                        # FastAPI entry point
│   ├── rag_pipeline.py                # Core RAG orchestration
│   ├── vector_store.py                # FAISS index management
│   ├── ingest.py                      # Knowledge base ingestion script
│   ├── prompts.py                     # Prompt templates
│   ├── schemas.py                     # Pydantic models
│   ├── config.py                      # Configuration loader
│   ├── data/
│   │   ├── knowledge_base/             # Markdown knowledge documents
│   │   │   ├── python_best_practices.md
│   │   │   ├── javascript_best_practices.md
│   │   │   ├── typescript_best_practices.md
│   │   │   ├── java_best_practices.md
│   │   │   ├── common_security_bugs.md
│   │   │   ├── performance_patterns.md
│   │   │   └── clean_code_principles.md
│   │   └── faiss_index/               # Generated FAISS index (gitignored)
│   ├── requirements.txt
│   └── .env
├── runner.js                          # Server lifecycle manager
├── README.md
└── backend_implementation.md
```

## Backend Function Registry

| ID | Function | Purpose | Location | Status |
|----|----------|---------|----------|--------|
| FN-001 | Port Manager | Checks/frees ports 3000, 3001, 8000 | runner.js | UPDATED |
| FN-002 | Runner Orchestrator | Starts/stops all services | runner.js | UPDATED |
| FN-003 | Health Check (Node) | Confirms backend alive | backend/src/index.js | NO CHANGE |
| FN-003b | Health Check (RAG) | Confirms RAG service alive | rag_service/main.py | NEW |
| FN-004 | Input Validator | Validates code before AI | backend/src/middleware/validator.js | NO CHANGE |
| FN-005 | AI Provider Adapter | Direct Gemini caller | backend/src/services/aiProvider.js | **DEPRECATED** |
| FN-005-RAG | RAG Client | HTTP client to Python RAG | backend/src/services/ragClient.js | **NEW** |
| FN-006 | Response Parser | Parses AI output | backend/src/services/parser.js | NO CHANGE |
| FN-007 | Fallback Generator | Safe fallback on errors | backend/src/services/fallback.js | NO CHANGE |
| FN-008 | Logger | Tagged logging | backend/src/utils/logger.js | NO CHANGE |
| FN-009 | RAG Pipeline | FAISS + Gemini orchestration | rag_service/rag_pipeline.py | **NEW** |
| FN-010 | Vector Store | FAISS index operations | rag_service/vector_store.py | **NEW** |

## Setup Instructions

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- pip

### First-time Setup

**Step 1: Install Node.js dependencies**
```bash
cd backend
npm install
```

**Step 2: Set up Python environment**
```bash
cd rag_service
python -m venv .venv_local
# Windows: .venv_local\Scripts\activate
# Unix: source .venv_local/bin/activate
pip install -r requirements.txt
```

**Step 3: Configure API key**
```bash
# In rag_service/.env
GEMMA_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

**Step 4: Build FAISS index (one-time)**
```bash
cd rag_service
python ingest.py
```

**Step 5: Start everything**
```bash
node runner.js
```

## API Endpoints

### GET /health (Backend)
```json
{ "status": "ok", "timestamp": "...", "service": "ai-code-reviewer-backend" }
```

### GET /health (RAG Service)
```json
{ "status": "ok", "service": "logicllm-rag-service", "timestamp": "..." }
```

### POST /api/analyze

**Request:**
```json
{ "code": "function hello() { console.log('Hello'); }" }
```

**Response:**
```json
{
  "language": "JavaScript",
  "bugs": [],
  "improvements": ["Use const instead of var"],
  "explanation": "This function logs a greeting",
  "optimized_code": "const hello = () => console.log('Hello');",
  "score": 98,
  "time": "1.5s"
}
```

## Configuration

### Environment Variables

**rag_service/.env:**
```env
GEMMA_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

## Supported Models

| Model | Description |
|-------|-------------|
| gemini-flash-latest | Fast, cost-effective (default) |
| gemini-2.0-flash | Gemini 2.0 Flash |
| gemini-1.5-flash | Stable Gemini 1.5 Flash |
| gemini-1.5-pro | Higher quality, slower |

## Performance Notes

- Backend to RAG timeout is set to `120000ms` (2 minutes) to avoid false timeouts on slower calls.
- RAG service runs a startup warmup request to reduce first-user request latency.

## Response Schema

```typescript
interface AnalysisResponse {
  language: string;
  bugs: string[];
  improvements: string[];
  explanation: string;
  optimized_code: string;
  score: number;    // 0-100, computed by parser.js
  time: string;      // Processing time
}
```

## Error Handling

When RAG service fails, FN-007 fallback is triggered:

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

## Rebuilding the Knowledge Base

When knowledge base content changes:
```bash
cd rag_service
python ingest.py
```

## Score Calculation

```
score = 100 - (bugs.length * 5) - (improvements.length * 2)
score = max(0, score)
```
