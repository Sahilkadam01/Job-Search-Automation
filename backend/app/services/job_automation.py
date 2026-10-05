import json
import time

from app.services.job_fetcher import fetch_jobs
from app.services.job_matcher import match_jobs_to_resume
from app.database import SessionLocal
from app.models import Application


PROFILE_FILE = "candidate_profile.json"


def load_candidate_profile():

    print("Loading candidate_profile.json...")

    try:

        with open(
            PROFILE_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            profile = json.load(file)

            print("Candidate profile loaded successfully.")

            return profile

    except FileNotFoundError:

        print("ERROR: candidate_profile.json not found.")

        return None

    except json.JSONDecodeError:

        print("ERROR: candidate_profile.json contains invalid JSON.")

        return None


def automatic_job_search(
    search: str = "",
    limit: int = 3,
    minimum_score: int = 70
):

    start_time = time.time()

    print("------------------------------------")
    print("AUTOMATIC JOB SEARCH FUNCTION")
    print("------------------------------------")

    # --------------------------------
    # STEP 1
    # --------------------------------

    print("STEP 1: Loading candidate profile...")

    resume_profile = load_candidate_profile()

    print(
        f"Profile loaded in "
        f"{time.time() - start_time:.2f}s"
    )

    if not resume_profile:

        print("No candidate profile found.")

        return {
            "message": "No candidate profile found.",
            "saved_count": 0,
            "skipped_count": 0,
            "saved_jobs": [],
            "skipped_jobs": []
        }

    # --------------------------------
    # STEP 2
    # --------------------------------

    print("STEP 2: Fetching jobs...")

    fetch_start = time.time()

    try:

        jobs = fetch_jobs(
            search=search,
            limit=limit
        )

    except Exception as e:

        print(
            f"JOB FETCH ERROR: {str(e)}"
        )

        return {
            "message": "Failed to fetch jobs.",
            "error": str(e),
            "saved_count": 0,
            "skipped_count": 0,
            "saved_jobs": [],
            "skipped_jobs": []
        }

    print(
        f"Jobs fetched in "
        f"{time.time() - fetch_start:.2f}s"
    )

    print(
        f"Number of jobs found: {len(jobs)}"
    )

    if not jobs:

        print("No jobs returned by the job API.")

        return {
            "message": "No jobs found.",
            "saved_count": 0,
            "skipped_count": 0,
            "saved_jobs": [],
            "skipped_jobs": []
        }

    # --------------------------------
    # STEP 3
    # --------------------------------

    print("STEP 3: Sending jobs to Gemini...")

    ai_start = time.time()

    try:

        match_results = match_jobs_to_resume(
            resume_profile,
            jobs
        )

    except Exception as e:

        print(
            f"GEMINI ERROR: {str(e)}"
        )

        return {
            "message": "Gemini matching failed.",
            "error": str(e),
            "saved_count": 0,
            "skipped_count": 0,
            "saved_jobs": [],
            "skipped_jobs": []
        }

    print(
        f"Gemini finished in "
        f"{time.time() - ai_start:.2f}s"
    )

    print(
        f"Number of match results: "
        f"{len(match_results)}"
    )

    # --------------------------------
    # STEP 4
    # --------------------------------

    print("STEP 4: Saving matching jobs...")

    db = SessionLocal()

    saved_jobs = []
    skipped_jobs = []

    try:

        for result in match_results:

            job_id = result.get(
                "job_id",
                -1
            )

            if (
                not isinstance(job_id, int)
                or job_id < 0
                or job_id >= len(jobs)
            ):

                print(
                    f"Invalid job_id: {job_id}"
                )

                continue

            job = jobs[job_id]

            job_title = job.get(
                "title",
                ""
            )

            company = job.get(
                "company_name",
                ""
            )

            match_score = result.get(
                "match_score",
                0
            )

            print(
                f"{job_title} | "
                f"{company} | "
                f"Score: {match_score}"
            )

            existing_application = (
                db.query(Application)
                .filter(
                    Application.job_title == job_title,
                    Application.company == company
                )
                .first()
            )

            if existing_application:

                skipped_jobs.append({
                    "job_title": job_title,
                    "company": company,
                    "match_score": match_score,
                    "reason": "Already saved"
                })

                continue

            if match_score >= minimum_score:

                new_application = Application(
                    job_title=job_title,
                    company=company,
                    location=job.get(
                        "location",
                        ""
                    ),
                    job_url=job.get(
                        "url",
                        ""
                    ),
                    match_score=match_score,
                    status="Saved",
                    applied_date="",
                    notes=result.get(
                        "summary",
                        ""
                    )
                )

                db.add(new_application)

                saved_jobs.append({
                    "job_title": job_title,
                    "company": company,
                    "match_score": match_score
                })

            else:

                skipped_jobs.append({
                    "job_title": job_title,
                    "company": company,
                    "match_score": match_score,
                    "reason": "Below minimum score"
                })

        db.commit()

    finally:

        db.close()

    total_time = time.time() - start_time

    print("------------------------------------")
    print(
        f"TOTAL AUTOMATION TIME: "
        f"{total_time:.2f}s"
    )
    print("------------------------------------")

    return {
        "message": "Automatic job processing completed",
        "minimum_score": minimum_score,
        "saved_count": len(saved_jobs),
        "skipped_count": len(skipped_jobs),
        "saved_jobs": saved_jobs,
        "skipped_jobs": skipped_jobs
    }