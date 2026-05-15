import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import { ChipSelect } from '../components/ChipSelect'
import { ProgressDots } from '../components/ProgressDots'
import type { UserState } from '../types'
import axios from 'axios';

interface GoalsStepProps {
    userState: UserState
    updateState: (updates: Partial<UserState>) => void
    onNext: () => void
    onBack: () => void
}

const GOALS = [
    'Weight loss',
    'Muscle gain',
    'Maintain weight',
    'More energy',
    'Better sleep',
    'Heart health',
]

const HEALTH_CONDITIONS = [
    'Diabetes',
    'Hypertension',
    'High cholesterol',
    'IBS',
    'Acid reflux',
    'PCOS',
    'Thyroid',
]

const CUISINES = [
    'Italian',
    'Mexican',
    'Asian',
    'Mediterranean',
    'Indian',
    'American',
    'Middle Eastern',
    'Japanese',
]

const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export function GoalsStep({ userState, updateState, onNext, onBack }: GoalsStepProps) {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [isGenerating, setIsGenerating] = useState(false)

    const toggleItem = (list: keyof UserState, item: string) => {
        const current = userState[list] as string[]
        const updated = current.includes(item)
            ? current.filter((i) => i !== item)
            : [...current, item]
        updateState({
            [list]: updated,
        })
    }

    const handleGenerate = () => {
        setIsGenerating(true)
        axios.post(`${SERVER_URL}/api/preferences`, {
            dietary_lifestyle: userState.diet,
            allergies: userState.allergies,
            health_conditions: userState.healthConditions,
            nutritional_goals: userState.goals,
            cuisine_preferences: userState.cuisines,
            cooking_skill_level: "beginner",
        }, {
            headers: HEADERS,
        }).then((response) => {
            console.log('Preferences saved:', response.data)
        }).catch((error) => {
            console.error('Error saving preferences:', error)
        }).finally(() => {
            setIsGenerating(false)
        })

        setTimeout(() => {
            onNext()
        }, 2000)
    }
    const container = {
        hidden: {
            opacity: 0,
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    }
    const item = {
        hidden: {
            opacity: 0,
            y: 10,
        },
        show: {
            opacity: 1,
            y: 0,
        },
    }
    return (
        <div className="min-h-screen bg-warm flex flex-col max-w-md mx-auto">
            <div className="px-6 pt-12 pb-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-surface border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                    <ArrowLeft size={20} />
                </button>
                <ProgressDots total={3} current={2} />
                <div className="w-10" />
            </div>

            <div className="flex-1 px-6 pb-32 overflow-y-auto">
                <div className="mb-8">
                    <h2 className="font-serif text-3xl text-gray-900 mb-2">
                        Fine-tune your plan
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Help us personalize your meals further.
                    </p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                            Health Goals
                        </h3>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="flex flex-wrap gap-2"
                        >
                            {GOALS.map((goal) => (
                                <motion.div key={goal} variants={item}>
                                    <ChipSelect
                                        variant="pill"
                                        label={goal}
                                        selected={userState.goals.includes(goal)}
                                        onClick={() => toggleItem('goals', goal)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                            Health Conditions
                        </h3>
                        <p className="text-gray-500 text-xs mb-3 -mt-2">
                            Helps us tailor your meals safely.
                        </p>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="flex flex-wrap gap-2"
                        >
                            {HEALTH_CONDITIONS.map((cond) => (
                                <motion.div key={cond} variants={item}>
                                    <ChipSelect
                                        variant="pill"
                                        label={cond}
                                        selected={userState.healthConditions.includes(cond)}
                                        onClick={() => toggleItem('healthConditions', cond)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                            Favorite Cuisines
                        </h3>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="flex flex-wrap gap-2"
                        >
                            {CUISINES.map((cuisine) => (
                                <motion.div key={cuisine} variants={item}>
                                    <ChipSelect
                                        variant="pill"
                                        label={cuisine}
                                        selected={userState.cuisines.includes(cuisine)}
                                        onClick={() => toggleItem('cuisines', cuisine)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-warm via-warm to-transparent z-10">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-primary text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-light transition-colors shadow-float relative overflow-hidden"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Crafting your plan...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Generate my plan
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
