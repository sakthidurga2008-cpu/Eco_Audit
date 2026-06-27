from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/statistics", tags=["statistics"])


@router.get("", response_model=schemas.StatisticsRead)
def read_statistics(db: Session = Depends(get_db)):
    return crud.get_statistics(db)


@router.get("/date/{selected_date}", response_model=schemas.StatisticsRead)
def read_statistics_by_date(selected_date: date, db: Session = Depends(get_db)):
    return crud.get_statistics(db, selected_date)
