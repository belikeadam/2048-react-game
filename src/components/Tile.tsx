import { motion, AnimatePresence } from "framer-motion"

const colors: { [key: number]: string } = {
  2: "bg-blue-200 text-blue-800",
  4: "bg-blue-300 text-blue-900",
  8: "bg-blue-400 text-white",
  16: "bg-blue-500 text-white",
  32: "bg-blue-600 text-white",
  64: "bg-blue-700 text-white",
  128: "bg-indigo-500 text-white",
  256: "bg-indigo-600 text-white",
  512: "bg-indigo-700 text-white",
  1024: "bg-indigo-800 text-white",
  2048: "bg-indigo-900 text-white",
}

interface TileProps {
  value: number
  position: { x: number; y: number }
  merged: boolean
}

export default function Tile({ value, position, merged }: TileProps) {
  return (
    <AnimatePresence>
      {value !== 0 && (
        <motion.div
          key={`${position.x}-${position.y}-${value}`}
          initial={{ scale: merged ? 0.8 : 0 }}
          animate={{
            scale: 1,
            x: position.x * 78,
            y: position.y * 78,
          }}
          exit={{ scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.2,
          }}
          className={`absolute w-[76px] h-[76px] flex items-center justify-center rounded-md ${
            colors[value] || "bg-gray-200 text-gray-800"
          } text-2xl font-bold shadow-md`}
        >
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: merged ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

