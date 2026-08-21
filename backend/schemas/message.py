from pydantic import BaseModel , Field
from datetime import datetime


class MessageDb(BaseModel):
    sender_id: int = Field(...)
    content: str = Field(...)
    time: datetime = Field(...)

class MessageResponse(MessageDb):
    sender_name: str = Field()
