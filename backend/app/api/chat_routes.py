from fastapi import APIRouter, HTTPException

# Import ChatRequest schema from app/models
from app.models.models import ChatRequest
# Import RAG proxy handler from core
from app.core.rag_service import generate_rag_answer
# Import shared memory store from core
from app.core.memory_store import rag_store

router = APIRouter()


@router.post("/chat")
async def chat_with_document(request: ChatRequest):
    """
    Asynchronous RAG Chat Endpoint
    
    Accepts question and local context chunks. Performs metadata checks and invokes
    the core rag_service to proxy prompts to the Gemini model REST API.
    """
    if request.session_id not in rag_store:
        raise HTTPException(
            status_code=404,
            detail="Session not found. Please upload a document first.",
        )

    store = rag_store[request.session_id]

    print(f"[METADATA CONTROLLER] Chat Request: Session: {request.session_id} | Question: {request.question[:50]}...")

    try:
        # Resolve prompt completion asynchronously
        answer = await generate_rag_answer(
            question=request.question,
            context_chunks=request.context_chunks,
            filename=store["filename"],
        )
    except Exception as error:
        print(f"Chat generation error: {error}")
        raise HTTPException(
            status_code=500,
            detail=f"AI answer generation failed: {error}"
        )

    return {
        "answer": answer,
        "retrieved_chunks": len(request.context_chunks),
        "rag_enabled": True,
    }


@router.delete("/session/{session_id}")
def delete_session(session_id: str):
    """
    Session Cleanup Controller
    Removes session data from the memory dictionary.
    """
    if session_id in rag_store:
        del rag_store[session_id]
        print(f"[METADATA CONTROLLER] Session Deleted: {session_id}")
        return {"status": "deleted"}

    return {"status": "not_found"}