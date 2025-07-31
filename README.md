
# 📄 PDF Q&A Chatbot (FastAPI + Mistral + Next.js)

A lightweight AI system that lets you upload PDF files and ask questions about them in natural language using Mistral via OpenRouter API.


[Screencast from 2025-07-31 09-41-12.webm](https://github.com/user-attachments/assets/7fde12d1-dccb-4e45-94cd-32fbc3e5e2ec)

---

## 🔧 Tech Stack

- **Backend**: FastAPI, PyPDF2, SentenceTransformers, ChromaDB, OpenRouter (Mistral)
- **Frontend**: Next.js + Tailwind + Lucide Icons
- **LLM**: Mistral (via OpenRouter)
- **Embedding Model**: `all-MiniLM-L6-v2` (via SentenceTransformers)

---

## 🧠 Features

- 📤 Upload PDF
- ✂️ Extract and chunk text
- 🧠 Generate vector embeddings and store in ChromaDB
- 💬 Ask natural language questions
- 🤖 Answer generated using Mistral LLM with relevant chunks
- 🗑️ Clear/reset vector DB anytime

---

## 🚀 Backend (FastAPI)

### Install dependencies:

```bash
pip install fastapi uvicorn python-dotenv requests PyPDF2 \
            sentence-transformers chromadb
```

### Create `.env` file:

```
OPENROUTER_API_KEY=your_openrouter_key_here
```

### Run server:

```bash
uvicorn main:app --reload
```

### API Endpoints:

- `POST /upload_pdf/` → Upload and process PDF
- `POST /ask/` → Ask a question using Mistral
- `POST /reset_all_db/` → Reset vector store

---

## 💻 Frontend (Next.js UI)

### Create app:

```bash
npx create-next-app@latest pdf-chat-ui
cd pdf-chat-ui
npm install lucide-react
```

### Add `ChatBox.tsx` in `/components/`

Handles:
- PDF Upload
- API Calls
- Chat history UI
- Question box and reset logic


### Run frontend:

```bash
npm run dev
```

---

## 🔄 Reset Vector DB

Use the following endpoint to delete all stored embeddings:

```
POST /reset_all_db/
```

---

## 📌 Notes

- CORS middleware is enabled
- Embeddings are generated once per upload
- All conversations are stateless for now (no persistent memory)
- ChromaDB stores are automatically created and queried

---

## 🧪 Sample Flow

```bash
# 1. Upload a PDF
curl -X POST http://localhost:8000/upload_pdf/ \
  -F "file=@example.pdf"

# 2. Ask a question
curl -X POST http://localhost:8000/ask/ \
  -F "query=What is the summary of this file?"
```

---

## 🔮 Future Improvements

- 🔁 Add chat memory
- 👥 Multi-user support
- 🌍 Multi-language translation
- 📊 PDF analytics and metrics

