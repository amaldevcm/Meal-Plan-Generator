import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String, UUID
from sqlalchemy.dialects.postgresql import ARRAY
from DB import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone_number = Column(String)
    password = Column(String, nullable=False)
    created_date = Column(DateTime)
    updated_date = Column(DateTime)

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    dietary_lifestyle = Column(String)
    allergies = Column(ARRAY(String))
    health_conditions = Column(ARRAY(String))
    nutritional_goals = Column(ARRAY(String))
    cuisine_preferences = Column(ARRAY(String))
    cooking_skill_level = Column(String)
    created_date = Column(DateTime)
    updated_date = Column(DateTime)


class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    refresh_token = Column(String, unique=True)
    ttl = Column(DateTime)
    created_date = Column(DateTime)
    updated_date = Column(DateTime)