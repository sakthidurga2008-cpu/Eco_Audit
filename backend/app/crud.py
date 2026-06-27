from datetime import date, datetime, time, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app import models, schemas


def get_or_create_user(db: Session, name: str, mobile_number: str) -> models.User:
    user = db.scalar(select(models.User).where(models.User.mobile_number == mobile_number))
    if user:
        user.name = name
        return user

    user = models.User(name=name, mobile_number=mobile_number)
    db.add(user)
    db.flush()
    return user


def create_waste_log(db: Session, payload: schemas.WasteLogCreate) -> models.WasteLog:
    user = get_or_create_user(db, payload.name, payload.mobile_number)
    log = models.WasteLog(
        user_id=user.id,
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    db.add(log)
    db.flush()

    for item in payload.items:
        db.add(
            models.WasteItem(
                log_id=log.id,
                waste_type=item.waste_type,
                quantity_kg=item.quantity_kg,
            )
        )

    db.commit()
    db.refresh(log)
    return log


def get_logs(db: Session) -> list[models.WasteLog]:
    return list(
        db.scalars(
            select(models.WasteLog)
            .options(joinedload(models.WasteLog.user), joinedload(models.WasteLog.items))
            .order_by(models.WasteLog.created_at.desc())
        )
        .unique()
        .all()
    )


def get_logs_by_date(db: Session, selected_date: date) -> list[models.WasteLog]:
    start_at = datetime.combine(selected_date, time.min, tzinfo=timezone.utc)
    end_at = datetime.combine(selected_date, time.max, tzinfo=timezone.utc)
    return list(
        db.scalars(
            select(models.WasteLog)
            .options(joinedload(models.WasteLog.user), joinedload(models.WasteLog.items))
            .where(models.WasteLog.created_at.between(start_at, end_at))
            .order_by(models.WasteLog.created_at.desc())
        )
        .unique()
        .all()
    )


def get_statistics(db: Session, selected_date: date | None = None) -> schemas.StatisticsRead:
    log_query = select(models.WasteLog)
    item_join = select(models.WasteItem.waste_type, func.sum(models.WasteItem.quantity_kg))
    total_quantity_query = select(func.coalesce(func.sum(models.WasteItem.quantity_kg), 0.0))
    daily_query = select(
        func.date(models.WasteLog.created_at),
        func.coalesce(func.sum(models.WasteItem.quantity_kg), 0.0),
        func.count(func.distinct(models.WasteLog.id)),
    )

    if selected_date:
        start_at = datetime.combine(selected_date, time.min, tzinfo=timezone.utc)
        end_at = datetime.combine(selected_date, time.max, tzinfo=timezone.utc)
        log_query = log_query.where(models.WasteLog.created_at.between(start_at, end_at))
        item_join = item_join.join(models.WasteLog).where(models.WasteLog.created_at.between(start_at, end_at))
        total_quantity_query = total_quantity_query.join(models.WasteLog).where(
            models.WasteLog.created_at.between(start_at, end_at)
        )
        daily_query = daily_query.join(models.WasteItem).where(
            models.WasteLog.created_at.between(start_at, end_at)
        )
    else:
        item_join = item_join.join(models.WasteLog)
        total_quantity_query = total_quantity_query.join(models.WasteLog)
        daily_query = daily_query.join(models.WasteItem)

    total_logs = db.scalar(select(func.count()).select_from(log_query.subquery())) or 0
    total_users = db.scalar(select(func.count(models.User.id))) or 0
    total_quantity = float(db.scalar(total_quantity_query) or 0.0)

    waste_rows = db.execute(item_join.group_by(models.WasteItem.waste_type)).all()
    daily_rows = db.execute(
        daily_query.group_by(func.date(models.WasteLog.created_at)).order_by(func.date(models.WasteLog.created_at))
    ).all()

    return schemas.StatisticsRead(
        total_logs=total_logs,
        total_users=total_users,
        total_quantity_kg=total_quantity,
        waste_type_totals=[
            schemas.WasteTypeStatistic(waste_type=row[0], total_quantity_kg=float(row[1] or 0.0))
            for row in waste_rows
        ],
        daily_totals=[
            schemas.DailyStatistic(date=str(row[0]), total_quantity_kg=float(row[1] or 0.0), log_count=row[2])
            for row in daily_rows
        ],
    )
