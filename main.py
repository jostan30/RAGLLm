from fastapi import FastAPI, UploadFile, File, Form
from utils.pdf_loader import extract_text_from_pdf
from utils.chunker import chunk_text
from utils.embedder import generate_embeddings
from utils.llm_mistral import query_mistral
from utils.vector_db import store_embeddings, query_similar_chunks
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import uuid

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    pdf_text = extract_text_from_pdf(await file.read())
    chunks = chunk_text(pdf_text)
    embeddings = generate_embeddings(chunks)
    file_id = str(uuid.uuid4())
    store_embeddings(file_id, chunks, embeddings)
    return {"file_id": file_id, "message": "PDF processed and stored"}


@app.post("/ask/")
async def ask(file_id: str = Form(...), query: str = Form(...)):
    query_embedding = generate_embeddings([query])[0]
    top_chunks = query_similar_chunks(file_id, query_embedding)
    context = "\n".join(top_chunks)
    prompt = f"Use the following context to answer the question:\n\n{context}\n\nQuestion: {query}"
    response = query_mistral(prompt)
    return {"response": response}


def clear_all_chroma_data(persist_directory="db"):
    if os.path.exists(persist_directory):
        shutil.rmtree(persist_directory)

@app.post("/reset_all_db/")
async def reset_all_db():
    clear_all_chroma_data()
    return {"message": "All ChromaDB data cleared"}
