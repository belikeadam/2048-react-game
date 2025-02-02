"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Board from "./Board"
import ScoreBox from "./ScoreBox"
import { useGame } from "../hooks/useGame"
import { Moon, Sun } from "lucide-react"
import type React from "react"

const SWIPE_THRESHOLD = 50 // Minimum swipe distance
const SWIPE_ANGLE_THRESHOLD = 30 // Maximum angle deviation for swipe direction

export default function Game() {
  const { board, score, bestScore, move, isGameOver, resetGame, mergedTiles } = useGame()
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isProcessingTouch = useRef(false)
  const touchDebounceTime = 100 // ms
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode')
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

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

  useEffect(() => {
    const gameContainer = document.getElementById('game-container')
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || isProcessingTouch.current) return
      
      isProcessingTouch.current = true
      
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }

      const dx = touchEnd.x - touchStartRef.current.x
      const dy = touchEnd.y - touchStartRef.current.y
      const angle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI)

      if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
        if (angle < SWIPE_ANGLE_THRESHOLD || angle > 180 - SWIPE_ANGLE_THRESHOLD) {
          move(dx > 0 ? "right" : "left")
        } else if (Math.abs(angle - 90) < SWIPE_ANGLE_THRESHOLD) {
          move(dy > 0 ? "down" : "up")
        }
      }

      touchStartRef.current = null
      
      setTimeout(() => {
        isProcessingTouch.current = false
      }, touchDebounceTime)
    }

    if (gameContainer) {
      gameContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
      gameContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
      gameContainer.addEventListener('touchend', handleTouchEnd, { passive: true })
      
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      if (gameContainer) {
        gameContainer.removeEventListener('touchstart', handleTouchStart)
        gameContainer.removeEventListener('touchmove', handleTouchMove)
        gameContainer.removeEventListener('touchend', handleTouchEnd)
        document.body.style.overflow = 'auto'
      }
    }
  }, [move])

  // React touch event handlers (for the div element)
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
  }

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
  }

  return (
    <div
      id="game-container"
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 
        ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between w-full max-w-md mb-8 px-4">
        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-900'} tracking-tight`}>
          2048
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-800 text-yellow-500' : 'bg-indigo-100 text-indigo-900'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className={`rounded-xl shadow-lg p-6 mb-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
          <ScoreBox label="SCORE" value={score} isDark={isDarkMode} />
          <ScoreBox label="BEST" value={bestScore} isDark={isDarkMode} />
        </div>
        <Board board={board} mergedTiles={mergedTiles} isDark={isDarkMode} />
      </div>
      
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center will-change-transform will-change-opacity"
          >
            <motion.div
              initial={{ transform: 'scale(0.8) translateY(20px)', opacity: 0 }}
              animate={{ transform: 'scale(1) translateY(0)', opacity: 1 }}
              exit={{ transform: 'scale(0.8) translateY(20px)', opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-8 rounded-xl text-center shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-indigo-800'}`}
            >
              <h2 className="text-3xl font-bold mb-6">Game Over!</h2>
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