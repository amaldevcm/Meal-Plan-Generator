import { AnimatePresence, motion } from 'framer-motion'
import { ImgData } from '../types'
import { useEffect, useState } from 'react'

interface MealPlanLoaderProps {
    message?: string
}

export function MealPlanLoader({ message = "Loading..." }: MealPlanLoaderProps) {

    const [emojiIndex, setEmojiIndex] = useState(0)
    useEffect(() => {
        const emojiTimer = setInterval(() => {
            setEmojiIndex((i) => (i + 1) % ImgData.emoji.length)
        }, 1400)
        return () => {
            clearInterval(emojiTimer)
        }
    }, [])

    return (
        <div className="min-h-screen bg-warm max-w-md mx-auto flex flex-col items-center justify-center px-8 pb-24">
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                {/* Pulsing rings */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-primary/30"
                        initial={{
                            scale: 0.6,
                            opacity: 0.8,
                        }}
                        animate={{
                            scale: 1.4,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: 'easeOut',
                        }}
                    />
                ))}

                {/* Plate */}
                <motion.div
                    className="relative w-28 h-28 rounded-full bg-surface shadow-float border-2 border-primary/10 flex items-center justify-center"
                    animate={{
                        rotate: [0, 6, -6, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={emojiIndex}
                            initial={{
                                scale: 0.4,
                                opacity: 0,
                                rotate: -30,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                rotate: 0,
                            }}
                            exit={{
                                scale: 0.4,
                                opacity: 0,
                                rotate: 30,
                            }}
                            transition={{
                                duration: 0.4,
                            }}
                            className="text-6xl"
                        >
                            {ImgData.emoji[emojiIndex]}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
            <p className="text-sm text-gray-500">{message}</p>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mt-8 relative">
                <motion.div
                    className="absolute inset-y-0 w-1/3 bg-primary rounded-full"
                    animate={{
                        x: ['-100%', '300%'],
                    }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>
        </div>
    )
}
