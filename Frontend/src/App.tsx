import { useState } from 'react'
import { AuthStep } from './pages/AuthStep'
import { DietStep } from './pages/DietStep'
import { GoalsStep } from './pages/GoalsStep'
import { MealPlans } from './pages/MealPlans'
import { Ingredients } from './pages/Ingredients'
import { BottomNav } from './components/BottomNav'
import { AnimatePresence, motion } from 'framer-motion'

import type { UserState } from './types'

type AppStep = 'auth' | 'diet' | 'goals' | 'main'
type MainTab = 'meals' | 'ingredients'

export default function App() {
  const [step, setStep] = useState<AppStep>('auth')
  const [activeTab, setActiveTab] = useState<MainTab>('meals')
  const [userState, setUserState] = useState<UserState>({
    name: '',
    diet: '',
    allergies: [],
    goals: [],
    healthConditions: [],
    cuisines: [],
  })

  const updateUserState = (updates: Partial<UserState>) => {
    setUserState((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const handleAuthNext = (name: string) => {
    updateUserState({
      name,
    })
    setStep('diet')
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
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
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
            transition={pageTransition}
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
            transition={pageTransition}
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
            transition={pageTransition}
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
            transition={pageTransition}
            className="h-full relative"
          >
            {activeTab === 'meals' ? (
              <MealPlans userState={userState} />
            ) : (
              <Ingredients />
            )}
            <BottomNav activeTab={activeTab} onChange={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
