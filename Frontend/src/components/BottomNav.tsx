import { UtensilsCrossed, ShoppingBasket } from 'lucide-react'
import { motion } from 'framer-motion'
interface BottomNavProps {
    activeTab: 'meals' | 'ingredients'
    onChange: (tab: 'meals' | 'ingredients') => void
}
export function BottomNav({ activeTab, onChange }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-6 z-50">
            <div className="max-w-md mx-auto flex justify-around items-center pb-4">
                <button
                    onClick={() => onChange('meals')}
                    className="relative flex flex-col items-center gap-1 p-2 w-20"
                >
                    <UtensilsCrossed
                        size={24}
                        className={`transition-colors duration-200 ${activeTab === 'meals' ? 'text-primary' : 'text-gray-400'}`}
                    />
                    <span
                        className={`text-[10px] font-medium transition-colors duration-200 ${activeTab === 'meals' ? 'text-primary' : 'text-gray-400'}`}
                    >
                        Plan
                    </span>
                    {activeTab === 'meals' && (
                        <motion.div
                            layoutId="nav-indicator"
                            className="absolute -top-2 w-8 h-1 bg-primary rounded-full"
                        />
                    )}
                </button>

                <button
                    onClick={() => onChange('ingredients')}
                    className="relative flex flex-col items-center gap-1 p-2 w-20"
                >
                    <ShoppingBasket
                        size={24}
                        className={`transition-colors duration-200 ${activeTab === 'ingredients' ? 'text-primary' : 'text-gray-400'}`}
                    />
                    <span
                        className={`text-[10px] font-medium transition-colors duration-200 ${activeTab === 'ingredients' ? 'text-primary' : 'text-gray-400'}`}
                    >
                        Grocery
                    </span>
                    {activeTab === 'ingredients' && (
                        <motion.div
                            layoutId="nav-indicator"
                            className="absolute -top-2 w-8 h-1 bg-primary rounded-full"
                        />
                    )}
                </button>
            </div>
        </div>
    )
}
