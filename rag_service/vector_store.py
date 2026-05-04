from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "data" / "knowledge_base"
INDEX_PATH = BASE_DIR / "faiss_index"


def build_index():
    docs = []
    for file in DATA_PATH.iterdir():
        if file.is_file():
            with open(file, "r", encoding="utf-8") as f:
                docs.append(f.read())

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.create_documents(docs)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    db = FAISS.from_documents(chunks, embeddings)
    db.save_local(str(INDEX_PATH))


def load_index():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return FAISS.load_local(str(INDEX_PATH), embeddings, allow_dangerous_deserialization=True)
