export interface UserState {
    name: string
    diet: string
    allergies: string[]
    goals: string[]
    cuisines: string[]
    healthConditions: string[]
}

export interface Meal {
    id: string
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
    name: string
    calories: number
    prepTime: number // in minutes
    emoji: string
}

export interface DayPlan {
    id: string
    dayOfWeek: string
    date: string
    meals: Meal[]
}

export interface Ingredient {
    id: string
    name: string
    quantity: string
    category: 'Produce' | 'Proteins' | 'Dairy' | 'Grains' | 'Pantry' | 'Spices'
    acquired: boolean
}
