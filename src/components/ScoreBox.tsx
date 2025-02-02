import { motion } from 'framer-motion'

interface ScoreBoxProps {
  label: string
  value: number
  isDark?: boolean
}

export default function ScoreBox({ label, value, isDark }: ScoreBoxProps) {
  return (
    <div className={`rounded-lg p-3 text-center ${
      isDark ? 'bg-gray-700' : 'bg-indigo-100'
    }`}>
      <p className={`text-sm font-semibold mb-1 ${
        isDark ? 'text-gray-300' : 'text-indigo-600'
      }`}>
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ scale: 1.2, color: isDark ? '#10B981' : '#059669' }}
        animate={{ scale: 1, color: isDark ? '#E5E7EB' : '#1F2937' }}
        className="text-2xl font-mono font-bold"
      >
        {value}
      </motion.p>
    </div>
  )
}