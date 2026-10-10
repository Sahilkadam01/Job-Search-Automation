# AI Job Hunter — Frontend

Responsive React dashboard for the existing FastAPI backend.

## Requirements
- Node.js 20 or newer
- Python backend running locally at `http://127.0.0.1:8000`

## Setup

Open a terminal in this `frontend` directory and run:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

If `Copy-Item` says the file already exists, that is fine. To use a different API address, edit `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart `npm run dev` after editing `.env`.

## Pages
- Dashboard: live backend status, jobs, application count and match score overview
- Find Jobs: fetch/filter jobs, request resume matching, save a role to the tracker, open the original listing
- My Resume: upload a PDF, retain the extracted profile in this browser, export/clear profile JSON
- Applications: list, add, update status, and delete tracker entries through the backend
- AI Resume: customize a resume for a selected job and download the generated DOCX
- Automation: manually call the existing `/jobs/auto-save` backend workflow
- Settings: save local display/workflow preferences and view the configured API URL

## Run the backend
From the backend folder:

```powershell
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` to inspect the backend API. AI actions depend on the backend provider quota and may return an error if the Gemini quota is exhausted. This frontend does not automatically submit applications to employers.
