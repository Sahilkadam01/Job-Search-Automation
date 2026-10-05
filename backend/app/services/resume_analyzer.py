import json
from google import genai
from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_resume(resume_text: str) -> dict:

    prompt = f"""
You are an expert resume analyzer.

Analyze the following resume and extract the candidate's information.

RESUME:
{resume_text}

Return ONLY valid JSON using exactly this structure:

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

1. Extract only information that actually exists in the resume.
2. Never invent information.
3. If a field is missing, return an empty string, empty array, or 0.
4. Keep work experience as structured objects containing:
   - company
   - position
   - duration
   - responsibilities

5. Keep projects as structured objects containing:
   - name
   - technologies
   - description

6. Keep education as structured objects containing:
   - degree
   - institution
   - year

7. Return ONLY JSON.
8. Do not use markdown.
9. Do not add explanations before or after the JSON.
"""

    response = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    result = response.output_text.strip()

    # Remove markdown code fences if Gemini returns them
    if result.startswith("```json"):
        result = result[7:]

    elif result.startswith("```"):
        result = result[3:]

    if result.endswith("```"):
        result = result[:-3]

    result = result.strip()

    try:
        return json.loads(result)

    except json.JSONDecodeError:
        raise ValueError("Gemini returned invalid JSON.")