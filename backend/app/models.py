from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    mobile_number: Mapped[str] = mapped_column(String, nullable=False, unique=True, index=True)

    waste_logs: Mapped[list["WasteLog"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class WasteLog(Base):
    __tablename__ = "waste_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    user: Mapped[User] = relationship(back_populates="waste_logs")
    items: Mapped[list["WasteItem"]] = relationship(
        back_populates="log",
        cascade="all, delete-orphan",
    )


class WasteItem(Base):
    __tablename__ = "waste_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    log_id: Mapped[int] = mapped_column(ForeignKey("waste_logs.id"), nullable=False)
    waste_type: Mapped[str] = mapped_column(String, nullable=False)
    quantity_kg: Mapped[float] = mapped_column(Float, nullable=False)

    log: Mapped[WasteLog] = relationship(back_populates="items")
