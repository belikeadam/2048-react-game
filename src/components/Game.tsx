'use client'

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Grid from "./Grid";
import ScoreBox from "./ScoreBox";
import PowerUps from "./PowerUps";
import Footer from "./Footer";
import { useGame } from "../hooks/useGame";
import { Moon, Sun } from "lucide-react";
import type React from "react";
import { Position, BoardType } from "../../types";  

const SWIPE_THRESHOLD = 50;
const SWIPE_ANGLE_THRESHOLD = 30;

const Game = () => {
  const { board, score, bestScore, move, isGameOver, resetGame, mergedTiles, setBoard } = useGame();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isProcessingTouch = useRef(false);
  const touchDebounceTime = 100;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [timer, setTimer] = useState(300);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [moveHistory, setMoveHistory] = useState<number[][][]>([]);
  const [isSwapMode, setIsSwapMode] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);
  const [hintDirection, setHintDirection] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme ? JSON.parse(savedTheme) : systemPrefersDark);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isMounted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        move(e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  useEffect(() => {
    const gameContainer = document.getElementById('game-container');
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || isProcessingTouch.current) return;
      
      isProcessingTouch.current = true;
      
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const dx = touchEnd.x - touchStartRef.current.x;
      const dy = touchEnd.y - touchStartRef.current.y;
      const angle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);

      if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
        if (angle < SWIPE_ANGLE_THRESHOLD || angle > 180 - SWIPE_ANGLE_THRESHOLD) {
          move(dx > 0 ? "right" : "left");
        } else if (Math.abs(angle - 90) < SWIPE_ANGLE_THRESHOLD) {
          move(dy > 0 ? "down" : "up");
        }
      }

      touchStartRef.current = null;
      
      setTimeout(() => {
        isProcessingTouch.current = false;
      }, touchDebounceTime);
    };

    if (gameContainer) {
      gameContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      gameContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      if (gameContainer) {
        gameContainer.removeEventListener('touchstart', handleTouchStart);
        gameContainer.removeEventListener('touchmove', handleTouchMove);
        gameContainer.removeEventListener('touchend', handleTouchEnd);
        document.body.style.overflow = 'auto';
      }
    };
  }, [move]);

  useEffect(() => {
    if (board) {
      setMoveHistory(prev => [...prev, board]);
    }
  }, [board]);

  const handleUndo = () => {
    if (moveHistory.length > 1) {
      const previousBoard = moveHistory[moveHistory.length - 2];
      setBoard(previousBoard);
      setMoveHistory(prev => prev.slice(0, -1));
    }
  };

  const handleShuffle = () => {
    const flatBoard = board.flat().filter(value => value !== 0);
    const shuffled = [...flatBoard].sort(() => Math.random() - 0.5);
    let index = 0;
    const newBoard = board.map(row =>
      row.map(cell => (cell !== 0 ? shuffled[index++] : 0))
    );
    setBoard(newBoard);
  };

  const handleTileSwap = () => {
    setIsSwapMode(true);
  };

  const handleTileClick = (row: number, col: number) => {
    if (!isSwapMode) return;

    if (!selectedTile) {
      setSelectedTile({ row, col });
    } else {
      const newBoard = [...board];
      const { row: row1, col: col1 } = selectedTile;
      [newBoard[row][col], newBoard[row1][col1]] = [newBoard[row1][col1], newBoard[row][col]];
      
      setBoard(newBoard);
      setIsSwapMode(false);
      setSelectedTile(null);
    }
  };

  const calculateBestMove = (board: BoardType): string => {
    const directions = ['up', 'right', 'down', 'left'];
    let bestScore = -1;
    let bestMove = 'up';

    directions.forEach(direction => {
      const { score } = simulateMove(board, direction);
      if (score > bestScore) {
        bestScore = score;
        bestMove = direction;
      }
    });

    return bestMove;
  };

  const simulateMove = (board: BoardType, direction: string) => {
    const newBoard = board.map(row => [...row]);
    let score = 0;

    const moveAndMerge = (i: number, j: number, di: number, dj: number) => {
      if (!newBoard[i][j]) return;
      let newI = i + di;
      let newJ = j + dj;
      
      while (
        newI >= 0 && newI < 4 && 
        newJ >= 0 && newJ < 4 && 
        !newBoard[newI][newJ]
      ) {
        newI += di;
        newJ += dj;
      }
      
      if (
        newI >= 0 && newI < 4 && 
        newJ >= 0 && newJ < 4 && 
        newBoard[newI][newJ] === newBoard[i][j]
      ) {
        score++;
      }
    };

    switch (direction) {
      case 'up':
        for (let i = 1; i < 4; i++) 
          for (let j = 0; j < 4; j++) 
            moveAndMerge(i, j, -1, 0);
        break;
      case 'down':
        for (let i = 2; i >= 0; i--) 
          for (let j = 0; j < 4; j++) 
            moveAndMerge(i, j, 1, 0);
        break;
      case 'left':
        for (let i = 0; i < 4; i++) 
          for (let j = 1; j < 4; j++) 
            moveAndMerge(i, j, 0, -1);
        break;
      case 'right':
        for (let i = 0; i < 4; i++) 
          for (let j = 2; j >= 0; j--) 
            moveAndMerge(i, j, 0, 1);
        break;
    }

    return { board: newBoard, score };
  };

  const handleHint = () => {
    const bestMove = calculateBestMove(board);
    setHintDirection(bestMove);
    setTimeout(() => setHintDirection(null), 1000);
  };

  const handleTimedMode = () => {
    setIsTimedMode(!isTimedMode);
    if (!isTimedMode) {
      setTimer(300); // 5 minutes
    }
  };

  return (
    <div
      id="game-container"
      className={`game-container flex flex-col items-center justify-center min-h-screen transition-colors duration-300 
        ${isDarkMode ? 'dark bg-background' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}
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
        <Grid 
          grid={board}
          onTileClick={handleTileClick}
          swapMode={isSwapMode}
          selectedTile={selectedTile}
          hintDirection={hintDirection}
        />
      </div>
      
      <PowerUps
        onUndo={handleUndo}
        onShuffle={handleShuffle}
        onTileSwap={handleTileSwap}
        onHint={handleHint}
        onTimedMode={handleTimedMode}
        score={score}
        timer={timer}
        isTimedMode={isTimedMode}
        moveHistory={moveHistory.length}
      />

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

      <Footer />
    </div>
  );
};

export default Game;