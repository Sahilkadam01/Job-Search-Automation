from pypdf import PdfReader
from io import BytesIO


def extract_resume_text(file_bytes: bytes) -> str:
    """
    Extract text from a PDF resume.
    """

    try:
        pdf_file = BytesIO(file_bytes)
        reader = PdfReader(pdf_file)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return clean_resume_text(text)

    except Exception as error:
        raise ValueError(f"Unable to read PDF: {str(error)}")


def clean_resume_text(text: str) -> str:
    """
    Clean extracted resume text.
    """

    if not text:
        return ""

    # Remove excessive spaces
    lines = text.splitlines()

    cleaned_lines = []

    for line in lines:
        line = line.strip()

        if line:
            cleaned_lines.append(line)

    # Join lines while preserving readability
    cleaned_text = "\n".join(cleaned_lines)

    return cleaned_text.strip()