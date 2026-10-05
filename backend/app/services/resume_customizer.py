import json

from google import genai

from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def customize_resume(
    resume_profile: dict,
    job: dict
) -> dict:

    prompt = f"""
You are an expert ATS resume writer.

Create a customized resume version for the candidate based on
the target job posting.

IMPORTANT RULES:

1. Use ONLY information present in the candidate profile.
2. NEVER invent companies, job titles, skills, projects,
   education, certifications, or achievements.
3. Do not add technologies that the candidate does not have.
4. Do not change employment dates.
5. Do not change the candidate's actual experience.
6. Prioritize relevant existing skills and experience.
7. Use professional ATS-friendly language.
8. Keep the content concise.
9. Optimize keywords based on the job description only when
   those keywords are supported by the candidate's actual profile.
10. Return ONLY valid JSON.
11. Do not use markdown.

CANDIDATE PROFILE:

{json.dumps(resume_profile, indent=2)}


TARGET JOB:

{json.dumps(job, indent=2)}


Return exactly this JSON structure:

{{
    "professional_title": "",
    "summary": "",
    "skills": [],
    "work_experience": [],
    "projects": [],
    "ats_keywords": []
}}

Work experience must contain:

- company
- position
- duration
- responsibilities

Projects must contain:

- name
- technologies
- description

ATS keywords must contain only keywords that are supported
by the candidate's profile.
"""

    response = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    result = response.output_text.strip()

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
        raise ValueError(
            "Gemini returned invalid JSON."
        )