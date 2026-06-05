from pydantic import BaseModel
from typing import List


class ChatRequest(BaseModel):
    """
    Schema for incoming chat messages.
    Includes the session token, user question, and context chunks retrieved by client-side vector search.
    """
    session_id: str
    question: str
    context_chunks: List[str]