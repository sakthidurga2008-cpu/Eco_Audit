# EcoAudit -- Community Waste Logger

EcoAudit records community waste disposal activity with user details, waste categories, quantities, and browser geolocation. The frontend is a React app built with Vite, and the backend is a FastAPI API backed by SQLite.

## Live Deployment

- Live Website: `https://eco-audit-git-main-sakthidurga2008-9558s-projects.vercel.app/`
- Backend API: `https://eco-audit-hqm7.onrender.com/`
- API Docs: `https://eco-audit-hqm7.onrender.com/docs`

## Tech Stack

- Frontend: `React`, `Vite`, `JavaScript`, `Tailwind CSS`, `Axios`, `React Router`, `React Hook Form`, `Recharts`
- Backend: `FastAPI`, `Python`, `SQLAlchemy`, `Pydantic`, `SQLite`, `Uvicorn`
- Deployment: `Vercel` for the frontend and `Render` for the backend

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
docker compose up
```

To start in detached mode:

```bash
docker compose up -d
```

To view running containers:

```bash
docker compose ps
```

To view logs:

```bash
docker compose logs -f
```

To stop the compose services:

```bash
docker compose stop
```

To stop and remove the compose services:

```bash
docker compose down
```

To stop and remove the compose services, network, and database volume:

```bash
docker compose down -v
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

SQLite data is stored in the Docker volume `ecoaudit-data`.

## Build Backend Docker Image

```bash
cd backend
docker build -t eco-backend:1.0 .
docker run --rm -p 8000:8000 -v "$(pwd)/data:/app/data" eco-backend:1.0
```

To add both a specific version and `latest` tag in one build:

```bash
docker build -t eco-backend:1.0 -t eco-backend:latest .
```

Open:

- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Build Frontend Docker Image

```bash
cd frontend
docker build -t eco-ui:1.0 .
docker run --rm -p 3000:3000 eco-ui:1.0
```

To build with a production backend URL from `frontend/.env.production`, edit this file before the build:

```bash
VITE_API_BASE_URL=https://eco-audit-hqm7.onrender.com/
```

To override it directly during Docker build:

```bash
cd frontend
docker build \
	--build-arg VITE_API_BASE_URL=https://eco-audit-hqm7.onrender.com/ \
	-t eco-ui:1.0 .
```

To add both a specific version and `latest` tag in one build:

```bash
docker build -t eco-ui:1.0 -t eco-ui:latest .
```

Open:

- Frontend: `http://localhost:3000`

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

For production builds, use `frontend/.env.production`. Vite reads it automatically when `npm run build` runs.

## Docker Compose Build Config

The frontend API URL is a build-time setting, not a runtime container setting. In `docker-compose.yml`, the frontend now uses a Docker build arg:

```bash
VITE_API_BASE_URL=https://eco-audit-hqm7.onrender.com/ docker compose build frontend
docker compose up -d
```

Or place it in a root-level `.env` file used by Docker Compose:

```bash
VITE_API_BASE_URL=https://eco-audit-hqm7.onrender.com/
```

Then run:

```bash
docker compose build frontend
docker compose up -d
```

If you change the backend URL later, rebuild the frontend image so the new Vite value is embedded into the static files.

## Geolocation Flow

The frontend captures geolocation using the browser `navigator.geolocation` API. The user must allow location permission before submitting the form. The frontend sends `latitude` and `longitude` to the backend in the `POST /logs` payload, and the backend stores those values in SQLite.

## Build Frontend

```bash
cd frontend
npm run build
npm run preview
```
