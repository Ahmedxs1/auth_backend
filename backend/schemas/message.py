from pydantic import BaseModel , Field
from datetime import datetime


class MessageSchema(BaseModel):
    sender_id: int = Field(...)
    content: str = Field(...)
    time: datetime = Field(...)
