from fastapi import FastAPI
from pydantic import BaseModel
from rag_pipeline import analyze_code

app = FastAPI()


class CodeRequest(BaseModel):
    code: str


@app.on_event("startup")
def warmup():
    try:
        analyze_code("print('warmup')")
    except Exception:
        pass


@app.post("/analyze")
def analyze(req: CodeRequest):
    result = analyze_code(req.code)
    return {"success": True, "data": result}


@app.get("/health")
def health():
    return {"status": "ok"}
