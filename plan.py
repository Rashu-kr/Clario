from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# ── Color palette ──────────────────────────────────────────────────
PURPLE      = colors.HexColor("#534AB7")
PURPLE_LIGHT= colors.HexColor("#EEEDFE")
PURPLE_MID  = colors.HexColor("#AFA9EC")
TEAL        = colors.HexColor("#0F6E56")
TEAL_LIGHT  = colors.HexColor("#E1F5EE")
AMBER       = colors.HexColor("#854F0B")
AMBER_LIGHT = colors.HexColor("#FAEEDA")
BLUE        = colors.HexColor("#185FA5")
BLUE_LIGHT  = colors.HexColor("#E6F1FB")
RED_LIGHT   = colors.HexColor("#FCEBEB")
RED         = colors.HexColor("#A32D2D")
GREEN_LIGHT = colors.HexColor("#EAF3DE")
GREEN       = colors.HexColor("#3B6D11")
GRAY_LIGHT  = colors.HexColor("#F1EFE8")
GRAY        = colors.HexColor("#5F5E5A")
DARK        = colors.HexColor("#1a1a1a")
WHITE       = colors.white

W, H = A4
MARGIN = 1.8*cm

# ── Styles ─────────────────────────────────────────────────────────
def make_styles():
    base = getSampleStyleSheet()
    s = {}

    s['cover_title'] = ParagraphStyle('cover_title',
        fontSize=28, leading=36, textColor=WHITE,
        fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=6)

    s['cover_sub'] = ParagraphStyle('cover_sub',
        fontSize=13, leading=18, textColor=colors.HexColor("#CECBF6"),
        fontName='Helvetica', alignment=TA_CENTER)

    s['section_head'] = ParagraphStyle('section_head',
        fontSize=15, leading=20, textColor=PURPLE,
        fontName='Helvetica-Bold', spaceBefore=18, spaceAfter=8)

    s['phase_title'] = ParagraphStyle('phase_title',
        fontSize=13, leading=17, textColor=WHITE,
        fontName='Helvetica-Bold', spaceAfter=4)

    s['phase_sub'] = ParagraphStyle('phase_sub',
        fontSize=10, leading=14, textColor=colors.HexColor("#CECBF6"),
        fontName='Helvetica')

    s['body'] = ParagraphStyle('body',
        fontSize=10, leading=15, textColor=DARK,
        fontName='Helvetica', spaceAfter=5)

    s['task_title'] = ParagraphStyle('task_title',
        fontSize=10, leading=14, textColor=DARK,
        fontName='Helvetica-Bold', spaceAfter=2)

    s['task_body'] = ParagraphStyle('task_body',
        fontSize=9, leading=13, textColor=GRAY,
        fontName='Helvetica')

    s['code'] = ParagraphStyle('code',
        fontSize=8.5, leading=13, textColor=colors.HexColor("#3C3489"),
        fontName='Courier', spaceAfter=2)

    s['small'] = ParagraphStyle('small',
        fontSize=8.5, leading=12, textColor=GRAY,
        fontName='Helvetica')

    s['label'] = ParagraphStyle('label',
        fontSize=8, leading=11, textColor=GRAY,
        fontName='Helvetica-Bold', spaceBefore=10, spaceAfter=4,
        textTransform='uppercase')

    s['checklist'] = ParagraphStyle('checklist',
        fontSize=9.5, leading=15, textColor=DARK,
        fontName='Helvetica', leftIndent=12, spaceAfter=3)

    s['deliverable'] = ParagraphStyle('deliverable',
        fontSize=9.5, leading=14, textColor=TEAL,
        fontName='Helvetica-Bold', leftIndent=12)

    s['table_title'] = ParagraphStyle('table_title',
        fontSize=9, leading=13, textColor=DARK,
        fontName='Helvetica-Bold')

    s['table_field'] = ParagraphStyle('table_field',
        fontSize=8, leading=12, textColor=GRAY,
        fontName='Courier')

    s['center'] = ParagraphStyle('center',
        fontSize=10, leading=14, textColor=DARK,
        fontName='Helvetica', alignment=TA_CENTER)

    s['tip'] = ParagraphStyle('tip',
        fontSize=9.5, leading=14, textColor=TEAL,
        fontName='Helvetica', leftIndent=8)

    return s

