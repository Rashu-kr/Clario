import os

# Base directory setup for potential temporary logging/uploads
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# File Validation constraints
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}
MAX_FILE_SIZE_MB = 25

# RAG & Inference config defaults (mostly offloaded, but maintained for references)
CHUNK_SIZE = 500
CHUNK_OVERLAP = 80
TOP_K_CHUNKS = 5
EMBEDDING_MODEL = ""

# Target Model for Gemini API proxying
CHAT_MODEL = "gemini-2.5-flash-lite"
