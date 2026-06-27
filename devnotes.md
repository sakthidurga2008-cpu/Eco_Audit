# EcoAudit Developer Notes

## Purpose

EcoAudit follows the low-level design in `EcoAudit_LLD_SQLite_Dockerized.md`. It provides a waste logging form, browser geolocation capture, REST APIs, SQLite persistence, and a statistics dashboard.

## Frontend

Location: `frontend/`

Main technologies:

- React with Vite
- React Router for page routing
- React Hook Form for waste entry validation
- Axios for backend API calls
- Recharts for dashboard charts
- Tailwind CSS for styling

Key files:

- `src/App.jsx` defines routes and layout.
- `src/pages/Landing.jsx` renders the landing page.
- `src/pages/WasteLogger.jsx` renders the waste entry form and captures browser geolocation.
- `src/pages/Dashboard.jsx` renders statistics cards, tables, and charts.
- `src/services/api.js` centralizes API calls.

### Browser Geolocation

Geolocation is handled only in the frontend because the browser owns user permission prompts. `WasteLogger.jsx` calls `navigator.geolocation.getCurrentPosition`. On success, latitude and longitude are stored in component state. On submit, those coordinates are included in the request body sent to `POST /logs`.

Submission is blocked if location is not captured.

Expected request body:

```json
{
  "name": "Example User",
  "mobile_number": "9876543210",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "items": [
    {
      "waste_type": "Plastic",
      "quantity_kg": 2.5
    }
  ]
}
```

## Backend

Location: `backend/`

Main technologies:

- FastAPI for REST API
- SQLAlchemy for ORM and SQLite persistence
- Pydantic for request and response validation
- Uvicorn for local serving

Key files:

- `app/main.py` creates the FastAPI app, CORS middleware, database tables, and routes.
- `app/database.py` configures SQLAlchemy engine and DB sessions.
- `app/models.py` defines `users`, `waste_logs`, and `waste_items` tables.
- `app/schemas.py` defines API validation and response models.
- `app/crud.py` contains database read/write logic.
- `app/routers/logs.py` exposes log endpoints.
- `app/routers/statistics.py` exposes statistics endpoints.

## Database Design

SQLite database file:

- Local run: `backend/ecoaudit.db`
- Docker run: `/data/ecoaudit.db` inside the backend container, persisted with the `ecoaudit-data` volume

Tables:

- `users`: stores name and unique mobile number.
- `waste_logs`: stores user reference, latitude, longitude, and timestamp.
- `waste_items`: stores one or more waste type/quantity rows for each log.

Relationships:

```text
users (1) -------- (N) waste_logs
waste_logs (1) --- (N) waste_items
```

## Validation Rules

Frontend validation:

- Name is required.
- Mobile number must be exactly 10 digits.
- At least one waste item exists by default.
- Quantity must be greater than `0`.
- Geolocation must be captured before submission.

Backend validation:

- Name must not be blank.
- Mobile number must match `^\d{10}$`.
- Latitude must be between `-90` and `90`.
- Longitude must be between `-180` and `180`.
- At least one waste item is required.
- Waste quantity must be greater than `0`.

## API Summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Backend health check |
| `POST` | `/logs` | Create waste log |
| `GET` | `/logs` | Read all logs |
| `GET` | `/logs/date/{date}` | Read logs for one date |
| `GET` | `/statistics` | Read overall statistics |
| `GET` | `/statistics/date/{date}` | Read statistics for one date |

## Development Notes

- No unit tests are included, per project instruction.
- The backend creates tables on startup using `Base.metadata.create_all`.
- CORS defaults allow `http://localhost:3000` and `http://localhost:5173`.
- The user table enforces unique mobile numbers. If a known mobile number submits another log, the existing user is reused and the name is updated.
- Docker Compose starts both services and persists SQLite data in a named volume.
