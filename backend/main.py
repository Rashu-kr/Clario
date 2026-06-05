from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import route controllers from the new restructured app/api/ package
from app.api.chat_routes import router as chat_router
from app.api.health_routes import router as health_router
from app.api.upload_routes import router as upload_router
from app.api.unsupervised_routes import router as unsupervised_router

# Load environment configuration variables (.env) on startup
load_dotenv()

# Instantiate the main FastAPI App Gateway
app = FastAPI(
    title="Clario API — Lightweight Metadata Controller & LLM Proxy",
    description="Refactored to offload 100% of PDF processing and vector operations to client browsers.",
    version="3.0.0"
)

# Set up Cross-Origin Resource Sharing (CORS) middlewares for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints from routing submodules
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(unsupervised_router)


@app.get("/")
def root():
    """
    Root Endpoint
    Returns system status and lists high-level capability stubs.
    """
    return {
        "message": "Clario API is running",
        "version": "3.0.0",
        "architecture": "Client-Side Vector RAG Acceleration",
        "features": [
            "Lightweight Metadata Logging",
            "Asynchronous LLM Proxy (Gemini)",
            "Client-Side WASM / Web Worker Retrieval"
        ]
    }