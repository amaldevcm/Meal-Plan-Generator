import { motion } from 'framer-motion'
import { Settings, RefreshCw } from 'lucide-react'
import { DayCard } from '../components/DayCard'
import type { UserState } from '../types'
import { mockMealPlan } from '../data/mock'

interface MealPlansProps {
    userState: UserState
}

export function MealPlans({ userState }: MealPlansProps) {
    const totalCalories = mockMealPlan.reduce(
        (acc, day) => acc + day.meals.reduce((sum, meal) => sum + meal.calories, 0),
        0,
    )
    const avgCalories = Math.round(totalCalories / mockMealPlan.length)
    return (
        <div className="min-h-screen bg-warm pb-24 max-w-md mx-auto">
            <header className="px-6 pt-12 pb-6 bg-surface rounded-b-3xl shadow-sm sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Good morning,</p>
                        <h1 className="font-serif text-2xl text-gray-900">
                            Hi, {userState.name || 'Chef'}
                        </h1>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="bg-primary text-white rounded-2xl p-5 relative overflow-hidden shadow-float">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="font-medium text-primary-light text-white/90">
                                This Week's Plan
                            </h2>
                            <button className="text-white/80 hover:text-white flex items-center gap-1 text-xs bg-black/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <RefreshCw size={12} /> Regenerate
                            </button>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <p className="text-3xl font-serif mb-1">{avgCalories}</p>
                                <p className="text-xs text-white/70 uppercase tracking-wider">
                                    Avg kcal/day
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-serif mb-1">28</p>
                                <p className="text-xs text-white/70 uppercase tracking-wider">
                                    Total Meals
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl text-gray-900">Daily Menus</h2>
                    <span className="text-sm text-accent font-medium">
                        {userState.diet
                            ? userState.diet.charAt(0).toUpperCase() + userState.diet.slice(1)
                            : 'Custom'}
                    </span>
                </div>

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                        staggerChildren: 0.1,
                    }}
                >
                    {mockMealPlan.map((day, index) => (
                        <motion.div
                            key={day.id}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: index * 0.1,
                            }}
                        >
                            <DayCard day={day} defaultExpanded={index === 0} />
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </div>
    )
}
