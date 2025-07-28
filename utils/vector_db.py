import chromadb
from chromadb.config import Settings

client = chromadb.Client(Settings())
collection_map = {}

def store_embeddings(file_id, texts, embeddings):
    collection = client.get_or_create_collection(file_id)
    for i, (text, embedding) in enumerate(zip(texts, embeddings)):
        collection.add(documents=[text], embeddings=[embedding.tolist()], ids=[f"{file_id}-{i}"])
    collection_map[file_id] = collection

def query_similar_chunks(file_id, query_embedding, top_k=5):
    collection = collection_map[file_id]
    results = collection.query(
        query_embeddings=[query_embedding.tolist()],  
        n_results=top_k
    )
    return results["documents"][0]

