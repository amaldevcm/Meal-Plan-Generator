import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Flame, ChevronDown, ShoppingBasket, Check, Plus } from 'lucide-react'
import type { Meal } from '../types'

interface MealCardProps {
    meal: Meal
    defaultExpanded?: boolean
    onAddToGroceries?: (meal: Meal) => number
}

function formatQuantity(qty: number): string {
    if (qty === 0.25) return '¼'
    if (qty === 0.5) return '½'
    if (qty === 0.75) return '¾'
    if (Number.isInteger(qty)) return String(qty)
    return qty.toString()
}

export function MealCard({ meal, defaultExpanded = false, onAddToGroceries }: MealCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const [addedState, setAddedState] = useState<null | {
        count: number
    }>(null)

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!onAddToGroceries) return
        const count = onAddToGroceries(meal)
        setAddedState({
            count,
        })
        setTimeout(() => setAddedState(null), 2000)
    }

    return (
        <div className="bg-surface rounded-2xl shadow-soft border border-gray-100 overflow-hidden mb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-4 p-4 text-left"
            >
                <div className="w-14 h-14 rounded-xl bg-warm flex items-center justify-center text-3xl shrink-0 border border-gray-100">
                    {meal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                        {meal.type}
                    </span>
                    <h4 className="font-serif text-lg text-gray-900 leading-tight mb-1.5">
                        {meal.meal_name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Flame size={12} className="text-gray-400" />
                            {meal.calories_per_serving} cal
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {meal.cook_time_minutes} min
                        </span>
                    </div>
                </div>
                <motion.div
                    animate={{
                        rotate: isExpanded ? 180 : 0,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-primary shrink-0"
                >
                    <ChevronDown size={18} />
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
                        <div className="px-5 pb-5 pt-1 border-t border-gray-50">
                            <div className="flex items-center gap-2 mt-3 mb-2">
                                <ShoppingBasket size={14} className="text-primary" />
                                <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                    Ingredients
                                </h5>
                                <span className="text-[10px] text-gray-400">
                                    {meal.ingredients.length} items
                                </span>
                            </div>
                            <ul className="divide-y divide-gray-50">
                                {meal.ingredients.map((ing, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{
                                            opacity: 0,
                                            x: -8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            delay: i * 0.03,
                                        }}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-primary/40" />
                                            <span className="text-sm text-gray-800">{ing.name}</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 tabular-nums">
                                            {formatQuantity(ing.quantity)} {ing.unit}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                            {onAddToGroceries && (
                                <motion.button
                                    whileTap={{
                                        scale: 0.97,
                                    }}
                                    onClick={handleAdd}
                                    disabled={!!addedState}
                                    className={`w-full mt-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${addedState ? (addedState.count > 0 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500') : 'bg-primary text-white hover:bg-primary-light'}`}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {addedState ? (
                                            <motion.span
                                                key="added"
                                                initial={{
                                                    opacity: 0,
                                                    y: 4,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -4,
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check size={16} />
                                                {addedState.count > 0
                                                    ? `Added ${addedState.count} item${addedState.count === 1 ? '' : 's'}`
                                                    : 'Already in your list'}
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="default"
                                                initial={{
                                                    opacity: 0,
                                                    y: 4,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -4,
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Add to groceries
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