S = make_styles()


def hr(color=PURPLE_MID, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=6, spaceBefore=6)


def phase_header(num, title, subtitle, weeks, bg):
    data = [[
        Paragraph(f"Phase {num}", ParagraphStyle('pn', fontSize=9, textColor=colors.HexColor("#CECBF6"), fontName='Helvetica-Bold')),
        Paragraph(title, S['phase_title']),
        Paragraph(weeks, ParagraphStyle('pw', fontSize=9, textColor=WHITE, fontName='Helvetica-Bold', alignment=TA_RIGHT))
    ]]
    t = Table(data, colWidths=[1.5*cm, 12*cm, 3.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [bg]),
        ('BOX', (0,0), (-1,-1), 0, bg),
        ('INNERGRID', (0,0), (-1,-1), 0, bg),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (0,-1), 10),
        ('LEFTPADDING', (1,0), (1,-1), 8),
        ('RIGHTPADDING', (-1,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    sub_data = [[Paragraph(subtitle, S['phase_sub'])]]
    sub_t = Table(sub_data, colWidths=[W - 2*MARGIN])
    sub_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 18),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    return [t, sub_t]


def task_card(title, desc, bg=GRAY_LIGHT):
    return Table(
        [[Paragraph(title, S['task_title'])], [Paragraph(desc, S['task_body'])]],
        colWidths=[W - 2*MARGIN]
    )


def tasks_grid(tasks, bg=GRAY_LIGHT):
    col_w = (W - 2*MARGIN - 0.3*cm) / 2
    rows = []
    for i in range(0, len(tasks), 2):
        row = []
        for j in range(2):
            if i+j < len(tasks):
                t, d = tasks[i+j]
                cell = [Paragraph(t, S['task_title']), Paragraph(d, S['task_body'])]
            else:
                cell = [Paragraph("", S['task_body'])]
            row.append(cell)
        rows.append(row)
    t = Table(rows, colWidths=[col_w, col_w], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D3D1C7")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t


def checklist_items(items, dot_color=PURPLE):
    els = []
    for item in items:
        els.append(Paragraph(f"  •  {item}", S['checklist']))
    return els


def stack_table(rows_data):
    col_w1 = 3*cm
    col_w2 = W - 2*MARGIN - col_w1
    rows = []
    for layer, techs in rows_data:
        rows.append([
            Paragraph(layer, ParagraphStyle('sl', fontSize=9, fontName='Helvetica-Bold', textColor=GRAY)),
            Paragraph(techs, ParagraphStyle('st', fontSize=9, fontName='Helvetica', textColor=DARK, leading=14))
        ])
    t = Table(rows, colWidths=[col_w1, col_w2])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), WHITE),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [GRAY_LIGHT, WHITE]),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D3D1C7")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t


def db_schema_table():
    tables = [
        ("users", "id, name, email\npassword_hash\nrole, plan\ncreated_at"),
        ("documents", "id, user_id\nfilename, file_url\ndoc_type, status\nuploaded_at, pages"),
        ("analyses", "id, document_id\nsummary (text)\nrisk_score (0-10)\nlanguage, created_at"),
        ("clauses", "id, analysis_id\nclause_type\nclause_text\nrisk_level, page_no"),
        ("chat_messages", "id, document_id\nuser_id, role\ncontent (text)\ntimestamp"),
        ("doc_chunks", "id, document_id\nchunk_text\nembedding_id\npage_no, chunk_index"),
    ]
    col_w = (W - 2*MARGIN) / 3 - 0.1*cm
    rows = []
    for i in range(0, len(tables), 3):
        row = []
        for j in range(3):
            if i+j < len(tables):
                name, fields = tables[i+j]
                row.append([
                    Paragraph(name, S['table_title']),
                    Paragraph(fields, S['table_field'])
                ])
            else:
                row.append([Paragraph("", S['table_body'])])
        rows.append(row)
    t = Table(rows, colWidths=[col_w, col_w, col_w])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GRAY_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#D3D1C7")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t


