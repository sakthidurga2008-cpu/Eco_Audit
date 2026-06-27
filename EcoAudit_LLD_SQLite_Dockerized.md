# EcoAudit -- Community Waste Logger

## Low Level Design (LLD)

## 1. Project Overview

EcoAudit is a web application that records community waste disposal
activities. Users submit their **name**, **unique mobile number**, **one
or more waste categories with quantities**, and their **browser
geolocation**. The backend stores the information in a SQLite database
and exposes REST APIs using FastAPI. The dashboard provides date-wise
and overall waste statistics.

------------------------------------------------------------------------

## 2. Technology Stack

### Frontend

-   React.js
-   Vite
-   Tailwind CSS
-   React Hook Form
-   Axios
-   React Router
-   Recharts

### Backend

-   FastAPI
-   SQLAlchemy
-   Pydantic

### Database

-   SQLite (`ecoaudit.db`)

### Deployment

-   Dockerized Frontend
-   Dockerized Backend
-   Docker Compose

------------------------------------------------------------------------

## 3. Functional Modules

  Module            Description
  ----------------- ------------------------------------------------------
  Landing Page      Displays project overview and navigation.
  Waste Logger      Records user details, waste details and geolocation.
  Audit Dashboard   Displays tables, charts and aggregated statistics.
  REST API          Handles POST and GET requests.
  Database          Stores persistent data using SQLite.

------------------------------------------------------------------------

## 4. Frontend Design

### Landing Page

-   Application title
-   Project description
-   **Log Waste** button
-   **Statistics** button

### Waste Entry Form

-   Name *(Required)*
-   Mobile Number *(Required, Unique)*
-   Add Waste Details
    -   Waste Type (Dropdown)
    -   Quantity (Kg)
-   Add Another Waste Type
-   Browser Geolocation API
-   Submit Button

### Statistics Page

-   Display Full Statistics
-   Choose Date
-   Statistics Cards
-   Data Tables
-   Charts (Bar, Pie, Line)

------------------------------------------------------------------------

## 5. Backend Design

### Frameworks

-   FastAPI
-   SQLAlchemy
-   Pydantic
-   SQLite

### REST APIs

  Method   Endpoint                    Description
  -------- --------------------------- ------------------------------
  POST     `/logs`                     Create a waste log
  GET      `/logs`                     Retrieve all logs
  GET      `/logs/date/{date}`         Retrieve logs by date
  GET      `/statistics`               Overall statistics
  GET      `/statistics/date/{date}`   Statistics for selected date

------------------------------------------------------------------------

## 6. Database Design (SQLite)

**Database File:** `ecoaudit.db`

### users

  Column          Type      Constraints
  --------------- --------- ---------------------------
  id              INTEGER   PRIMARY KEY AUTOINCREMENT
  name            TEXT      NOT NULL
  mobile_number   TEXT      NOT NULL, UNIQUE

### waste_logs

  Column       Type      Constraints
  ------------ --------- ---------------------------
  id           INTEGER   PRIMARY KEY AUTOINCREMENT
  user_id      INTEGER   FOREIGN KEY → users.id
  latitude     REAL      NOT NULL
  longitude    REAL      NOT NULL
  created_at   TEXT      ISO Timestamp

### waste_items

  Column        Type      Constraints
  ------------- --------- -----------------------------
  id            INTEGER   PRIMARY KEY AUTOINCREMENT
  log_id        INTEGER   FOREIGN KEY → waste_logs.id
  waste_type    TEXT      NOT NULL
  quantity_kg   REAL      \> 0

### Relationships

``` text
users (1) -------- (N) waste_logs
waste_logs (1) --- (N) waste_items
```

------------------------------------------------------------------------

## 7. Validation Rules

-   Name is mandatory.
-   Mobile number is mandatory.
-   Mobile number must be unique.
-   Mobile number must contain exactly 10 digits.
-   At least one waste item is required.
-   Waste type is mandatory.
-   Quantity must be greater than 0 kg.
-   Browser geolocation permission is required before submission.

------------------------------------------------------------------------

## 8. Sequence Flow

``` text
User
  ↓
Landing Page
  ↓
Waste Entry Form
  ↓
Enter Name & Mobile Number
  ↓
Add Waste Details
  ↓
Capture Browser Geolocation
  ↓
Submit
  ↓
POST /logs
  ↓
FastAPI Validation
  ↓
SQLite Database
  ↓
GET Statistics
  ↓
Dashboard Tables & Charts
```

------------------------------------------------------------------------

## 9. Suggested Folder Structure

``` text
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   └── main.py
│   ├── ecoaudit.db
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

------------------------------------------------------------------------

## 10. Dockerization

### Frontend Container

-   Builds the React application.
-   Serves the frontend on port **3000**.

### Backend Container

-   Runs FastAPI using Uvicorn.
-   Uses SQLite with a mounted volume.
-   Serves the API on port **8000**.

### Docker Compose

-   Starts frontend and backend together.
-   Creates an isolated Docker network.
-   Simplifies local development with one command.
