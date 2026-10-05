from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler

from app.services.job_automation import automatic_job_search


scheduler = BackgroundScheduler()


def run_automatic_job_search():

    print("====================================")
    print("AUTOMATIC JOB SEARCH STARTED")
    print("====================================")

    try:

        result = automatic_job_search(
            search="",
            limit=3,
            minimum_score=70
        )

        print("====================================")
        print("AUTOMATIC JOB SEARCH FINISHED")
        print("====================================")

        print(
            f"Jobs saved: {result.get('saved_count', 0)}"
        )

        print(
            f"Jobs skipped: {result.get('skipped_count', 0)}"
        )

    except Exception as e:

        print("====================================")
        print("AUTOMATIC JOB SEARCH FAILED")
        print("====================================")

        print(
            f"Error: {str(e)}"
        )


def start_scheduler():

    if scheduler.running:
        return

    # Run the first search 5 seconds after startup
    first_run = datetime.now() + timedelta(seconds=5)

    scheduler.add_job(
        run_automatic_job_search,
        trigger="date",
        run_date=first_run,
        id="initial_job_search",
        replace_existing=True
    )

    # Run automatically every 6 hours
    scheduler.add_job(
        run_automatic_job_search,
        trigger="interval",
        hours=6,
        id="automatic_job_search",
        replace_existing=True
    )

    scheduler.start()

    print("====================================")
    print("Job Hunter Scheduler Started")
    print("First job search will run in 5 seconds")
    print("Then it will run every 6 hours")
    print("====================================")


def stop_scheduler():

    if scheduler.running:

        scheduler.shutdown()

        print("Job Hunter Scheduler Stopped")