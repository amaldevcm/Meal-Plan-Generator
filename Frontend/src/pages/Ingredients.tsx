import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { IngredientRow } from '../components/IngredientRow'
import type { Ingredient } from '../types'

interface IngredientsProps {
    groceries: Ingredient[]
    onToggle: (id: string) => void
}

export function Ingredients({ groceries, onToggle }: IngredientsProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const filteredIngredients = groceries.filter((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    const acquiredCount = groceries.filter((i) => i.acquired).length
    const totalCount = groceries.length
    const progress = totalCount > 0 ? (acquiredCount / totalCount) * 100 : 0
    const categories = Array.from(
        new Set(filteredIngredients.map((i) => i.category)),
    )
    return (
        <div className="min-h-screen bg-warm pb-24 max-w-md mx-auto">
            <header className="px-6 pt-12 pb-4 bg-surface sticky top-0 z-20 shadow-sm">
                <h1 className="font-serif text-3xl text-gray-900 mb-4">Grocery List</h1>

                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-primary">
                            {acquiredCount} of {totalCount} items
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{
                                width: 0,
                            }}
                            animate={{
                                width: `${progress}%`,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: 'easeOut',
                            }}
                        />
                    </div>
                </div>

                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                </div>
            </header>

            <main className="px-6 pt-6">
                {categories.map((category) => {
                    const categoryItems = filteredIngredients.filter(
                        (i) => i.category === category,
                    )
                    if (categoryItems.length === 0) return null
                    return (
                        <div key={category} className="mb-8 last:mb-0">
                            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                {category}
                                <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                                    {categoryItems.length}
                                </span>
                            </h2>
                            <div className="bg-surface rounded-2xl p-4 shadow-soft border border-gray-100">
                                {categoryItems.map((ingredient) => (
                                    <IngredientRow
                                        key={ingredient.id}
                                        ingredient={ingredient}
                                        onToggle={onToggle}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}

                {filteredIngredients.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {groceries.length === 0
                                ? 'Your grocery list is empty. Add ingredients from your meal plans!'
                                : `No ingredients found matching "${searchQuery}"`}
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
