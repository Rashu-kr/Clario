# Clario

Clario is an AI-powered document analysis platform that enables users to upload documents, generate AI-based summaries, and interact with documents through a Retrieval-Augmented Generation (RAG) chatbot.

The application combines modern AI technologies with a simple and responsive interface to help users understand and explore documents more efficiently.

---

## Features

- Upload PDF documents
- AI-generated document summaries
- Chat with uploaded documents
- Semantic document search
- Retrieval-Augmented Generation (RAG)
- Fast vector similarity search using FAISS
- Session-based document processing
- OpenAI API integration
- Responsive user interface

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- FastAPI
- Python

### AI & Machine Learning

- OpenAI GPT
- OpenAI Embeddings (`text-embedding-3-small`)
- FAISS Vector Database

### Libraries

- LangChain
- NumPy
- Pandas
- Uvicorn

---

## AI Workflow

```text
User Uploads PDF
        │
        ▼
Document Text Extraction
        │
        ▼
Text Chunking
(500 Characters, 80 Overlap)
        │
        ▼
Generate OpenAI Embeddings
        │
        ▼
Store in FAISS Vector Database
        │
        ▼
Generate AI Summary
        │
        ▼
User Asks Questions
        │
        ▼
Retrieve Top Relevant Chunks
        │
        ▼
Generate Context-Aware Response
```

---

## Project Structure

```text
Clario
│
├── frontend/
├── backend/
├── uploads/
├── vectorstore/
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Rashu-kr/Clario.git
```

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Screenshots

Screenshots will be added in a future update.

---

## Future Improvements

- Multi-document chat
- OCR support for scanned PDFs
- Conversation history
- Document sharing
- Cloud storage integration
- Citation-based AI responses
- Multi-language support
- User authentication
- Document version management
- Dark mode

---

## Use Cases

- Research Document Analysis
- Academic Notes
- Business Reports
- Legal Documents
- Technical Documentation
- Educational Content

---

## Author

**Raushan Kumar**

GitHub: https://github.com/Rashu-kr

---

## License

This project is intended for learning, research, and portfolio purposes.
