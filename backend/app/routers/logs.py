from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/logs", tags=["logs"])


@router.post("", response_model=schemas.WasteLogRead, status_code=201)
def create_log(payload: schemas.WasteLogCreate, db: Session = Depends(get_db)):
    return crud.create_waste_log(db, payload)


@router.get("", response_model=list[schemas.WasteLogRead])
def read_logs(db: Session = Depends(get_db)):
    return crud.get_logs(db)


@router.get("/date/{selected_date}", response_model=list[schemas.WasteLogRead])
def read_logs_by_date(selected_date: date, db: Session = Depends(get_db)):
    return crud.get_logs_by_date(db, selected_date)
