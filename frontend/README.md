# AI Job Hunter — Frontend

Premium dark React dashboard wired to the existing FastAPI backend.

## Run locally

1. Open a terminal in the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` if you want to configure the API URL. The default is `http://127.0.0.1:8000`.
4. Start Vite:
   ```bash
   npm run dev
   ```
5. Ensure FastAPI is running in the backend folder:
   ```bash
   uvicorn app.main:app --reload
   ```

Frontend: `http://localhost:5173`  
Backend Swagger: `http://127.0.0.1:8000/docs`

## Included pages

- Overview: real `/jobs`, `/applications`, `/health` data
- Find jobs: fetch/filter listings, open original links, call `POST /jobs/auto-save`
- Resume studio: upload PDF to `POST /resume/upload`, inspect response/profile, call resume customize/generate endpoints
- Applications: create/list/update/delete using `/applications` endpoints

## Important API notes

This frontend uses the endpoint paths discussed in the project. The exact request/response schema of some endpoints may differ from the current backend implementation. If an endpoint returns a validation error (422), open `/docs`, compare the expected schema, then adjust the request payload in `src/pages/Applications.jsx` or `src/pages/Resume.jsx`. The UI surfaces backend errors rather than faking success.

The `/jobs/auto-save` request currently sends `{ "job": <job object> }`. If your endpoint expects a different payload, adjust `saveJob` in `src/pages/Jobs.jsx`.

Gemini-dependent features can return quota errors until the Google AI quota resets. The UI will show the actual error and remain usable for the non-AI features.

## API URL

Create a `frontend/.env` file:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```
Restart Vite after changing environment variables.

If frontend and backend are hosted on different origins, configure CORS in FastAPI for your frontend URL.
