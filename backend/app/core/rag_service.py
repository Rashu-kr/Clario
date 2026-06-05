import os
from typing import List

import httpx

# Import CHAT_MODEL configuration from the core folder
from app.core.config import CHAT_MODEL


async def generate_rag_answer(
    question: str,
    context_chunks: List[str],
    filename: str
) -> str:
    """
    Asynchronously calls the Gemini REST API to answer a user's question,
    using context chunks retrieved via browser-side local similarity search.

    Args:
        question (str): The user's query.
        context_chunks (List[str]): Context snippets retrieved client-side.
        filename (str): The name of the parsed file.

    Returns:
        str: The generated response from Gemini.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    # If API key is not configured, fall back gracefully to showing the text chunks
    if not api_key:
        answer = "Gemini API key is not configured on the server. Showing retrieved document parts:\n\n"
        for index, chunk in enumerate(context_chunks, start=1):
            answer += f"Part {index}:\n{chunk[:700]}\n\n"
        return answer

    # Format the local context chunks into the prompt context block
    context = "\n\n---\n\n".join(
        f"Chunk {index + 1}:\n{chunk}"
        for index, chunk in enumerate(context_chunks)
    )

    # Standard prompt instruct instructions
    prompt = f"""You are Clario, an AI document analyst.

Answer the user's question using only the document context.

Document: {filename}

Context:
{context}

Question: {question}

Answer:"""

    # Hit the Google Generative Language REST API endpoint directly
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{CHAT_MODEL}:generateContent?key={api_key}"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    # Use HTTPX async client to prevent thread blocking
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(url, json=payload)

        if response.status_code != 200:
            raise Exception(f"Gemini API error ({response.status_code}): {response.text}")

        data = response.json()
        try:
            # Parse response JSON output path
            return data["candidates"][0]["content"]["parts"][0]["text"].strip()
        except (KeyError, IndexError) as err:
            raise Exception(f"Failed to parse Gemini response: {err}. Payload returned: {data}")