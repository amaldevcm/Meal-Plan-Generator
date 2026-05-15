import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ChipSelectProps {
    label: string
    selected: boolean
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'pill' | 'card'
}

export function ChipSelect({
    label,
    selected,
    onClick,
    icon,
    variant = 'pill',
}: ChipSelectProps) {
    if (variant === 'card') {
        return (
            <motion.button
                whileTap={{
                    scale: 0.97,
                }}
                onClick={onClick}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-colors duration-200 ${selected ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-surface text-gray-600 hover:border-gray-200'}`}
            >
                {selected && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                        <Check size={12} strokeWidth={3} />
                    </div>
                )}
                <div className="text-3xl mb-2">{icon}</div>
                <span className="font-medium text-sm">{label}</span>
            </motion.button>
        )
    }
    return (
        <motion.button
            whileTap={{
                scale: 0.95,
            }}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 ${selected ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 bg-surface text-gray-600 hover:border-gray-300'}`}
        >
            <span className="font-medium text-sm">{label}</span>
            {selected && <Check size={16} className="text-white" />}
        </motion.button>
    )
}
