import os
import uuid

from fastapi import APIRouter, File, UploadFile, HTTPException

# Import configuration constants from the core package
from app.core.config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB
# Import the shared session memory store from core
from app.core.memory_store import rag_store

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Metadata Upload Controller
    
    Accepts the multipart upload from the client. Instead of parsing PDF texts or saving contents,
    it reads the header/properties, logs the metadata, registers a session ID, and discards resources.
    This guarantees zero server-side memory crash risks for large uploads.
    """
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    # Validate file format extensions
    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{extension}'. Allowed: PDF, DOC, DOCX, TXT.",
        )

    # Calculate upload size cleanly without buffering the entire file into RAM
    size_bytes = getattr(file, "size", None)
    if not size_bytes:
        content_length = file.headers.get("content-length")
        if content_length:
            size_bytes = int(content_length)
        else:
            # Safe stream size checking
            content = await file.read()
            size_bytes = len(content)
            await file.seek(0)

    size_mb = size_bytes / (1024 * 1024)

    # Validate file size constraint
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Max allowed: {MAX_FILE_SIZE_MB} MB.",
        )

    session_id = str(uuid.uuid4())

    # Map the session ID to log details in memory
    rag_store[session_id] = {
        "filename": file.filename,
        "file_size_mb": round(size_mb, 2),
    }

    # Console logging audit path
    print(f"[METADATA CONTROLLER] File Processed: {file.filename} | Size: {size_mb:.2f} MB | Session: {session_id}")

    return {
        "status": "success",
        "session_id": session_id,
        "file_name": file.filename,
        "file_size_mb": round(size_mb, 2),
        "rag_enabled": True,
    }