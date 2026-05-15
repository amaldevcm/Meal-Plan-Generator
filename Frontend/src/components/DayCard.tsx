import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { DayPlan } from '../types'
import { MealCard } from './MealCard'
interface DayCardProps {
    day: DayPlan
    defaultExpanded?: boolean
}
export function DayCard({ day, defaultExpanded = false }: DayCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const totalCalories = day.meals.reduce((sum, meal) => sum + meal.calories, 0)
    return (
        <div className="bg-surface rounded-2xl shadow-soft border border-gray-100 overflow-hidden mb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-5 bg-surface"
            >
                <div className="flex flex-col items-start">
                    <h3 className="font-serif text-xl text-gray-900">{day.dayOfWeek}</h3>
                    <p className="text-sm text-gray-500">
                        {day.date} • {totalCalories} kcal
                    </p>
                </div>
                <motion.div
                    animate={{
                        rotate: isExpanded ? 180 : 0,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-primary"
                >
                    <ChevronDown size={20} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="px-5 pb-4 pt-1 border-t border-gray-50">
                            {day.meals.map((meal) => (
                                <MealCard key={meal.id} meal={meal} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
