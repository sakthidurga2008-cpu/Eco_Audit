import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import logs, statistics

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoAudit API", version="1.0.0")


def get_allowed_origins() -> list[str]:
    configured_origins = os.getenv("CORS_ALLOW_ORIGINS")
    if configured_origins:
        return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]

    return [
        "https://eco-audit.vercel.app",
        "https://eco-audit-git-main-sakthidurga2008-9558s-projects.vercel.app",
        "https://ecoaudit.sakthidurga.in",
        "http://localhost:3000",
        "http://localhost:5173",
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router)
app.include_router(statistics.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
