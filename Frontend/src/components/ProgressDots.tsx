interface ProgressDotsProps {
    total: number
    current: number
}
export function ProgressDots({ total, current }: ProgressDotsProps) {
    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {Array.from({
                length: total,
            }).map((_, i) => (
                <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary' : i < current ? 'w-2 bg-primary/40' : 'w-2 bg-gray-200'}`}
                />
            ))}
        </div>
    )
}
