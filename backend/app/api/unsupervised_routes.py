from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/unsupervised",
    tags=["Unsupervised ML Analyzer"]
)


class AnalyzeTextRequest(BaseModel):
    text: str


class AskTextRequest(BaseModel):
    text: str
    question: str


@router.post("/analyze-text")
def analyze_text(request: AnalyzeTextRequest):
    """
    Unsupervised Analysis Text Stub
    Logs the request and returns status confirming browser-side computation.
    """
    print(f"[METADATA CONTROLLER] Unsupervised Analyze Text: {len(request.text)} chars")
    return {
        "success": True,
        "message": "Unsupervised text analysis is offloaded to client browser.",
        "data": {}
    }


@router.post("/ask-text")
def ask_text(request: AskTextRequest):
    """
    Unsupervised QA Text Stub
    Confirming browser-side similarity and TF-IDF matching.
    """
    print(f"[METADATA CONTROLLER] Unsupervised Ask Text: {len(request.text)} chars")
    return {
        "success": True,
        "message": "Unsupervised text question-answering is offloaded to client browser.",
        "data": {}
    }


@router.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    """
    Unsupervised File Analysis Stub
    Identifies file and logs request. Computations occur client-side.
    """
    print(f"[METADATA CONTROLLER] Unsupervised Analyze File: {file.filename}")
    return {
        "success": True,
        "message": "Unsupervised file analysis is offloaded to client browser.",
        "filename": file.filename,
        "data": {}
    }


@router.post("/ask-file")
async def ask_file(
    question: str,
    file: UploadFile = File(...)
):
    """
    Unsupervised File QA Stub
    Confirming search and evidence selection occurs browser-side.
    """
    print(f"[METADATA CONTROLLER] Unsupervised Ask File: {file.filename} | Question: {question}")
    return {
        "success": True,
        "message": "Unsupervised file question-answering is offloaded to client browser.",
        "filename": file.filename,
        "question": question,
        "data": {}
    }