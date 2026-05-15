# 🥗 MealPlanner AI

An AI-powered meal planning web app that generates personalized 5-meal plans with a consolidated grocery list based on your dietary preferences, health restrictions, and lifestyle.

---

## ✨ Features

- **AI-Personalized Meal Plans** — Generates 5 meals tailored to your dietary profile using Claude AI
- **Dietary & Health Restrictions** — Supports allergies, health conditions, cuisine preferences, and lifestyle diets
- **Consolidated Grocery List** — Automatically merges ingredients across all meals into a single shopping list
- **Grocery Integration** — Add ingredients directly to your cart via Kroger API
- **Secure Auth** — JWT-based authentication with httpOnly cookie session management
- **Responsive UI** — Mobile-first React web app optimized for small screens

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (mobile-responsive) |
| Backend | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy + Alembic |
| AI | Claude API (Anthropic) |
| Auth | PyJWT + Argon2 |
| Grocery API | Kroger API |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase API Key
- Groq API Key

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/mealplanner-ai.git
cd mealplanner-ai/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Fill in your keys in .env

# Run database migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

---

## ⚙️ Environment Variables

```env
# Supabase configuration
SUPABASE_HOST="db.hxenujasdfamafgrftwodbwbaxzawjl.supabase.co"
SUPABASE_PORT="5432"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"
SUPABASE_PASSWORD="XHMaDasdfahfghdfgsdfgBpOaXxgr9i"

# JWT configuration
JWT_SECRET_KEY="qwertyuio"
JWT_ALGORITHM="HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Groq API configuration
GROQ_API_KEY="gsk_ixx5D4yCbGMqUaauoQ1aatgpWGdyb3FYEyQ21TdfsdfaKNMffXS5hplCKiP5ic"

```

---

## 📁 Project Structure

```
mealplanner-ai/
├── backend/
│   ├── app.py
|   ├── DB.py
|   ├── CreateTable.py
│   ├── Schema/
│   │   ├── schema.py
│   ├── Services/
│   │   ├── UserServices.py
│   │   ├── MealPlanServices.py
│   ├── prompts/
│   │   └── MealPlanPrompt.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── compnents/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── ChipSelect.tsx
│   │   │   ├── DayCard.tsx
│   │   │   ├── IngrediatRow.tsx
│   │   │   ├── MealCard.tsx
│   │   │   └── ProgressDots.tsx
│   │   ├── pages/
│   │   │   ├── AuthStep.tsx
│   │   │   ├── DietStep.tsx
│   │   │   ├── GoalsStep.tsx
│   │   │   ├── Ingredients.tsx
│   │   │   └── MealPlans.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

---

## 🧠 How It Works

1. **Onboarding** — User sets dietary lifestyle, allergies, health conditions, cuisine preferences, cooking skill, budget, and serving size
2. **Meal Plan Generation** — User preferences are passed to Claude API which returns a structured 5-meal plan
3. **Grocery List** — Ingredients are consolidated across all 5 meals into a categorized grocery list
4. **Shopping** — User adds grocery list directly to their Kroger cart via API

---

## 🗂 Database Schema

### Users
| Column | Type |
|--------|------|
| id | UUID (PK) |
| email | String (unique) |
| first_name | String |
| last_name | String |
| phone_number | String |
| password | String (Argon2 hash) |
| created_date | DateTime |
| updated_date | DateTime |

### User Preferences
| Column | Type |
|--------|------|
| id | UUID (PK) |
| user_id | UUID (FK) |
| dietary_lifestyle | Array(String) |
| allergies | Array(String) |
| health_conditions | Array(String) |
| nutritional_goals | Array(String) |
| cuisine_preferences | Array(String) |
| cooking_skill_level | String |
| created_date | DateTime |
| updated_date | DateTime |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Register new user |
| POST | `/auth/login` | Login, returns access token |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |

### Meal Plan
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/meal-plan/generate` | Generate 5-meal plan |
| GET | `/meal-plan/history` | Get past meal plans |

---

## 📄 License

[MIT](LICENSE)
