import requests


JOB_API_URL = "https://www.arbeitnow.com/api/job-board-api"


def fetch_jobs(search: str = "", limit: int = 20) -> list:

    try:
        response = requests.get(
            JOB_API_URL,
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

        jobs = data.get("data", [])

        # Filter jobs by search keyword
        if search:
            search_lower = search.lower()

            filtered_jobs = []

            for job in jobs:

                title = job.get("title", "")
                description = job.get("description", "")
                tags = job.get("tags", [])

                combined_text = (
                    f"{title} "
                    f"{description} "
                    f"{' '.join(tags)}"
                ).lower()

                if search_lower in combined_text:
                    filtered_jobs.append(job)

            jobs = filtered_jobs

        return jobs[:limit]

    except requests.RequestException as e:
        raise Exception(f"Failed to fetch jobs: {str(e)}")