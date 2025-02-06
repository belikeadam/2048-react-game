import { motion, AnimatePresence } from "framer-motion";
import { Position } from "../../types";  

interface TileProps {
  value: number;
  position: Position;
  merged?: boolean;
  isDark?: boolean;
  onClick: () => void;
  swapMode: boolean;
  selected: boolean;
  hintDirection: string | null;
}

const getColorScheme = (value: number, isDark: boolean = false) => {
  const colors: { [key: number]: { light: string; dark: string } } = {
    2: {
      light: "bg-emerald-100 text-emerald-900",
      dark: "bg-emerald-900 text-emerald-100",
    },
    4: {
      light: "bg-sky-200 text-sky-900",
      dark: "bg-sky-800 text-sky-100",
    },
    8: {
      light: "bg-indigo-300 text-indigo-900",
      dark: "bg-indigo-700 text-indigo-100",
    },
    16: {
      light: "bg-purple-400 text-white",
      dark: "bg-purple-600 text-white",
    },
    32: {
      light: "bg-pink-500 text-white",
      dark: "bg-pink-700 text-white",  
    },
    64: {
      light: "bg-rose-500 text-white",
      dark: "bg-rose-700 text-white",
    },
    128: {
      light: "bg-amber-400 text-white shadow-amber-200/50 shadow-[0_0_12px_3px]",
      dark: "bg-amber-600 text-white shadow-amber-400/50 shadow-[0_0_12px_3px]",
    },
    256: {
      light: "bg-amber-500 text-white shadow-amber-300/50 shadow-[0_0_12px_3px]",
      dark: "bg-amber-700 text-white shadow-amber-500/50 shadow-[0_0_12px_3px]",
    },
    512: {
      light: "bg-amber-600 text-white shadow-amber-400/50 shadow-[0_0_12px_3px]",
      dark: "bg-amber-800 text-white shadow-amber-600/50 shadow-[0_0_12px_3px]",
    },
    1024: {
      light: "bg-amber-700 text-white shadow-amber-500/50 shadow-[0_0_12px_3px]",
      dark: "bg-amber-900 text-white shadow-amber-700/50 shadow-[0_0_12px_3px]",
    },
    2048: {
      light: "bg-amber-800 text-white shadow-amber-600/50 shadow-[0_0_12px_3px]",
      dark: "bg-amber-900 text-white shadow-amber-800/50 shadow-[0_0_12px_3px]",
    },
  };

  return colors[value]?.[isDark ? 'dark' : 'light'] || 
    (isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-800');
}

export default function Tile({ value, position, merged = false, isDark = false, onClick, swapMode, selected, hintDirection }: TileProps) {
  const colorScheme = getColorScheme(value, isDark);
  const tileKey = `tile-${position.col}-${position.row}-${value}`;

  return (
    <AnimatePresence>
      {value !== 0 && (
        <motion.div
          key={tileKey}
          initial={{ scale: merged ? 0.8 : 0 }}
          animate={{
            scale: 1,
            x: position.col * 77, // (65px tile + 12px gap)
            y: position.row * 77, // (65px tile + 12px gap)
          }}
          exit={{ scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 1000,
            damping: merged ? 20 : 30,
            duration: 0.15,
            mass: 0.5
          }}
          className={`absolute w-[65px] h-[65px] flex items-center justify-center rounded-lg ${colorScheme} 
            text-2xl font-bold shadow-lg backdrop-blur-sm ${swapMode ? 'swap-mode' : ''} ${selected ? 'selected' : ''}`}
          onClick={onClick}
        >
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: merged ? [0.8, 1.1, 1] : 1 }}
            transition={{ 
              duration: 0.15,
              ease: "easeOut",
              times: merged ? [0, 0.6, 1] : undefined
            }}
            className="font-mono tracking-tight"
          >
            {value}
          </motion.span>
          {hintDirection && <div className={`hint-${hintDirection}`} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}