import os
import fitz  # PyMuPDF
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Clario API", version="1.0.0")

# Allow requests from Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}
MAX_FILE_SIZE_MB = 25
MAX_TEXT_CHARS = 4000


def extract_text(file_path: str, content_type: str) -> str:
    """Extract plain text from a saved file."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
            if len(text) >= MAX_TEXT_CHARS:
                break
        doc.close()
        return text[:MAX_TEXT_CHARS].strip()

    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()[:MAX_TEXT_CHARS].strip()

    # For .doc/.docx — basic fallback: read raw bytes and pull ASCII
    with open(file_path, "rb") as f:
        raw = f.read()
    text = raw.decode("utf-8", errors="ignore")
    return text[:MAX_TEXT_CHARS].strip()


def get_ai_summary(text: str, file_name: str) -> str:
    """Call OpenAI to generate a concise document summary."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return (
            "AI summary unavailable — OPENAI_API_KEY is not configured. "
            "Please add it to your .env file."
        )

    client = OpenAI(api_key=api_key)

    prompt = f"""You are an expert legal and financial document analyst.
Analyze the following document excerpt and provide a clear, professional summary in 5–6 concise bullet points.
Focus on: document type, key obligations/terms, important dates/amounts, risks, and governing law.
Format each point as a single sentence starting with a bullet "•".

Document name: {file_name}

Document text:
\"\"\"
{text}
\"\"\"

Summary:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()


@app.get("/health")
def health():
    return {"status": "ok", "service": "Clario API"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # --- Validate file presence ---
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    # --- Validate extension ---
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{ext}'. Allowed: PDF, DOC, DOCX, TXT.",
        )

    # --- Read file & validate size ---
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Maximum allowed size is {MAX_FILE_SIZE_MB} MB.",
        )

    # --- Save file ---
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as f:
        f.write(contents)

    # --- Extract text ---
    try:
        text = extract_text(save_path, file.content_type or "")
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not extract text from document: {str(exc)}",
        )

    if not text or len(text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Document appears to be empty or contains no readable text (e.g. scanned image PDF).",
        )

    # --- AI Summary ---
    try:
        summary = get_ai_summary(text, file.filename)
    except Exception as exc:
        summary = f"Summary generation failed: {str(exc)}"

    return {
        "status": "success",
        "file_name": file.filename,
        "file_size_mb": round(size_mb, 2),
        "summary": summary,
        "extracted_chars": len(text),
    }
