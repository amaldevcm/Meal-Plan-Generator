from urllib import request

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Services.UserServices import create_user, create_user_preferences, get_current_user, login_user

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post('/api/signup')
async def signup(data: dict):
    user = create_user(data)
    if user is None:
        return {"status": "error", "message": "User already exists"}
    return {"status": "success", "message": "Signup successful", "user": {"user_id": user.id, "email": user.email, "name": user.name, "sessionToken": user.sessionToken}}

@app.post('/api/preferences')
async def set_preferences(preferences_data: dict):
    if  get_current_user() is None:
        return {"status": "error", "message": "User not authenticated"}
    
    user_preferences = create_user_preferences(get_current_user().id, preferences_data)
    return {"status": "success", "message": "Preferences saved successfully", "preferences": user_preferences}