def tip_box(text, bg=TEAL_LIGHT, tc=TEAL):
    data = [[Paragraph(text, ParagraphStyle('tip', fontSize=9.5, leading=14, textColor=tc, fontName='Helvetica', leftIndent=4))]]
    t = Table(data, colWidths=[W - 2*MARGIN])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('BOX', (0,0), (-1,-1), 0.5, tc),
        ('TOPPADDING', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('BORDERRADIUS', (0,0), (-1,-1), 4),
    ]))
    return t


# ── Cover page ─────────────────────────────────────────────────────
def cover_page():
    # Big purple banner
    cover_data = [[
        Paragraph("AI Legal Document Analyzer", S['cover_title']),
        Spacer(1, 8),
        Paragraph("Complete Build Plan — Zero to Deployed", S['cover_sub']),
        Spacer(1, 6),
        Paragraph("MCA Final Year Project  |  14-Week Implementation Roadmap", S['cover_sub']),
    ]]
    cover_t = Table([[cover_data[0][0]], [cover_data[0][1]], [cover_data[0][2]], [cover_data[0][3]], [cover_data[0][4]]],
                    colWidths=[W - 2*MARGIN])
    cover_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PURPLE),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 24),
        ('RIGHTPADDING', (0,0), (-1,-1), 24),
    ]))

    meta_rows = [
        ["Total Duration", "14 Weeks (3.5 Months)"],
        ["Phases", "4 Phases — Foundation → AI → UI → Deploy"],
        ["Tech Stack", "React + FastAPI + LangChain + OpenAI + PostgreSQL"],
        ["Difficulty", "Hard — but broken into daily tasks"],
        ["Goal", "Live deployed product at a public URL"],
    ]
    meta_t = Table(meta_rows, colWidths=[5*cm, W - 2*MARGIN - 5*cm])
    meta_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), PURPLE_LIGHT),
        ('BACKGROUND', (1,0), (1,-1), WHITE),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [PURPLE_LIGHT, GRAY_LIGHT]),
        ('BOX', (0,0), (-1,-1), 0.5, PURPLE_MID),
        ('INNERGRID', (0,0), (-1,-1), 0.5, PURPLE_MID),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('TEXTCOLOR', (0,0), (0,-1), PURPLE),
        ('TEXTCOLOR', (1,0), (1,-1), DARK),
    ]))

    return [
        Spacer(1, 1.5*cm),
        cover_t,
        Spacer(1, 0.8*cm),
        Paragraph("Project Overview", S['section_head']),
        hr(),
        Spacer(1, 4),
        meta_t,
        Spacer(1, 0.8*cm),
        tip_box("How to use this plan: Open this PDF every day. Find where you are in the phase. Complete one task at a time. Don't skip ahead — each phase builds on the previous one.", TEAL_LIGHT, TEAL),
        Spacer(1, 0.5*cm),
        tip_box("Daily rule: Even 1-2 hours per day is enough. The key is consistency. Phase 1 alone makes you interview-ready for backend roles.", AMBER_LIGHT, AMBER),
    ]


