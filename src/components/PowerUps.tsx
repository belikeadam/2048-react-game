'use client'

import React, { useState, useEffect } from 'react';
import { RotateCcw, Shuffle, ArrowLeftRight, Lightbulb, Timer } from 'lucide-react';

interface PowerUpsProps {
  onUndo: () => void;
  onShuffle: () => void;
  onTileSwap: () => void;
  onHint: () => void;
  onTimedMode: () => void;
  score: number;
  timer: number;
  isTimedMode: boolean;
  moveHistory: number;
}

const PowerUps: React.FC<PowerUpsProps> = ({
  onUndo,
  onShuffle,
  onTileSwap,
  onHint,
  onTimedMode,
  score,
  timer,
  isTimedMode,
  moveHistory
}) => {
  // Initialize state after component mounts
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [undosLeft, setUndosLeft] = useState(0);
  const [shufflesLeft, setShufflesLeft] = useState(0);
  const [swapsLeft, setSwapsLeft] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(0);
  const [cooldowns, setCooldowns] = useState({
    undo: 0,
    shuffle: 0,
    swap: 0,
    hint: 0
  });

  // Initialize state after component mounts
  useEffect(() => {
    setMounted(true);
    setTimeLeft(timer);
    setUndosLeft(1);
    setShufflesLeft(2); 
    setSwapsLeft(1);
    setHintsLeft(3);
  }, [timer]);

  // Reset power-ups when score reaches thresholds
  useEffect(() => {
    if (!mounted) return;
    
    if (score >= 500 && undosLeft === 0) setUndosLeft(1);
    if (score >= 1000 && shufflesLeft === 0) setShufflesLeft(1);
    if (score >= 1500 && swapsLeft === 0) setSwapsLeft(1);
    if (score >= 2000 && hintsLeft === 0) setHintsLeft(1);
  }, [score, mounted, undosLeft, shufflesLeft, swapsLeft, hintsLeft]);

  // Timer logic
  useEffect(() => {
    if (!mounted) return;
    
    if (isTimedMode && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && isTimedMode) {
      onTimedMode();
    }
  }, [timeLeft, isTimedMode, onTimedMode, mounted]);

  // Cooldown timer
  useEffect(() => {
    if (!mounted) return;
    
    const cooldownTimer = setInterval(() => {
      setCooldowns(prev => ({
        undo: Math.max(0, prev.undo - 1),
        shuffle: Math.max(0, prev.shuffle - 1),
        swap: Math.max(0, prev.swap - 1),
        hint: Math.max(0, prev.hint - 1)
      }));
    }, 1000);

    return () => clearInterval(cooldownTimer);
  }, [mounted]);

  const handlePowerUp = (type: 'undo' | 'shuffle' | 'swap' | 'hint') => {
    if (cooldowns[type] > 0) return;

    switch (type) {
      case 'undo':
        if (undosLeft > 0) {
          setUndosLeft(prev => prev - 1);
          setCooldowns(prev => ({ ...prev, undo: 30 }));
          onUndo();
        }
        break;
      case 'shuffle':
        if (shufflesLeft > 0) {
          setShufflesLeft(prev => prev - 1);
          setCooldowns(prev => ({ ...prev, shuffle: 45 }));
          onShuffle();
        }
        break;
      case 'swap':
        if (swapsLeft > 0) {
          setSwapsLeft(prev => prev - 1);
          setCooldowns(prev => ({ ...prev, swap: 60 }));
          onTileSwap();
        }
        break;
      case 'hint':
        if (hintsLeft > 0) {
          setHintsLeft(prev => prev - 1);
          setCooldowns(prev => ({ ...prev, hint: 20 }));
          onHint();
        }
        break;
    }
  };

  // Only render after component is mounted
  if (!mounted) return null;

  // Update undo availability check
  const canUndo = moveHistory > 1 && undosLeft > 0;

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="flex gap-2">
        <button
          onClick={() => handlePowerUp('undo')}
          disabled={!canUndo || cooldowns.undo > 0}
          className={`power-up-button ${!canUndo ? 'opacity-50' : ''}`}
          title={`Undo: Reverts the last move. (${undosLeft} left)`}
        >
          <RotateCcw className="w-5 h-5" />
          {cooldowns.undo > 0 && <span className="cooldown">{cooldowns.undo}s</span>}
        </button>
        
        <button
          onClick={() => handlePowerUp('shuffle')}
          disabled={shufflesLeft === 0 || cooldowns.shuffle > 0}
          className={`power-up-button ${shufflesLeft === 0 ? 'opacity-50' : ''}`}
          title={`Shuffle: Randomizes the board tiles. (${shufflesLeft} left)`}
        >
          <Shuffle className="w-5 h-5" />
          {cooldowns.shuffle > 0 && <span className="cooldown">{cooldowns.shuffle}s</span>}
        </button>
        
        <button
          onClick={() => handlePowerUp('swap')}
          disabled={swapsLeft === 0 || cooldowns.swap > 0}
          className={`power-up-button ${swapsLeft === 0 ? 'opacity-50' : ''}`}
          title={`Swap: Allows you to swap two tiles. (${swapsLeft} left)`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          {cooldowns.swap > 0 && <span className="cooldown">{cooldowns.swap}s</span>}
        </button>
        
        <button
          onClick={() => handlePowerUp('hint')}
          disabled={hintsLeft === 0 || cooldowns.hint > 0}
          className={`power-up-button ${hintsLeft === 0 ? 'opacity-50' : ''}`}
          title={`Hint: Shows the best move. (${hintsLeft} left)`}
        >
          <Lightbulb className="w-5 h-5" />
          {cooldowns.hint > 0 && <span className="cooldown">{cooldowns.hint}s</span>}
        </button>
      </div>

      {isTimedMode && (
        <div className="timer-container">
          <Timer className="w-4 h-4" />
          <span>{timeLeft}s</span>
        </div>
      )}

      <style jsx>{`
        .power-up-button {
          @apply relative flex items-center justify-center p-3 rounded-lg bg-primary text-primary-foreground
                 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
        }
        
        .cooldown {
          @apply absolute -top-2 -right-2 text-xs bg-secondary text-secondary-foreground
                 rounded-full w-6 h-6 flex items-center justify-center;
        }
        
        .timer-container {
          @apply flex items-center gap-2 text-lg font-semibold text-foreground;
        }
      `}</style>
    </div>
  );
};

export default PowerUps;