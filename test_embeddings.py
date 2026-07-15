import os
from dotenv import load_dotenv
import requests

load_dotenv("rag_service/.env")
api_key = os.getenv("GEMMA_API_KEY")

def list_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    resp = requests.get(url)
    data = resp.json()
    if "models" in data:
        for m in data["models"]:
            if "embedContent" in m.get("supportedGenerationMethods", []):
                print(f"Embedding model: {m['name']}")
    else:
        print(data)

list_models()
