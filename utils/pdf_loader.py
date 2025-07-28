from PyPDF2 import PdfReader
from io import BytesIO

def extract_text_from_pdf(file_bytes):
    reader = PdfReader(BytesIO(file_bytes))
    return "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
