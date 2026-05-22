import os
import uuid
import re
import jwt
from datetime import datetime
from DB import SessionLocal
from dotenv import load_dotenv
from argon2 import PasswordHasher
from Schemas.Schema import Session, User, UserPreference, MealPlan
from Services.MealPlanServices import generateLLMResopnse
from Prompts.MealPlanPrompt import get_meal_plan_prompt

load_dotenv()

current_user = None
current_user_preferences = None
passwordHasher = PasswordHasher()
secret_key = os.getenv("JWT_SECRET_KEY")
algorithm = os.getenv("JWT_ALGORITHM")
access_token_expire_minutes = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES"))

# User creation function
def create_user(user_data: dict):
    global current_user

    # Validate and process user_data
    email = user_data.get("email")
    name = user_data.get("name")
    password = passwordHasher.hash(user_data.get("password"))
    # print("hashed password:", password)

    if not email:
        raise ValueError("Email is required")
    
    if not name:
        raise ValueError("Name is required")

    # Simple email format validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise ValueError("Invalid email format")
    
    # save user to postgres
    try:
        db = SessionLocal()
        createdDate = datetime.now()
        new_user = User(
            id = str(uuid.uuid4()),
            name=name,
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
def create_user_preferences(preferences_data: dict):
    global current_user_preferences
    try:
        db = SessionLocal()
        createdDate = datetime.now()
        new_preferences = UserPreference(
            id = str(uuid.uuid4()),
            user_id = current_user.get(id),
            dietary_lifestyle = preferences_data.get("dietary_lifestyle", None),
            allergies = preferences_data.get("allergies", []),
            health_conditions = preferences_data.get("health_conditions", []),
            nutritional_goals = preferences_data.get("nutritional_goals", []),
            cuisine_preferences = preferences_data.get("cuisine_preferences", []),
            cooking_skill_level = preferences_data.get("cooking_skill_level", None),
            created_date = createdDate,
            updated_date = createdDate,
        )
        
        db.add(new_preferences)
        db.commit()
        db.refresh(new_preferences)
    except Exception as e:
        db.rollback()
        raise Exception(f"Error creating user preferences: {str(e)}")
    finally:
        db.close()

    current_user_preferences = preferences_data
    return create_meal_plan(preferences_data)

# Meal plan creation function
def create_meal_plan(preferences: dict):
    global current_meal_plan
    
    meal_plans = generateLLMResopnse(get_meal_plan_prompt(preferences))
    current_meal_plan = meal_plans["meal_plan"]

    try:
        db = SessionLocal()
        createdDate = datetime.now()

        for meal in meal_plans:
            mealPlan = MealPlan(
                id = str(uuid.uuid4()),
                user_id = current_user.get(id),
                meal_number = meal.get("meal_number"),
                meal_name = meal.get("meal_name"),
                cuisine_type = meal.get("cousine_type"),
                cook_time_minutes = meal.get("cook_time_minutes"),
                estimated_cost = meal.get("estimated_cost"),
                calories_per_serving = meal.get("calories_per_serving"),
                ingredients = meal.get("ingredients"),
                instructions = meal.get("instructions"),
                created_date = createdDate,
                updated_date = createdDate
            )

            db.add(mealPlan)
            db.commit()
            db.refresh(mealPlan)
    except Exception as e:
        db.rollback()
        raise Exception(f"Error creating meal plans: {str(e)}")
    finally:
        db.close()

    # Generate meal plan using LLM based on user preferences
    meal_plans = generateLLMResopnse(get_meal_plan_prompt(current_user_preferences))
    current_meal_plan = meal_plans["meal_plan"]

    return meal_plans["meal_plan"]


# User login function
def login_user(email: str, password: str):
    global current_user
    try:
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        if user and passwordHasher.verify(user.password, password):
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