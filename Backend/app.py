from urllib import request

from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

from Services.UserServices import create_user, create_user_preferences, get_current_user, login_user, get_meal_plan

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Signup API endpoint
@app.post('/api/signup')
async def signup(data: dict, response: Response):
    user = create_user(data)
    if user is None:
        response.status_code = status.HTTP_409_CONFLICT
        return {"status": "error", "message": "User already exists"}
    
    response.status_code = status.HTTP_200_OK
    return {"status": "success", "message": "Signup successful", "user": user}

# Login API endpoint
@app.post('/api/login')
async def login(data: dict, response: Response):
    user = login_user(data.get("email"), data.get("password"))
    
    if user is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "Invalid email or password"}
    
    response.status_code = status.HTTP_200_OK
    return {"status": "success", "message": "Login successful", "user": user}

# Endpoint to set user preferences
@app.post('/api/preferences')
async def set_preferences(preferences_data: dict, response: Response):
    if  get_current_user() is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "User not authenticated"}
    
    response.status_code = status.HTTP_200_OK
    response_data = create_user_preferences(preferences_data)
    return {"status": "success", "message": "Preferences saved successfully", "data": response_data}

# Get existing meal plans
@app.get('/api/mealPlans')
async def get_user_meal_plan(response: Response):
    meal_plan = get_meal_plan()
    if(meal_plan is None):
        response.status_code = status.HTTP_204_NO_CONTENT
        return {"status": "error", "mealPlans": None}
    response.status_code = status.HTTP_200_OK
    return {"status": "success", "mealPlans": meal_plan}

# New meal plan generation API endpoint
@app.get('/api/newMealPlans')
async def get_new_meal_Plan(response: Response):
    meal_plan = get_meal_plan(is_new=True)
    if(meal_plan is None):
        response.status_code = status.HTTP_204_NO_CONTENT
        return {"status": "error", "mealPlans": None}
    response.status_code = status.HTTP_200_OK
    return {"status": "success", "mealPlans": meal_plan}

