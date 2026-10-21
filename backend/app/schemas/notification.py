from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NotificationCreate(BaseModel):
    user_id: int
    title: str = Field(min_length=1, max_length=255)
    message: str = Field(min_length=1)
    notification_type: str = Field(min_length=1, max_length=100)


class NotificationUpdate(BaseModel):
    is_read: bool


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime