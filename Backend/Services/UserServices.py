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
        return {"status": "error", "message": "Email is required"}
    
    if not name:
        return {"status": "error", "message": "Name is required"}

    # Simple email format validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {"status": "error", "message": "Invalid email format"}
    
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
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

    current_user = new_user.__dict__.copy()
    current_user['current_preferences'] = None
    current_user.pop("password")
    return {"status": "success", "user": current_user}

# User preferences creation function
def create_user_preferences(preferences_data: dict):
    global current_user
    try:
        db = SessionLocal()
        createdDate = datetime.now()
        new_preferences = UserPreference(
            id = str(uuid.uuid4()),
            user_id = current_user.get("id"),
            dietary_lifestyle = preferences_data.get("dietary_lifestyle", None),
            allergies = preferences_data.get("allergies", []),
            health_conditions = preferences_data.get("health_conditions", []),
            nutritional_goals = preferences_data.get("nutritional_goals", []),
            cuisine_preferences = preferences_data.get("cuisine_preferences", []),
            cooking_skill_level = preferences_data.get("cooking_skill_level", None),
            created_date = createdDate,
            updated_date = createdDate,
        )

        db.query(User).filter(User.id == current_user.get('id')).update({'current_preferences': new_preferences.id})
        
        db.add(new_preferences)
        db.commit()
        db.refresh(new_preferences)
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

    meal_plan = create_meal_plan(preferences_data)
    current_user['preferences'] = preferences_data
    current_user['meal_plan'] = meal_plan

    return {"status": "success", "preferences": preferences_data, "meal_plan": meal_plan}

# Meal plan creation function
def create_meal_plan(preferences: dict):
    global current_meal_plan
    
    meal_plans = generateLLMResopnse(get_meal_plan_prompt(preferences))
    current_meal_plan = meal_plans["meal_plan"]
    # print(f"Type of meal plan: {type(current_meal_plan)}")

    try:
        db = SessionLocal()
        createdDate = datetime.now()
        new_meals = []
        for meal in current_meal_plan:
            mealPlan = MealPlan(
                id = str(uuid.uuid4()),
                user_id = current_user.get("id"),
                meal_number = meal.get("meal_number"),
                meal_name = meal.get("meal_name"),
                cuisine_type = meal.get("cuisine_type"),
                cook_time_minutes = meal.get("cook_time_minutes"),
                estimated_cost = meal.get("estimated_cost"),
                calories_per_serving = meal.get("calories_per_serving"),
                ingredients = meal.get("ingredients"),
                instructions = meal.get("instructions"),
                created_date = createdDate,
                updated_date = createdDate
            )
            new_meals.append(mealPlan.id)
            db.add(mealPlan)

        db.query(MealPlan).filter(MealPlan.user_id == current_user.get("id") and MealPlan.id not in new_meals).delete()

        db.commit()
        db.refresh(mealPlan)
    except Exception as e:
        db.rollback()
        raise Exception(f"Error creating meal plans: {str(e)}")
    finally:
        db.close()

    return meal_plans["meal_plan"]

# User login function
def login_user(email: str, password: str):
    global current_user
    try:
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        if user and passwordHasher.verify(user.password, password):
            current_user = user.__dict__.copy()

            current_user = current_user | get_user_preferences(current_user.get("current_preferences"))

            current_user.pop("password")
            return {"status": "success", "user": current_user}
        else:
            return {"status": "error", "message": "Invalid email or password"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

# Fetch meal plans 
def get_meal_plan(is_new:bool = False):
    global current_user, current_meal_plan
    
    db = SessionLocal()
    try:
        if(is_new):
            return {"status": "success", "mealPlans": create_meal_plan(current_user_preferences)}
        
        meal_plan = db.query(MealPlan).filter(MealPlan.user_id == current_user.get("id")).all()       

    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
    return {"status": "success", "mealPlans": meal_plan}

# Fetch user preferences
def get_user_preferences(preference_id: str):
    global current_user, current_user_preferences

    try:
        db = SessionLocal()
        preferences = db.query(UserPreference).filter(UserPreference.id == preference_id).first()
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

    current_user_preferences = preferences.__dict__.copy()
    current_user_preferences.pop("created_date")
    current_user_preferences.pop("updated_date")
    current_user_preferences.pop("user_id")
    current_user_preferences.pop("id")
    return {"status": "success", "preferences": current_user_preferences}

# Get current user and preferences
def get_current_user():
    global current_user
    return current_user

def get_current_user_preferences():
    global current_user_preferences
    return current_user_preferences