
import requests


JOB_API_URL = "https://www.arbeitnow.com/api/job-board-api"


def fetch_jobs(search: str = "", limit: int = 20) -> list:
    """
    Fetch jobs from Arbeitnow API and optionally filter by keyword.
    """

    try:
        response = requests.get(
            JOB_API_URL,
            timeout=30,
            headers={
                "Accept": "application/json",
                "User-Agent": "AI-Job-Hunter/1.0"
            }
        )

        response.raise_for_status()

        data = response.json()

        if not isinstance(data, dict):
            raise ValueError("Unexpected API response format.")

        jobs = data.get("data", [])

        if not isinstance(jobs, list):
            raise ValueError("Jobs data is not a valid list.")

        # Filter jobs by keyword
        if search:
            search_lower = search.strip().lower()

            filtered_jobs = []

            for job in jobs:
                if not isinstance(job, dict):
                    continue

                title = job.get("title") or ""
                description = job.get("description") or ""
                tags = job.get("tags") or []

                if not isinstance(tags, list):
                    tags = []

                combined_text = (
                    f"{title} "
                    f"{description} "
                    f"{' '.join(str(tag) for tag in tags)}"
                ).lower()

                if search_lower in combined_text:
                    filtered_jobs.append(job)

            jobs = filtered_jobs

        return jobs[:max(0, limit)]

    except requests.Timeout:
        raise Exception("Job API request timed out.")

    except requests.RequestException as exc:
        raise Exception(f"Failed to fetch jobs: {exc}") from exc

    except ValueError as exc:
        raise Exception(f"Invalid job API response: {exc}") from exc
