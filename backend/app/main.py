from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from app.database import get_db
from app.models import Application
from app.schemas import ApplicationCreate, ApplicationUpdate

from app.services.resume_spliter import extract_resume_text
from app.services.resume_analyzer import analyze_resume
from app.services.job_fetcher import fetch_jobs
from app.services.job_matcher import match_resume_to_job
from app.services.resume_customizer import customize_resume
from app.services.resume_generator import generate_resume_docx

from app.database import Base, engine
from app import models
from contextlib import asynccontextmanager

from app.scheduler import (
    start_scheduler,
    stop_scheduler
)

Base.metadata.create_all(
    bind=engine
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    start_scheduler()

    yield

    stop_scheduler()

app = FastAPI(
    title="AI Job Hunter",
    description="AI-powered job hunting automation",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():

    return {
        "message": "AI Job Hunter API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/resume/upload")
async def upload_resume(
    file: UploadFile = File(...)
):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_content = await file.read()

    try:

        resume_text = extract_resume_text(
            file_content
        )

        profile = analyze_resume(
            resume_text
        )

        with open(
            "candidate_profile.json",
            "w",
            encoding="utf-8"
        ) as json_file:

            import json

            json.dump(
                profile,
                json_file,
                indent=4,
                ensure_ascii=False
            )

        return {
            "message": "Resume uploaded and analyzed successfully",
            "filename": file.filename,
            "profile": profile
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/jobs")
def get_jobs(
    search: str = "",
    limit: int = 20
):

    jobs = fetch_jobs(
        search=search,
        limit=limit
    )

    return {
        "count": len(jobs),
        "jobs": jobs
    }


@app.post("/jobs/match")
async def match_job(
    resume_profile: dict,
    job: dict
):

    match_result = match_resume_to_job(
        resume_profile,
        job
    )

    return {
        "match": match_result
    }


@app.post("/jobs/match-all")
async def match_all_jobs(
    resume_profile: dict,
    search: str = "",
    limit: int = 10
):

    jobs = fetch_jobs(
        search=search,
        limit=limit
    )

    results = []

    for job in jobs:

        try:

            match_result = match_resume_to_job(
                resume_profile,
                job
            )

            results.append({
                "job": {
                    "title": job.get(
                        "title",
                        ""
                    ),
                    "company": job.get(
                        "company_name",
                        ""
                    ),
                    "location": job.get(
                        "location",
                        ""
                    ),
                    "remote": job.get(
                        "remote",
                        False
                    ),
                    "url": job.get(
                        "url",
                        ""
                    )
                },
                "match": match_result
            })

        except Exception as e:

            results.append({
                "job": {
                    "title": job.get(
                        "title",
                        ""
                    ),
                    "company": job.get(
                        "company_name",
                        ""
                    )
                },
                "error": str(e)
            })

    results.sort(
        key=lambda item: item.get(
            "match",
            {}
        ).get(
            "match_score",
            0
        ),
        reverse=True
    )

    return {
        "count": len(results),
        "results": results
    }


@app.post("/resume/customize")
async def customize_resume_endpoint(
    resume_profile: dict,
    job: dict
):

    customized_resume = customize_resume(
        resume_profile,
        job
    )

    return {
        "customized_resume": customized_resume
    }


@app.post("/resume/generate")
async def generate_resume(
    resume_profile: dict,
    job: dict
):

    customized_resume = customize_resume(
        resume_profile,
        job
    )

    output_path = "customized_resume.docx"

    generate_resume_docx(
        resume_profile,
        customized_resume,
        output_path
    )

    return FileResponse(
        path=output_path,
        filename="Customized_Resume.docx",
        media_type=(
            "application/vnd.openxmlformats-officedocument"
            ".wordprocessingml.document"
        )
    )
@app.post("/applications")
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db)
):

    new_application = Application(
        job_title=application.job_title,
        company=application.company,
        location=application.location,
        job_url=application.job_url,
        match_score=application.match_score,
        status=application.status,
        applied_date=application.applied_date,
        notes=application.notes
    )

    db.add(new_application)

    db.commit()

    db.refresh(new_application)

    return {
        "message": "Application saved successfully",
        "application": {
            "id": new_application.id,
            "job_title": new_application.job_title,
            "company": new_application.company,
            "status": new_application.status,
            "match_score": new_application.match_score
        }
    }

@app.get("/applications")
def get_applications(
    db: Session = Depends(get_db)
):

    applications = (
        db.query(Application)
        .order_by(Application.id.desc())
        .all()
    )

    return {
        "count": len(applications),
        "applications": [
            {
                "id": item.id,
                "job_title": item.job_title,
                "company": item.company,
                "location": item.location,
                "job_url": item.job_url,
                "match_score": item.match_score,
                "status": item.status,
                "applied_date": item.applied_date,
                "notes": item.notes
            }
            for item in applications
        ]
    }

@app.put("/applications/{application_id}")
def update_application(
    application_id: int,
    application: ApplicationUpdate,
    db: Session = Depends(get_db)
):

    existing_application = (
        db.query(Application)
        .filter(
            Application.id == application_id
        )
        .first()
    )

    if not existing_application:

        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    if application.status is not None:

        existing_application.status = (
            application.status
        )

    if application.applied_date is not None:

        existing_application.applied_date = (
            application.applied_date
        )

    if application.notes is not None:

        existing_application.notes = (
            application.notes
        )

    db.commit()

    db.refresh(existing_application)

    return {
        "message": "Application updated successfully",
        "application": {
            "id": existing_application.id,
            "job_title": existing_application.job_title,
            "company": existing_application.company,
            "status": existing_application.status,
            "applied_date": existing_application.applied_date,
            "notes": existing_application.notes
        }
    }

@app.delete("/applications/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db)
):

    existing_application = (
        db.query(Application)
        .filter(
            Application.id == application_id
        )
        .first()
    )

    if not existing_application:

        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    db.delete(existing_application)

    db.commit()

    return {
        "message": "Application deleted successfully"
    }

@app.post("/jobs/auto-save")
async def auto_save_jobs(
    resume_profile: dict,
    search: str = "",
    limit: int = 10,
    minimum_score: int = 70,
    db: Session = Depends(get_db)
):

    jobs = fetch_jobs(
        search=search,
        limit=limit
    )

    saved_jobs = []
    skipped_jobs = []

    for job in jobs:

        try:

            match_result = match_resume_to_job(
                resume_profile,
                job
            )

            match_score = match_result.get(
                "match_score",
                0
            )

            job_title = job.get(
                "title",
                ""
            )

            company = job.get(
                "company_name",
                ""
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
                    notes=match_result.get(
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

        except Exception as e:

            skipped_jobs.append({
                "job_title": job.get(
                    "title",
                    ""
                ),
                "company": job.get(
                    "company_name",
                    ""
                ),
                "reason": str(e)
            })

    db.commit()

    return {
        "message": "Automatic job processing completed",
        "minimum_score": minimum_score,
        "saved_count": len(saved_jobs),
        "skipped_count": len(skipped_jobs),
        "saved_jobs": saved_jobs,
        "skipped_jobs": skipped_jobs
    }