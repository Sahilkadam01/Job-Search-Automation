
import json
import re

from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY


GEMINI_MODEL = "gemini-3.5-flash"

# Increase Gemini API timeout to 180 seconds.
client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options=types.HttpOptions(
        timeout=180000
    )
)


def extract_json(text: str) -> dict:
    """Extract a JSON object from Gemini's response."""

    if not text:
        raise ValueError("Gemini returned an empty response.")

    text = text.strip()

    # Remove Markdown code fences.
    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(r"\s*```$", "", text)

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end < start:
        raise ValueError(
            "Gemini did not return a valid JSON object."
        )

    result = json.loads(text[start:end + 1])

    if not isinstance(result, dict):
        raise ValueError(
            "The resume profile must be a JSON object."
        )

    return result


def analyze_resume(resume_text: str) -> dict:

    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty.")

    # Prevent excessively large PDF text from creating
    # unnecessarily long Gemini requests.
    max_characters = 40000

    if len(resume_text) > max_characters:
        print(
            f"Resume text is large ({len(resume_text)} characters). "
            f"Limiting to {max_characters} characters."
        )

        resume_text = resume_text[:max_characters]

    prompt = f"""
Analyze the following resume and extract the candidate's information.

Return ONLY a valid JSON object.
Do not include Markdown or explanations.

Use this exact structure:

{{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "professional_title": "",
  "summary": "",
  "skills": [],
  "programming_languages": [],
  "frameworks": [],
  "databases": [],
  "tools": [],
  "years_of_experience": 0,
  "work_experience": [],
  "education": [],
  "projects": [],
  "certifications": []
}}

Rules:
- Do not invent missing information.
- Use empty strings, empty lists, or 0 for missing values.
- Keep skills as a list of strings.
- Keep work_experience, education, projects, and certifications as lists.
- Estimate years of experience conservatively.
- Preserve relevant job titles, technologies, and achievements.
- Return valid JSON only.

RESUME TEXT:

{resume_text}
"""

    try:
        print(
            f"Sending resume to Gemini ({GEMINI_MODEL})..."
        )

        response = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt
        )

        print("Gemini response received.")

        response_text = getattr(
            response,
            "output_text",
            None
        )

        if not response_text:
            raise ValueError(
                "Gemini returned an empty response."
            )

        profile = extract_json(response_text)

        defaults = {
            "name": "",
            "email": "",
            "phone": "",
            "location": "",
            "professional_title": "",
            "summary": "",
            "skills": [],
            "programming_languages": [],
            "frameworks": [],
            "databases": [],
            "tools": [],
            "years_of_experience": 0,
            "work_experience": [],
            "education": [],
            "projects": [],
            "certifications": [],
        }

        for key, default in defaults.items():
            profile.setdefault(key, default)

        print("Resume profile parsed successfully.")

        return profile

    except Exception as exc:
        error_name = type(exc).__name__
        error_message = str(exc)

        print(
            f"Gemini resume analysis error: "
            f"{error_name}: {error_message}"
        )

        if error_name == "RateLimitError":
            raise RuntimeError(
                "Gemini daily API quota exceeded. "
                "Please try again after the quota resets "
                "or configure another API key."
            ) from exc

        raise RuntimeError(
            f"Resume analysis failed: {error_name}: {error_message}"
        ) from exc