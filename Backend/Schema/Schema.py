import os
import uuid
from sqlalchemy import Column, String, UUID
from Services.DB import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, index=True, unique=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    created_date = Column(String)
    updated_date = Column(String)
    password = Column(String)