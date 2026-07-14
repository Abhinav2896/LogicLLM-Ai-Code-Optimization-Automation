import logging
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from pathlib import Path
from config import EMBEDDING_MODEL

logger = logging.getLogger("rag_service.vector_store")

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "data" / "knowledge_base"


def _get_embeddings():
    """Return the shared HuggingFace embeddings model."""
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)


def build_index():
    """Chunk all knowledge base .md files, embed them, and build an in-memory FAISS index."""
    logger.info("Building FAISS index in memory from %s", DATA_PATH)

    if not DATA_PATH.exists() or not any(DATA_PATH.iterdir()):
        raise FileNotFoundError(f"Knowledge base directory is empty or missing: {DATA_PATH}")

    docs = []
    for file in DATA_PATH.iterdir():
        if file.is_file() and file.suffix == ".md":
            logger.debug("Reading %s", file.name)
            with open(file, "r", encoding="utf-8") as f:
                # Add source metadata to the document
                docs.append(Document(page_content=f.read(), metadata={"source": file.name}))

    if not docs:
        raise ValueError("No .md files found in knowledge base directory")

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(docs)
    logger.info("Created %d chunks from %d documents", len(chunks), len(docs))

    embeddings = _get_embeddings()
    db = FAISS.from_documents(chunks, embeddings)
    logger.info("In-memory FAISS index successfully built.")
    return db


def load_index():
    """
    Load the FAISS index. For security (avoiding pickle deserialization),
    we always build it in memory from scratch on startup.
    """
    return build_index()
