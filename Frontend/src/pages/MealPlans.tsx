import { motion } from 'framer-motion'
import { RefreshCw, SlidersHorizontal } from 'lucide-react'
import { MealCard } from '../components/MealCard'
import { type UserState, type Meal, ImgData } from '../types'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MealPlanLoader } from '../components/MealPlanLoader'

interface MealPlansProps {
    userState: UserState
    onAddToGroceries: (meal: Meal) => number
    editPreferences: () => void
}

const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export function MealPlans({ userState, onAddToGroceries, editPreferences }: MealPlansProps) {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mealPlan, setMealPlan] = useState([]);

    const [totalCalories, setTotalCalories] = useState(0);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${SERVER_URL}/api/mealPlans`, { headers: HEADERS })
            .then(response => {
                console.log(response.data)
                if (response.data.status === "success") {
                    // Assign random emojis to meals
                    response.data.mealPlans.forEach((meal: Meal) => {
                        meal.emoji = ImgData.emoji[Math.floor(Math.random() * ImgData.emoji.length)]
                    })

                    setMealPlan(response.data.mealPlans);
                    const totalCals = response.data.mealPlans.reduce(
                        (sum: number, meal: Meal) => sum + meal['calories_per_serving'],
                        0
                    )

                    console.log("Total calories:", totalCals);
                    setTotalCalories(totalCals);
                    setIsLoading(false);
                }
            }).catch((error) => {
                console.error('Error saving preferences:', error)
            })
    }, [setMealPlan])

    const handleNewMealPlan = () => {
        setIsGenerating(true);
        axios.get(`${SERVER_URL}/api/newMealPlans`, { headers: HEADERS })
            .then((response) => {
                if (response.data.status == "success") {
                    response.data.mealPlans.forEach((meal: Meal) => {
                        meal.emoji = ImgData.emoji[Math.floor(Math.random() * ImgData.emoji.length)]
                    })
                    setMealPlan(response.data.mealPlans);
                    const totalCals = response.data.mealPlans.reduce(
                        (sum: number, meal: Meal) => sum + meal['calories_per_serving'],
                        0,
                    )
                    setTotalCalories(totalCals);
                    setIsGenerating(false);
                }
            }).catch((error) => {
                console.error('Error saving preferences:', error)
            })
    }

    if (isGenerating) {
        return <MealPlanLoader message="Generating your meal plan..." />
    }
    if (isLoading) {
        return <MealPlanLoader message="Loading your meal plan..." />
    }

    return (
        <div className="min-h-screen bg-warm pb-24 max-w-md mx-auto">
            <header className="px-6 pt-12 pb-6 bg-surface rounded-b-3xl shadow-sm sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Good day,</p>
                        <h1 className="font-serif text-2xl text-gray-900">
                            Hi, {userState.name || 'Chef'}
                        </h1>
                    </div>
                    <button
                        onClick={editPreferences}
                        className="flex items-center gap-1.5 px-3 h-10 rounded-full bg-warm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-xs font-medium"
                    >
                        <SlidersHorizontal size={14} />
                        Preferences
                    </button>
                </div>

                <div className="bg-primary text-white rounded-2xl p-5 relative overflow-hidden shadow-float">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="font-medium text-white/90">Your Meal Plans</h2>
                            <button className="text-white/80 hover:text-white flex items-center gap-1 text-xs bg-black/10 px-2 py-1 rounded-lg backdrop-blur-sm"
                                onClick={handleNewMealPlan}
                            >
                                <RefreshCw size={12} /> Regenerate
                            </button>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <p className="text-3xl font-serif mb-1">
                                    {mealPlan.length}
                                </p>
                                <p className="text-xs text-white/70 uppercase tracking-wider">
                                    Meals
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-serif mb-1">{totalCalories}</p>
                                <p className="text-xs text-white/70 uppercase tracking-wider">
                                    Total kcal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl text-gray-900">Your Menu</h2>
                    <span className="text-sm text-accent font-medium">
                        {userState.dietary_lifestyle
                            ? userState.dietary_lifestyle.charAt(0).toUpperCase() + userState.dietary_lifestyle.slice(1)
                            : 'Custom'}
                    </span>
                </div>

                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >
                    {mealPlan.map((meal, index) => (
                        <motion.div
                            key={meal['meal_number']}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: index * 0.08,
                            }}
                        >
                            <MealCard
                                meal={meal}
                                onAddToGroceries={onAddToGroceries}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </div>
    )
}
