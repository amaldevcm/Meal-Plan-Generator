import { Loader2 } from 'lucide-react'
export function MealPlanLoader() {
    return (
        <div className="min-h-screen bg-warm max-w-md mx-auto flex flex-col items-center justify-center px-8 pb-24">
            <Loader2
                className="text-primary animate-spin mb-4"
                size={40}
                strokeWidth={2}
            />
            <p className="text-sm text-gray-500">Generating your meal plan...</p>
        </div>
    )
}
