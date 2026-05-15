
import { Clock, Flame } from 'lucide-react'
import type { Meal } from '../types'

interface MealCardProps {
    meal: Meal
}

export function MealCard({ meal }: MealCardProps) {
    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className="w-12 h-12 rounded-xl bg-warm flex items-center justify-center text-2xl shrink-0 shadow-sm border border-gray-100">
                {meal.emoji}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        {meal.type}
                    </span>
                </div>
                <h4 className="font-medium text-gray-900 truncate mb-1">{meal.name}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Flame size={12} className="text-gray-400" />
                        {meal.calories} cal
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        {meal.prepTime} min
                    </span>
                </div>
            </div>
        </div>
    )
}
