import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthStep } from './pages/AuthStep'
import { DietStep } from './pages/DietStep'
import { GoalsStep } from './pages/GoalsStep'
import { MealPlans } from './pages/MealPlans'
import { Ingredients } from './pages/Ingredients'
import { BottomNav } from './components/BottomNav'
import type { UserState, Meal, Ingredient } from './types'

type AppStep = 'auth' | 'diet' | 'goals' | 'main'
type MainTab = 'meals' | 'ingredients'

function inferCategory(ing_type: string): Ingredient['category'] {
  const type = ing_type.charAt(0).toUpperCase() + ing_type.slice(1)
  if (type === "Produce")
    return 'Produce'
  if (type === "Proteins")
    return 'Proteins'
  if (type === "Dairy")
    return 'Dairy'
  if (type === "Grains")
    return 'Grains'
  if (type === "Spices")
    return 'Spices'
  return 'Pantry'
}

function formatQty(qty: number, unit: string): string {
  let qtyStr: string
  if (qty === 0.25) qtyStr = '¼'
  else if (qty === 0.5) qtyStr = '½'
  else if (qty === 0.75) qtyStr = '¾'
  else if (Number.isInteger(qty)) qtyStr = String(qty)
  else qtyStr = qty.toString()
  return `${qtyStr} ${unit}`
}

export default function App() {
  const [step, setStep] = useState<AppStep>('auth')
  const [activeTab, setActiveTab] = useState<MainTab>('meals')
  const [groceries, setGroceries] = useState<Ingredient[]>([])
  const [userState, setUserState] = useState<UserState>({
    name: '',
    dietary_lifestyle: '',
    allergies: [],
    nutritional_goals: [],
    health_conditions: [],
    cuisine_preferences: [],
  })

  const updateUserState = (updates: Partial<UserState>) => {
    setUserState((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const handleAuthNext = (user: any, tab: AppStep) => {
    updateUserState(user)
    setStep(tab)
  }

  const addMealToGroceries = (meal: Meal): number => {
    let addedCount = 0
    setGroceries((prev) => {
      const existingNames = new Set(prev.map((i) => i.name.toLowerCase()))
      const newItems: Ingredient[] = []
      meal.ingredients.forEach((ing) => {
        if (!existingNames.has(ing.name.toLowerCase())) {
          newItems.push({
            id: `${meal.meal_number}-${ing.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: ing.name,
            quantity: formatQty(ing.quantity, ing.unit),
            category: inferCategory(ing.type),
            acquired: false,
            price: ing.price,
          })
          existingNames.add(ing.name.toLowerCase())
        }
      })
      addedCount = newItems.length
      return [...prev, ...newItems]
    })
    return addedCount
  }

  const toggleGrocery = (id: string) => {
    setGroceries((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? {
            ...ing,
            acquired: !ing.acquired,
          }
          : ing,
      ),
    )
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: -20,
    },
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <AnimatePresence mode="wait">
        {step === 'auth' && (
          <motion.div
            key="auth"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="h-full"
          >
            <AuthStep onNext={handleAuthNext} />
          </motion.div>
        )}

        {step === 'diet' && (
          <motion.div
            key="diet"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="h-full"
          >
            <DietStep
              userState={userState}
              updateState={updateUserState}
              onNext={() => setStep('goals')}
              onBack={() => setStep('auth')}
            />
          </motion.div>
        )}

        {step === 'goals' && (
          <motion.div
            key="goals"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="h-full"
          >
            <GoalsStep
              userState={userState}
              updateState={updateUserState}
              onNext={() => setStep('main')}
              onBack={() => setStep('diet')}
            />
          </motion.div>
        )}

        {step === 'main' && (
          <motion.div
            key="main"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="h-full relative"
          >
            {activeTab === 'meals' ? (
              <MealPlans
                userState={userState}
                onAddToGroceries={addMealToGroceries}
                editPreferences={() => setStep('diet')}
              />
            ) : (
              <Ingredients groceries={groceries} onToggle={toggleGrocery} />
            )}
            <BottomNav activeTab={activeTab} onChange={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
