from database.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String , ForeignKey
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, index=True)

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )


class Message(Base):
    __tablename__ = "messages"

    message_id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    sender_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id"),
        nullable=False
    )

    content: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    time: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
        nullable=False
    )