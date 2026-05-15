import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ChipSelect } from '../components/ChipSelect'
import { ProgressDots } from '../components/ProgressDots'
import type { UserState } from '../types'

interface DietStepProps {
    userState: UserState
    updateState: (updates: Partial<UserState>) => void
    onNext: () => void
    onBack: () => void
}

const LIFESTYLES = [
    {
        id: 'omnivore',
        label: 'Omnivore',
        icon: '🥩',
    },
    {
        id: 'vegetarian',
        label: 'Vegetarian',
        icon: '🥗',
    },
    {
        id: 'vegan',
        label: 'Vegan',
        icon: '🌱',
    },
    {
        id: 'pescatarian',
        label: 'Pescatarian',
        icon: '🐟',
    },
    {
        id: 'keto',
        label: 'Keto',
        icon: '🥑',
    },
    {
        id: 'paleo',
        label: 'Paleo',
        icon: '🍖',
    },
]

const ALLERGIES = [
    'Peanuts',
    'Tree nuts',
    'Dairy',
    'Eggs',
    'Gluten',
    'Soy',
    'Shellfish',
    'Fish',
    'Sesame',
]

export function DietStep({ userState, updateState, onNext, onBack }: DietStepProps) {
    const toggleAllergy = (allergy: string) => {
        const current = userState.allergies
        const updated = current.includes(allergy)
            ? current.filter((a) => a !== allergy)
            : [...current, allergy]
        updateState({
            allergies: updated,
        })
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
                <ProgressDots total={3} current={1} />
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            <div className="flex-1 px-6 pb-24 overflow-y-auto">
                <div className="mb-8">
                    <h2 className="font-serif text-3xl text-gray-900 mb-2">
                        How do you eat?
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Select your primary dietary lifestyle.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-3 mb-10"
                >
                    {LIFESTYLES.map((lifestyle) => (
                        <motion.div key={lifestyle.id} variants={item}>
                            <ChipSelect
                                variant="card"
                                label={lifestyle.label}
                                icon={lifestyle.icon}
                                selected={userState.diet === lifestyle.id}
                                onClick={() =>
                                    updateState({
                                        diet: lifestyle.id,
                                    })
                                }
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mb-6">
                    <h3 className="font-serif text-xl text-gray-900 mb-2">
                        Any allergies?
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">Select all that apply.</p>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="flex flex-wrap gap-2"
                    >
                        {ALLERGIES.map((allergy) => (
                            <motion.div key={allergy} variants={item}>
                                <ChipSelect
                                    variant="pill"
                                    label={allergy}
                                    selected={userState.allergies.includes(allergy)}
                                    onClick={() => toggleAllergy(allergy)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-warm via-warm to-transparent z-10">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={onNext}
                        disabled={!userState.diet}
                        className="w-full bg-primary text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-float"
                    >
                        Continue
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
