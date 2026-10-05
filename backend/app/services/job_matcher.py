import json

from google import genai

from app.config import GEMINI_API_KEY


client = genai.Client(
    api_key=GEMINI_API_KEY
)


def match_jobs_to_resume(
    resume_profile: dict,
    jobs: list
) -> list:

    if not jobs:
        return []

    simplified_jobs = []

    for index, job in enumerate(jobs):

        simplified_jobs.append({
            "job_id": index,
            "title": job.get("title", ""),
            "company": job.get("company_name", ""),
            "location": job.get("location", ""),
            "description": job.get("description", ""),
            "remote": job.get("remote", False)
        })

    prompt = f"""
You are an expert technical recruiter.

Match the candidate against ALL job postings below.

CANDIDATE PROFILE:

{json.dumps(resume_profile, indent=2)}


JOB POSTINGS:

{json.dumps(simplified_jobs, indent=2)}


Return ONLY valid JSON.

Return exactly this structure:

[
    {{
        "job_id": 0,
        "match_score": 0,
        "matching_skills": [],
        "missing_skills": [],
        "experience_match": "",
        "role_match": "",
        "summary": ""
    }}
]


Rules:

1. Return one result for every job.
2. job_id must match the supplied job_id.
3. match_score must be between 0 and 100.
4. Use only information from the candidate profile.
5. Never invent candidate experience.
6. Identify relevant matching skills.
7. Identify important missing skills.
8. Evaluate experience compatibility.
9. Evaluate role compatibility.
10. Keep summaries concise.
11. Return ONLY JSON.
12. Do not use markdown.
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


# Keep this function for compatibility
# with the existing endpoints.


def match_resume_to_job(
    resume_profile: dict,
    job: dict
) -> dict:

    results = match_jobs_to_resume(
        resume_profile,
        [job]
    )

    if not results:
        return {
            "match_score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "experience_match": "",
            "role_match": "",
            "summary": ""
        }

    return results[0]