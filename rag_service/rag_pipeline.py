from langchain_google_genai import ChatGoogleGenerativeAI
from vector_store import load_index
from dotenv import load_dotenv
from pathlib import Path
import os
import json
import re

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMMA_API_KEY", "")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

retriever = load_index().as_retriever(search_kwargs={"k": 2})

llm = ChatGoogleGenerativeAI(
    model=MODEL_NAME
)


def parse_json_safe(raw):
    text = (raw or "").strip()
    text = re.sub(r"```json|```", "", text).strip()

    try:
        return json.loads(text)
    except Exception:
        return {
            "language": "Unknown",
            "bugs": [],
            "improvements": ["Parsing failed"],
            "explanation": text or "No explanation provided.",
            "optimized_code": "",
            "score": 0,
            "time": "0ms"
        }


def analyze_code(code: str):
    docs = retriever.invoke(code)
    context = "\n\n".join([d.page_content for d in docs])

    prompt = f"""
You are an expert code reviewer.

Use this context:
{context}

User Code:
{code}

Return ONLY valid JSON:
{{
  "language": "string",
  "bugs": [],
  "improvements": [],
  "explanation": "string",
  "optimized_code": "string",
  "score": 0,
  "time": "string"
}}
"""

    response = llm.invoke(prompt)
    return parse_json_safe(response.content)
