# EcoAudit -- Community Waste Logger

EcoAudit records community waste disposal activity with user details, waste categories, quantities, and browser geolocation. The frontend is a React/Vite app and the backend is a FastAPI API backed by SQLite.

## Project Structure

```text
Eco_Audit/
├── frontend/
├── backend/
├── docker-compose.yml
├── devnotes.md
└── EcoAudit_LLD_SQLite_Dockerized.md
```

## Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

SQLite data is stored in the Docker volume `ecoaudit-data`.

## Run Backend Locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend creates `ecoaudit.db` automatically when it starts.

Useful endpoints:

- `POST /logs` creates a waste log.
- `GET /logs` returns all logs.
- `GET /logs/date/{date}` returns logs for a date in `YYYY-MM-DD` format.
- `GET /statistics` returns overall statistics.
- `GET /statistics/date/{date}` returns date-wise statistics.

## Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

To point the frontend to a different API URL, create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Geolocation Flow

The frontend captures geolocation using the browser `navigator.geolocation` API. The user must allow location permission before submitting the form. The frontend sends `latitude` and `longitude` to the backend in the `POST /logs` payload, and the backend stores those values in SQLite.

## Build Frontend

```bash
cd frontend
npm run build
npm run preview
```
