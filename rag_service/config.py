import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

GEMMA_API_KEY = os.getenv("GEMMA_API_KEY", "")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
EMBEDDING_MODEL = "models/embedding-001"
TIMEOUT_SECONDS = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "120"))
MAX_CODE_LENGTH = 10000
RETRIEVER_K = 3
