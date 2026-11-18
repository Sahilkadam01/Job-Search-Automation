
from pypdf import PdfReader
from io import BytesIO


def extract_resume_text(file_bytes: bytes) -> str:
    """
    Extract readable text from an uploaded PDF resume.
    """

    if not file_bytes:
        raise ValueError("Uploaded PDF is empty.")

    try:
        pdf_file = BytesIO(file_bytes)
        reader = PdfReader(pdf_file, strict=False)

        if reader.is_encrypted:
            raise ValueError(
                "Password-protected PDFs are not supported."
            )

        extracted_pages = []

        for page_number, page in enumerate(reader.pages, start=1):
            try:
                page_text = page.extract_text()

                if page_text:
                    extracted_pages.append(page_text)

            except Exception as error:
                print(
                    f"Could not extract page {page_number}: {error}"
                )

        text = "\n".join(extracted_pages)

        cleaned_text = clean_resume_text(text)

        if not cleaned_text:
            raise ValueError(
                "No readable text found. The PDF may contain scanned images."
            )

        return cleaned_text

    except Exception as error:
        raise ValueError(
            f"Unable to read PDF: {str(error)}"
        ) from error


def clean_resume_text(text: str) -> str:
    """
    Clean extracted resume text.
    """

    if not text:
        return ""

    lines = text.splitlines()

    cleaned_lines = [
        line.strip()
        for line in lines
        if line.strip()
    ]

    return "\n".join(cleaned_lines).strip()
