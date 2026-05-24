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
    response_data = create_user(data)
    if response_data.get("status") == "error":
        response.status_code = status.HTTP_203_NON_AUTHORITATIVE_INFORMATION
        return response_data

    response.status_code = status.HTTP_201_CREATED
    return response_data

# Login API endpoint
@app.post('/api/login')
async def login(data: dict, response: Response):
    response_data = login_user(data.get("email"), data.get("password"))
    
    if response_data.get("status") == "error":
        response.status_code = status.HTTP_203_NON_AUTHORITATIVE_INFORMATION
        return response_data
    
    response.status_code = status.HTTP_200_OK
    return response_data

# Endpoint to set user preferences
@app.post('/api/preferences')
async def set_preferences(preferences_data: dict, response: Response):
    if  get_current_user() is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"status": "error", "message": "User not authenticated"}
    
    response.status_code = status.HTTP_200_OK
    response_data = create_user_preferences(preferences_data)
    return response_data

# Get existing meal plans
@app.get('/api/mealPlans')
async def get_user_meal_plan(response: Response):
    response_data = get_meal_plan()
    if(response_data.get("status") == "error"):
        response.status_code = status.HTTP_204_NO_CONTENT
        return response_data
    
    response.status_code = status.HTTP_200_OK
    return response_data

# New meal plan generation API endpoint
@app.get('/api/newMealPlans')
async def get_new_meal_Plan(response: Response):
    response_data = get_meal_plan(is_new=True)
    if(response_data.get("status") == "error"):
        response.status_code = status.HTTP_204_NO_CONTENT
        return response_data
    
    response.status_code = status.HTTP_200_OK
    return response_data

