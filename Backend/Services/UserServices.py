import uuid
from DB import SessionLocal
import datetime
import re
from Schemas.Schema import User, UserPreferences

current_user = None
current_user_preferences = None

# User creation function
def create_user(user_data: dict):
    global current_user

    # Validate and process user_data
    email = user_data.get("email")
    first_name = user_data.get("first_name")
    last_name = user_data.get("last_name")
    password = user_data.get("password")

    if not email:
        raise ValueError("Email is required")
    
    if not first_name or not last_name:
        raise ValueError("First and last name are required")

    # Simple email format validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise ValueError("Invalid email format")
    
    # save user to postgres
    try:
        db = SessionLocal()
        createdDate = datetime.now()
        new_user = User(
            id = str(uuid.uuid4()),
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            created_date=createdDate,
            updated_date=createdDate,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise Exception(f"Error creating user: {str(e)}")
    finally:
        db.close()

    current_user = new_user
    return new_user


# User preferences creation function
def create_user_preferences(user_id: str, preferences_data: dict):
    global current_user_preferences
    try:
        db = SessionLocal()
        createdDate = datetime.now()
        new_preferences = UserPreferences(
            id=str(uuid.uuid4()),
            user_id=user_id,
            dietary_lifestyle=preferences_data.get("dietary_lifestyle", None),
            allergies=preferences_data.get("allergies", []),
            health_conditions=preferences_data.get("health_conditions", []),
            nutritional_goals=preferences_data.get("nutritional_goals", []),
            cuisine_preferences=preferences_data.get("cuisine_preferences", []),
            cooking_skill_level=preferences_data.get("cooking_skill_level", None),
            created_date=createdDate,
            updated_date=createdDate,
        )

        db.add(new_preferences)
        db.commit()
        db.refresh(new_preferences)
    except Exception as e:
        db.rollback()
        raise Exception(f"Error creating user preferences: {str(e)}")
    finally:
        db.close()
    current_user_preferences = new_preferences
    return current_user_preferences

# User login function
def login_user(email: str, password: str):
    global current_user
    try:
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        if user and user.password == password:
            current_user = user
            return user
        else:
            raise ValueError("Invalid email or password")
    except Exception as e:
        raise Exception(f"Error logging in: {str(e)}")
    finally:
        db.close()


# Get current user and preferences
def get_current_user():
    global current_user
    return current_user

def get_current_user_preferences():
    global current_user_preferences
    return current_user_preferences