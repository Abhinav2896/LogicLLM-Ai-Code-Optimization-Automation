import logging
import sys
import traceback
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

from rag_pipeline import analyze_code, _get_retriever

# ── Logging setup ────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger("rag_service.main")

# ── FastAPI app ──────────────────────────────────────────────────────
app = FastAPI(title="LogicLLM RAG Service")


class CodeRequest(BaseModel):
    code: str
    language_hint: Optional[str] = None


@app.on_event("startup")
def warmup():
    """Pre-warm the FAISS index and embedding model on startup."""
    logger.info("Running startup warmup…")
    try:
        result = analyze_code("print('warmup')", language_hint="Python")
        logger.info("Warmup complete — response keys: %s", list(result.keys()))
    except Exception as e:
        logger.error("Warmup failed (non-fatal): %s", e)
        logger.debug("Warmup traceback:\n%s", traceback.format_exc())


@app.post("/analyze")
def analyze(req: CodeRequest, request: Request):
    """Analyze user code via RAG pipeline and return structured results."""
    req_id = request.headers.get("x-request-id", "unknown")
    logger.info("[ReqID:%s] POST /analyze — code length=%d, language_hint=%s", req_id, len(req.code), req.language_hint)

    try:
        result = analyze_code(req.code, language_hint=req.language_hint)
        logger.info("[ReqID:%s] Analysis complete — language=%s, bugs=%d, improvements=%d",
                     req_id,
                     result.get("language", "?"),
                     len(result.get("bugs", [])),
                     len(result.get("improvements", [])))
        return {"success": True, "data": result}

    except Exception as e:
        logger.error("[ReqID:%s] Analysis failed: %s", req_id, e)
        logger.debug("[ReqID:%s] Analysis traceback:\n%s", req_id, traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


@app.get("/health")
def health():
    """Health check endpoint."""
    try:
        _get_retriever()
        return {"status": "ok", "service": "logicllm-rag"}
    except Exception as e:
        logger.error("Health check failed: %s", e)
        raise HTTPException(status_code=500, detail="Service unhealthy")
