from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class WasteItemCreate(BaseModel):
    waste_type: str = Field(..., min_length=1)
    quantity_kg: float = Field(..., gt=0)

    @field_validator("waste_type")
    @classmethod
    def trim_waste_type(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Waste type is required")
        return value


class WasteItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    waste_type: str
    quantity_kg: float


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    mobile_number: str


class WasteLogCreate(BaseModel):
    name: str = Field(..., min_length=1)
    mobile_number: str = Field(..., pattern=r"^\d{10}$")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    items: list[WasteItemCreate] = Field(..., min_length=1)

    @field_validator("name")
    @classmethod
    def trim_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name is required")
        return value


class WasteLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    latitude: float
    longitude: float
    created_at: datetime
    user: UserRead
    items: list[WasteItemRead]


class WasteTypeStatistic(BaseModel):
    waste_type: str
    total_quantity_kg: float


class DailyStatistic(BaseModel):
    date: str
    total_quantity_kg: float
    log_count: int


class StatisticsRead(BaseModel):
    total_logs: int
    total_users: int
    total_quantity_kg: float
    waste_type_totals: list[WasteTypeStatistic]
    daily_totals: list[DailyStatistic]
