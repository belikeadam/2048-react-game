'use client'

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Board from "./Board"
import ScoreBox from "./ScoreBox"
import { useGame } from "../hooks/useGame"
import { Moon, Sun } from "lucide-react"
import type React from "react"

const SWIPE_THRESHOLD = 50 // Minimum swipe distance
const SWIPE_ANGLE_THRESHOLD = 30 // Maximum angle deviation for swipe direction

const Game = () => {
  const { board, score, bestScore, move, isGameOver, resetGame, mergedTiles } = useGame()
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isProcessingTouch = useRef(false)
  const touchDebounceTime = 100 // ms
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('darkMode')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(savedTheme ? JSON.parse(savedTheme) : systemPrefersDark)
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode, isMounted])

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
      className={`game-container flex flex-col items-center justify-center min-h-screen transition-colors duration-300 
        ${isDarkMode ? 'dark bg-background' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between w-full max-w-md mb-8 px-4">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">
          2048
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-secondary text-secondary-foreground"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <div className="rounded-xl shadow-lg p-6 mb-8 bg-card text-card-foreground">
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
              className="p-8 rounded-xl text-center shadow-2xl bg-card text-card-foreground"
            >
              <h2 className="text-3xl font-bold mb-6">Game Over!</h2>
              <button
                onClick={resetGame}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 text-sm text-muted-foreground flex items-center gap-2">
        <span>Made with ❤️ by</span>
        <a 
          href="https://github.com/belikeadam" 
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          @belikeadam
          <svg 
            viewBox="0 0 24 24" 
            height="16" 
            width="16" 
            className="inline"
            fill="currentColor"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
      </footer>
    </div>
  )
}

export default Game