# ── Full story ──────────────────────────────────────────────────────
def build_story():
    story = []
    story += cover_page()

    # ── Tech Stack ──────────────────────────────────────────────────
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Full Tech Stack", S['section_head']))
    story.append(hr())
    story.append(stack_table([
        ("Frontend",    "React.js  |  Tailwind CSS  |  React Router  |  Axios  |  React-PDF"),
        ("Backend",     "Python  |  FastAPI  |  LangChain  |  PyMuPDF  |  Pydantic  |  Uvicorn"),
        ("AI / NLP",    "OpenAI GPT-4o  |  text-embedding-3-small  |  LangChain RAG chains"),
        ("Vector DB",   "ChromaDB (local dev)  →  Pinecone (production, free tier)"),
        ("Database",    "PostgreSQL  |  SQLAlchemy ORM  |  Alembic migrations  |  Supabase (free host)"),
        ("Auth",        "JWT tokens  |  bcrypt password hashing  |  FastAPI OAuth2PasswordBearer"),
        ("File Storage","AWS S3  OR  Cloudinary (free tier)  —  stores uploaded PDFs"),
        ("Deployment",  "React → Vercel (free)  |  FastAPI → Railway/Render (free)  |  DB → Supabase"),
    ]))

    # ── RAG Pipeline ────────────────────────────────────────────────
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("RAG Pipeline — How Your AI Reads Documents", S['section_head']))
    story.append(hr())
    story.append(Paragraph("This is the brain of your project. Every document upload triggers this exact pipeline:", S['body']))
    rag_steps = [
        ["Step", "What Happens", "Code/Tool"],
        ["1", "User uploads PDF", "React file input → FastAPI endpoint → save to S3"],
        ["2", "Text extracted", "PyMuPDF reads each page → clean text string"],
        ["3", "Text chunked", "LangChain RecursiveTextSplitter → 500 token chunks, 50 overlap"],
        ["4", "Embeddings created", "OpenAI text-embedding-3-small → vector for each chunk"],
        ["5", "Stored in vector DB", "ChromaDB.add() or Pinecone.upsert() with doc_id metadata"],
        ["6", "User asks question", "React chat input → POST /chat/{doc_id}"],
        ["7", "Retrieval", "Embed question → similarity_search() → top 5 chunks returned"],
        ["8", "AI answers", "GPT-4o gets: system prompt + question + 5 chunks → streamed answer"],
    ]
    rag_t = Table(rag_steps, colWidths=[1.2*cm, 5.5*cm, W - 2*MARGIN - 6.7*cm])
    rag_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PURPLE),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, GRAY_LIGHT]),
        ('BOX', (0,0), (-1,-1), 0.5, PURPLE_MID),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TEXTCOLOR', (0,1), (0,-1), PURPLE),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ]))
    story.append(rag_t)

    # ── Database Schema ─────────────────────────────────────────────
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Database Schema — 6 Core Tables", S['section_head']))
    story.append(hr())
    story.append(db_schema_table())

    # ── Folder Structure ─────────────────────────────────────────────
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Project Folder Structure", S['section_head']))
    story.append(hr())
    fs_data = [
        ["your-project/", ""],
        ["  frontend/src/pages/", "Login.jsx  Register.jsx  Dashboard.jsx  Upload.jsx  Analysis.jsx  Chat.jsx  Landing.jsx"],
        ["  frontend/src/components/", "ClauseCard.jsx  RiskMeter.jsx  ChatBox.jsx  PDFViewer.jsx  Navbar.jsx"],
        ["  frontend/src/api/", "auth.js  documents.js  analysis.js  chat.js  (Axios API calls)"],
        ["  backend/app/routers/", "auth.py  documents.py  analysis.py  chat.py  export.py"],
        ["  backend/app/services/", "pdf_parser.py  rag_pipeline.py  clause_extractor.py  risk_scorer.py"],
        ["  backend/app/models/", "user.py  document.py  analysis.py  clause.py  chat.py"],
        ["  backend/", "main.py  database.py  config.py  requirements.txt"],
        ["  root/", ".env.example  README.md  docker-compose.yml"],
    ]
    fs_t = Table(fs_data, colWidths=[5.5*cm, W - 2*MARGIN - 5.5*cm])
    fs_t.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Courier-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Courier'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR', (0,0), (0,0), PURPLE),
        ('TEXTCOLOR', (0,1), (0,-1), colors.HexColor("#3C3489")),
        ('TEXTCOLOR', (1,0), (1,-1), GRAY),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [PURPLE_LIGHT, WHITE, GRAY_LIGHT, WHITE, GRAY_LIGHT, WHITE, GRAY_LIGHT, WHITE, GRAY_LIGHT]),
        ('BOX', (0,0), (-1,-1), 0.5, PURPLE_MID),
        ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(fs_t)

    # ── PHASE 1 ──────────────────────────────────────────────────────
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph("Phase-wise Implementation", S['section_head']))
    story.append(hr())

    for ph in phase_headers:
        story += ph['header']
        story.append(Spacer(1, 4))
        story.append(tasks_grid(ph['tasks'], ph['task_bg']))
        story.append(Spacer(1, 6))
        story.append(Paragraph("Checklist & Commands", ParagraphStyle('cl_head', fontSize=9, fontName='Helvetica-Bold', textColor=GRAY, spaceBefore=4, spaceAfter=4)))
        story += checklist_items(ph['checks'])
        story.append(Spacer(1, 4))
        story.append(tip_box("Deliverable: " + ph['deliverable'], ph['tip_bg'], ph['tip_tc']))
        story.append(Spacer(1, 12))

    # ── Install commands ─────────────────────────────────────────────
    story.append(Paragraph("All Install Commands (Copy-Paste Ready)", S['section_head']))
    story.append(hr())
    installs = [
        ("Phase 1 — Backend", "pip install fastapi uvicorn sqlalchemy alembic pydantic python-jose passlib bcrypt pymupdf boto3 python-multipart"),
        ("Phase 1 — Frontend", "npx create-react-app frontend  |  npm install axios react-router-dom tailwindcss"),
        ("Phase 2 — AI/RAG", "pip install langchain langchain-openai langchain-community chromadb openai tiktoken"),
        ("Phase 3 — Chat/PDF", "npm install react-pdf  |  pip install deep-translator"),
        ("Phase 4 — Export", "pip install fpdf2 reportlab  |  npm run build"),
    ]
    for label, cmd in installs:
        story.append(Paragraph(label, ParagraphStyle('il', fontSize=9, fontName='Helvetica-Bold', textColor=PURPLE, spaceAfter=2, spaceBefore=6)))
        story.append(Paragraph(cmd, ParagraphStyle('ic', fontSize=8.5, fontName='Courier', textColor=colors.HexColor("#3C3489"), backgroundColor=PURPLE_LIGHT, leftIndent=8, spaceAfter=2)))

    # ── API Endpoints ────────────────────────────────────────────────
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("All API Endpoints", S['section_head']))
    story.append(hr())
    endpoints = [
        ["Method", "Endpoint", "Description"],
        ["POST", "/auth/register", "Register new user, returns JWT"],
        ["POST", "/auth/login", "Login, returns JWT token"],
        ["GET", "/auth/me", "Get current logged-in user info"],
        ["POST", "/documents/upload", "Upload PDF file, extract text, save to DB"],
        ["GET", "/documents", "List all documents for logged-in user"],
        ["DELETE", "/documents/{id}", "Delete a document and its analysis"],
        ["POST", "/analyze/{doc_id}", "Run full AI analysis pipeline on document"],
        ["GET", "/analyze/{doc_id}", "Get saved analysis result"],
        ["POST", "/chat/{doc_id}", "Send question, get AI answer from document"],
        ["GET", "/chat/{doc_id}/history", "Get full chat history for a document"],
        ["GET", "/documents/{id}/export", "Download full analysis as PDF report"],
    ]
    ep_t = Table(endpoints, colWidths=[1.8*cm, 6*cm, W - 2*MARGIN - 7.8*cm])
    ep_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PURPLE),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, GRAY_LIGHT]),
        ('BOX', (0,0), (-1,-1), 0.5, PURPLE_MID),
        ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TEXTCOLOR', (0,1), (0,-1), colors.HexColor("#185FA5")),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,1), (1,-1), 'Courier'),
        ('FONTSIZE', (1,1), (1,-1), 8.5),
        ('TEXTCOLOR', (1,1), (1,-1), colors.HexColor("#3C3489")),
    ]))
    story.append(ep_t)

    # ── Weekly Timeline ───────────────────────────────────────────────
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("14-Week Timeline at a Glance", S['section_head']))
    story.append(hr())
    timeline = [
        ["Week", "Focus", "End Goal"],
        ["1", "Project setup, Git, folder structure, env config", "Running React app + FastAPI server locally"],
        ["2", "PostgreSQL setup, all 6 tables, SQLAlchemy models", "Database connected, Alembic migrations done"],
        ["3", "Auth — register, login, JWT, protected routes", "User can sign up, log in, see dashboard"],
        ["4", "PDF upload, S3 storage, PyMuPDF text extraction", "PDF uploaded, text extracted, saved to DB"],
        ["5", "Text chunking + OpenAI embeddings + ChromaDB", "Chunks stored in vector DB with embeddings"],
        ["6", "Document summary prompt + AI response", "Upload PDF → get 5-line plain English summary"],
        ["7", "Clause extraction + risk scoring prompts", "See all clauses with red/yellow/green risk level"],
        ["8", "Chat Q&A — RAG retrieval + streamed answers", "Ask questions, get answers with source page"],
        ["9", "Hindi language detection + multilingual response", "Ask in Hindi, get answer in Hindi"],
        ["10", "React PDF viewer + analysis result UI", "Beautiful results page with risk meter"],
        ["11", "Document history, chat history, full dashboard", "Complete user flow working end to end"],
        ["12", "PDF report export, landing page", "Download analysis as PDF, public homepage ready"],
        ["13", "Deploy — Vercel + Railway + Supabase + Pinecone", "Live URL working for everyone"],
        ["14", "Testing with real Indian docs, demo video, README", "Project complete, ready to present"],
    ]
    tl_t = Table(timeline, colWidths=[1.3*cm, 8*cm, W - 2*MARGIN - 9.3*cm])
    tl_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PURPLE),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,4), [WHITE, GRAY_LIGHT]),
        ('BACKGROUND', (0,1), (-1,3), PURPLE_LIGHT),
        ('BACKGROUND', (0,4), (-1,7), TEAL_LIGHT),
        ('BACKGROUND', (0,8), (-1,11), AMBER_LIGHT),
        ('BACKGROUND', (0,12), (-1,-1), BLUE_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, PURPLE_MID),
        ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TEXTCOLOR', (0,1), (0,3), PURPLE),
        ('TEXTCOLOR', (0,4), (0,7), TEAL),
        ('TEXTCOLOR', (0,8), (0,11), AMBER),
        ('TEXTCOLOR', (0,12), (0,-1), BLUE),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ]))
    story.append(tl_t)

    # ── Final tips ──────────────────────────────────────────────────
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph("Important Tips to Stay on Track", S['section_head']))
    story.append(hr())
    tips = [
        ("Don't skip Phase 1", "A solid foundation saves 3x time later. Take a full week on setup even if it feels boring."),
        ("Use free tiers everywhere", "Supabase (DB), Vercel (frontend), Railway (backend), Pinecone (vector DB), OpenAI ($5 free credit) — total cost = Rs 0."),
        ("Test with real Indian docs", "Download a Delhi rent agreement, a standard IT offer letter, and a startup NDA from the internet. Use these as your test documents."),
        ("Commit to GitHub daily", "Even one small commit per day keeps the project alive and shows activity to recruiters."),
        ("Build the demo video in Week 14", "A 5-minute screen recording showing the full flow (upload → analysis → chat in Hindi → export PDF) is more powerful than 10 pages of report."),
        ("The name doesn't matter right now", "Pick any working name to start. Rename it when you deploy. Focus on building first."),
    ]
    tips_t = Table(
        [[Paragraph(t, ParagraphStyle('tt', fontSize=9.5, fontName='Helvetica-Bold', textColor=DARK)),
          Paragraph(d, ParagraphStyle('td', fontSize=9.5, fontName='Helvetica', textColor=GRAY, leading=14))]
         for t, d in tips],
        colWidths=[4.5*cm, W - 2*MARGIN - 4.5*cm]
    )
    tips_t.setStyle(TableStyle([
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [PURPLE_LIGHT, WHITE]),
        ('BOX', (0,0), (-1,-1), 0.5, PURPLE_MID),
        ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor("#D3D1C7")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tips_t)

    story.append(Spacer(1, 0.5*cm))
    story.append(tip_box(
        "You have everything you need. The plan is in your hands. Now open your laptop, create a folder called 'my-project', and start Phase 1 — Day 1. Good luck!",
        PURPLE_LIGHT, PURPLE
    ))

    return story


# ── Phase data ──────────────────────────────────────────────────────
phase_headers = [
    {
        'header': phase_header(1, "Foundation + Auth + PDF Upload", "Setup project, database, login system, and file upload", "Weeks 1–3", PURPLE),
        'tasks': [
            ("Project setup", "Create React app + FastAPI project, folder structure, Git repo, .env file with all secrets"),
            ("Database setup", "PostgreSQL on Supabase, create all 6 tables with SQLAlchemy models, run Alembic migrations"),
            ("Auth system", "Register, login, JWT tokens, protected routes in React, bcrypt password hashing in FastAPI"),
            ("PDF upload", "React file upload UI, FastAPI multipart endpoint, store file in S3/Cloudinary, save metadata to DB"),
            ("User dashboard", "Show uploaded documents list, delete, view status — basic CRUD UI with Tailwind CSS"),
            ("PDF text extraction", "PyMuPDF reads uploaded PDF, extracts clean text page by page, stores in doc_chunks table"),
        ],
        'task_bg': PURPLE_LIGHT,
        'checks': [
            "pip install fastapi uvicorn sqlalchemy alembic pydantic python-jose passlib bcrypt pymupdf boto3 python-multipart",
            "npx create-react-app frontend  and  npm install axios react-router-dom tailwindcss",
            "React pages to build: /login  /register  /dashboard  /upload",
            "FastAPI endpoints: POST /auth/register  POST /auth/login  POST /documents/upload  GET /documents",
            "Environment variables needed: DATABASE_URL, JWT_SECRET, AWS_KEY, AWS_SECRET, S3_BUCKET",
        ],
        'deliverable': "User can sign up, log in, upload a PDF, and see it listed in their dashboard.",
        'tip_bg': TEAL_LIGHT,
        'tip_tc': TEAL,
    },
    {
        'header': phase_header(2, "RAG Pipeline + AI Analysis Engine", "Core AI — embeddings, vector DB, clause extraction, risk scoring", "Weeks 4–7", colors.HexColor("#0F6E56")),
        'tasks': [
            ("Text chunking", "LangChain RecursiveCharacterTextSplitter splits text into 500-token chunks with 50-token overlap"),
            ("Embeddings", "Send each chunk to OpenAI text-embedding-3-small, get 1536-dim vectors, store in ChromaDB"),
            ("Document summary", "Prompt GPT-4o with first 3000 tokens → return 5-line plain English summary of document type"),
            ("Clause extraction", "Structured prompt identifies: penalty, termination, NDA, payment, liability, IP ownership clauses"),
            ("Risk scoring", "GPT assigns risk level (low/medium/high) to each clause + overall risk score 1–10 for document"),
            ("Missing clauses", "Compare found clauses against a standard checklist — flag what is absent but should be present"),
        ],
        'task_bg': TEAL_LIGHT,
        'checks': [
            "pip install langchain langchain-openai langchain-community chromadb openai tiktoken",
            "Set OPENAI_API_KEY in .env file (create account at platform.openai.com — $5 free credit is enough)",
            "FastAPI endpoint: POST /analyze/{doc_id} — runs full pipeline, saves to analyses + clauses tables",
            "Build 3 separate LangChain prompt templates: summary.py  clause_extractor.py  risk_scorer.py",
            "Test with a real rent agreement PDF to verify clause extraction accuracy before moving to UI",
        ],
        'deliverable': "Upload any contract → get a summary + color-coded risk clauses + an overall risk score out of 10.",
        'tip_bg': TEAL_LIGHT,
        'tip_tc': TEAL,
    },
    {
        'header': phase_header(3, "Chat with Document + Hindi Support + Full UI", "Q&A chat, multi-language, polished frontend, PDF viewer side-by-side", "Weeks 8–11", colors.HexColor("#854F0B")),
        'tasks': [
            ("Chat interface", "React chat UI — user types question, AI answers streamed in real time, history saved in DB"),
            ("RAG Q&A engine", "Question → embed → retrieve top-5 chunks → feed GPT-4o → stream answer back with source page"),
            ("Hindi language", "Detect question language using langdetect, add language instruction to prompt, respond in Hindi"),
            ("PDF viewer", "Embed react-pdf to show original document alongside analysis, highlight flagged clause pages"),
            ("Analysis result UI", "Risk meter component (0–10), clause cards with color (green/yellow/red), summary box, missing list"),
            ("Document history", "Dashboard shows all past documents with risk scores, quick re-open, full document management"),
        ],
        'task_bg': AMBER_LIGHT,
        'checks': [
            "npm install react-pdf  and  pip install langdetect deep-translator",
            "FastAPI endpoint: POST /chat/{doc_id} with body {question, language} — returns streamed answer + source chunks",
            "Save every chat message to chat_messages table (role: 'user' or 'assistant') — history persists per document",
            "React pages to build: /document/:id/analysis  /document/:id/chat — two side-by-side view modes",
            "Test Hindi queries: type 'yeh contract mein penalty kya hai?' — should respond in Hindi from document",
        ],
        'deliverable': "Full working product — upload, analyze, read clauses, ask questions in Hindi or English, see results beautifully.",
        'tip_bg': AMBER_LIGHT,
        'tip_tc': AMBER,
    },
    {
        'header': phase_header(4, "PDF Export + Landing Page + Deployment", "Report download, public homepage, live deployment, final polish", "Weeks 12–14", colors.HexColor("#185FA5")),
        'tasks': [
            ("PDF report export", "Generate downloadable analysis report with summary, all clauses, risk score using fpdf2 library"),
            ("Landing page", "Public homepage — hero section, 'how it works' steps, sample demo screenshot, CTA to sign up"),
            ("Document types page", "Label supported formats: rent agreement, job offer letter, NDA, loan document, vendor contract"),
            ("Deploy frontend", "Run npm run build → deploy to Vercel (free). Add environment variables in Vercel dashboard."),
            ("Deploy backend", "FastAPI → Railway or Render (free tier). PostgreSQL → Supabase. Pinecone free tier for vectors."),
            ("Testing + demo prep", "Upload 5 real Indian documents, test full flow, record 5-minute demo video for submission"),
        ],
        'task_bg': BLUE_LIGHT,
        'checks': [
            "pip install fpdf2  for PDF report generation",
            "FastAPI endpoint: GET /documents/{id}/export — returns downloadable PDF analysis report file",
            "Free hosting stack: Vercel (React) + Railway (FastAPI) + Supabase (PostgreSQL) + Pinecone (vectors)",
            "Test documents to use: Delhi rent agreement, IT company offer letter, startup NDA, loan agreement",
            "Final GitHub repo should have: README with live URL, setup instructions, screenshots, and demo video link",
        ],
        'deliverable': "Live public URL, GitHub repo with documentation, 5-min demo video, and project report ready to submit.",
        'tip_bg': BLUE_LIGHT,
        'tip_tc': BLUE,
    },
]


# ── Build PDF ────────────────────────────────────────────────────────
def build():
    path = "/mnt/user-data/outputs/AI_Legal_Analyzer_Build_Plan.pdf"
    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=1.5*cm, bottomMargin=1.5*cm,
        title="AI Legal Document Analyzer — Complete Build Plan",
        author="MCA Project Guide",
        subject="Full Stack Project Implementation Plan"
    )

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(GRAY)
        canvas.drawString(MARGIN, 0.8*cm, "AI Legal Document Analyzer — MCA Project Build Plan")
        canvas.drawRightString(W - MARGIN, 0.8*cm, f"Page {doc.page}")
        canvas.restoreState()

    story = build_story()
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(f"PDF saved: {path}")

build()