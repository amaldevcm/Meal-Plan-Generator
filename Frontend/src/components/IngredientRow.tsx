
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { Ingredient } from '../types'
interface IngredientRowProps {
    ingredient: Ingredient
    onToggle: (id: string) => void
}
export function IngredientRow({ ingredient, onToggle }: IngredientRowProps) {
    return (
        <motion.div
            layout
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onToggle(ingredient.id)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-200 shrink-0 ${ingredient.acquired ? 'bg-primary border-primary text-white' : 'border-2 border-gray-300 bg-transparent'}`}
                >
                    {ingredient.acquired && <Check size={14} strokeWidth={3} />}
                </button>
                <span
                    className={`text-sm font-medium transition-colors duration-200 ${ingredient.acquired ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                >
                    {ingredient.name}
                </span>
            </div>
            <span className="text-sm text-gray-500">{ingredient.quantity}</span>
        </motion.div>
    )
}
