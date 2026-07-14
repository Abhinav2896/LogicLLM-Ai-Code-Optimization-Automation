import json
import logging
import re
from typing import Optional

from langchain_google_genai import ChatGoogleGenerativeAI
from vector_store import load_index
from config import MODEL_NAME, TIMEOUT_SECONDS, MAX_CODE_LENGTH, RETRIEVER_K, GEMMA_API_KEY

logger = logging.getLogger("rag_service.pipeline")

# ── Lazy-loaded singletons (avoid crash at import time) ──────────────
_retriever = None
_llm = None


def _get_retriever():
    global _retriever
    if _retriever is None:
        logger.info(f"Loading FAISS retriever (k={RETRIEVER_K})…")
        _retriever = load_index().as_retriever(search_kwargs={"k": RETRIEVER_K})
        logger.info("FAISS retriever ready")
    return _retriever


def _get_llm():
    global _llm
    if _llm is None:
        logger.info("Initializing Gemini LLM model=%s, timeout=%s", MODEL_NAME, TIMEOUT_SECONDS)
        _llm = ChatGoogleGenerativeAI(
            model=MODEL_NAME, 
            temperature=0, 
            timeout=TIMEOUT_SECONDS,
            api_key=GEMMA_API_KEY
        )
        logger.info("Gemini LLM ready")
    return _llm


# ── Prompt template ──────────────────────────────────────────────────

PROMPT_TEMPLATE = """\
You are an expert code reviewer. Analyze the following code thoroughly.

### Reference Context (best practices & known patterns)
{context}

### Language Hint
{language_hint}

### User Code to Review
```
{code}
```

### Instructions
1. Identify the programming language.
2. List all bugs, issues, or potential runtime errors.
3. List actionable improvement suggestions.
4. Provide a clear plain-English explanation of what the code does.
5. Provide an optimized/corrected version of the code.

You MUST respond with ONLY valid JSON — no markdown fences, no commentary outside the JSON object.

{{
  "language": "<detected language>",
  "bugs": ["<bug description>", ...],
  "improvements": ["<suggestion>", ...],
  "explanation": "<what the code does>",
  "optimized_code": "<improved code>"
}}
"""


def _parse_json_safe(raw: str) -> Optional[dict]:
    """Parse the LLM response into the expected JSON schema."""
    text = (raw or "").strip()
    # Strip markdown code fences if present
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"```\s*$", "", text, flags=re.MULTILINE)
    text = text.strip()

    try:
        # Try to extract the outermost JSON object
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            parsed = json.loads(match.group(0))
        else:
            parsed = json.loads(text)

        # Validate and normalize fields
        return {
            "language": parsed.get("language", "Unknown"),
            "bugs": parsed.get("bugs", []) if isinstance(parsed.get("bugs"), list) else [],
            "improvements": parsed.get("improvements", []) if isinstance(parsed.get("improvements"), list) else [],
            "explanation": parsed.get("explanation", "No explanation provided."),
            "optimized_code": parsed.get("optimized_code", ""),
        }
    except (json.JSONDecodeError, AttributeError) as e:
        logger.error("JSON parse failed: %s | raw[:200]=%s", e, text[:200])
        return None


def analyze_code(code: str, language_hint: Optional[str] = None) -> dict:
    """
    Full RAG pipeline: retrieve context → prompt Gemini → parse response.
    Returns a dict matching the frontend's expected schema.
    """
    retriever = _get_retriever()
    llm = _get_llm()

    # Truncate code if too long
    if len(code) > MAX_CODE_LENGTH:
        logger.warning(f"Code truncated from {len(code)} to {MAX_CODE_LENGTH} characters")
        code = code[:MAX_CODE_LENGTH] + "\n... [TRUNCATED] ..."

    # 1. Retrieve relevant context chunks
    logger.info("Retrieving context for code (len=%d)", len(code))
    
    # Prepend language hint to the query if available to improve retrieval
    query = f"{language_hint}\n{code}" if language_hint else code
    docs = retriever.invoke(query)
    
    context = "\n\n".join([d.page_content for d in docs])
    sources = list(set([d.metadata.get("source", "Unknown") for d in docs]))
    logger.debug("Retrieved %d chunks, total context len=%d", len(docs), len(context))

    # 2. Build prompt
    prompt = PROMPT_TEMPLATE.format(
        context=context, 
        code=code,
        language_hint=language_hint or "Not provided"
    )

    # 3. Call Gemini (with one retry on parse failure)
    for attempt in range(2):
        logger.info("Gemini call attempt %d/2", attempt + 1)
        response = llm.invoke(prompt)
        raw_content = response.content
        logger.debug("Gemini raw response len=%d", len(raw_content))

        parsed = _parse_json_safe(raw_content)
        if parsed is not None:
            logger.info("Successfully parsed Gemini response")
            parsed["sources"] = sources
            return parsed

        logger.warning("Parse failed on attempt %d, retrying…", attempt + 1)
        # On retry, add stronger instruction
        prompt = (
            "Your previous response was not valid JSON. "
            "Respond with ONLY a valid JSON object, no other text.\n\n"
            + prompt
        )

    # All attempts failed — return a safe fallback
    logger.error("All parse attempts failed, returning fallback")
    return {
        "language": "Unknown",
        "bugs": [],
        "improvements": ["AI response could not be parsed. Please try again."],
        "explanation": raw_content[:500] if raw_content else "No explanation available.",
        "optimized_code": "",
        "sources": sources
    }
