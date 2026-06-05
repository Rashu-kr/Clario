from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    """
    Health Check Endpoint
    Verifies that the backend server is reachable and active.
    """
    return {
        "status": "ok",
        "service": "Clario Metadata API Gateway",
        "version": "3.0.0"
    }