"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Board from "./Board"
import { useGame } from "../hooks/useGame"
 import type React from "react"

export default function Game() {
  const { board, score, bestScore, move, isGameOver, resetGame, mergedTiles } = useGame()
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        move(e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [move])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    }

    const dx = touchEnd.x - touchStartRef.current.x
    const dy = touchEnd.y - touchStartRef.current.y

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
      move(dx > 0 ? "right" : "left")
    } else if (Math.abs(dy) > 20) {
      move(dy > 0 ? "down" : "up")
    }

    touchStartRef.current = null
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="text-5xl font-bold mb-8 text-indigo-800 tracking-wide">2048</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between w-full max-w-md mb-6">
          <div className="bg-indigo-100 rounded-lg p-3">
            <p className="text-sm text-indigo-800 font-semibold">Score</p>
            <motion.p
              key={score}
              initial={{ scale: 1.2, color: "#4CAF50" }}
              animate={{ scale: 1, color: "#1F2937" }}
              className="text-2xl font-bold text-indigo-900"
            >
              {score}
            </motion.p>
          </div>
          <div className="bg-indigo-100 rounded-lg p-3">
            <p className="text-sm text-indigo-800 font-semibold">Best</p>
            <motion.p
              key={bestScore}
              initial={{ scale: 1.2, color: "#4CAF50" }}
              animate={{ scale: 1, color: "#1F2937" }}
              className="text-2xl font-bold text-indigo-900"
            >
              {bestScore}
            </motion.p>
          </div>
        </div>
        <Board board={board} mergedTiles={mergedTiles} />
      </div>
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-xl text-center shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-indigo-800">Game Over!</h2>
              <button
                onClick={resetGame}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}