export interface UserState {
    name: string
    dietary_lifestyle: string
    allergies: string[]
    nutritional_goals: string[]
    health_conditions: string[]
    cuisine_preferences: string[]
}

export interface MealIngredient {
    name: string
    quantity: number
    unit: string
    type: string
}

export interface Meal {
    meal_number: string
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
    meal_name: string
    calories_per_serving: number
    cook_time_minutes: number // in minutes
    emoji: string
    ingredients: MealIngredient[]
    cuisine_type: string
}

export interface Ingredient {
    id: string
    name: string
    quantity: string
    category: 'Produce' | 'Proteins' | 'Dairy' | 'Grains' | 'Pantry' | 'Spices'
    acquired: boolean
    price: number
}

export const ImgData = {
    emoji: ['🥗', '🥙', '🍲', '🍛', '🍜', '🍣', '🍤', '🍕', '🌮']
}