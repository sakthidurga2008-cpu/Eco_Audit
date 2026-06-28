import logging
import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


logger = logging.getLogger(__name__)


def resolve_database_url() -> str:
    database_url = os.getenv("DATABASE_URL") or os.getenv("RENDER_DATABASE_URL")

    if not database_url:
        if os.getenv("RENDER") == "true":
            raise RuntimeError("DATABASE_URL must be set for Render deployments")

        return "sqlite:///./ecoaudit.db"

    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql+psycopg://", 1)

    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    return database_url


DATABASE_URL = resolve_database_url()
logger.info("Using database backend: %s", DATABASE_URL.split(":", 1)[0])

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=not DATABASE_URL.startswith("sqlite"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
