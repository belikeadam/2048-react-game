import { useState, useCallback, useEffect } from "react";
import { createEmptyBoard, addRandomTile, moveBoard, isGameOver } from "../../utils/gameLogic";
import type { BoardType, Direction } from "../../types";

export function useGame(size = 4) {
  const [board, setBoard] = useState<BoardType>(() => {
    const newBoard = createEmptyBoard(size);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [mergedTiles, setMergedTiles] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const savedBestScore = localStorage.getItem("bestScore");
    if (savedBestScore) {
      setBestScore(Number.parseInt(savedBestScore, 10));
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("bestScore", score.toString());
    }
  }, [score, bestScore]);

  const move = useCallback((direction: Direction) => {
    setBoard((currentBoard: BoardType) => {
      const { newBoard, scoreIncrease, mergedPositions } = moveBoard(currentBoard, direction);
      if (JSON.stringify(newBoard) !== JSON.stringify(currentBoard)) {
        setScore((prevScore) => prevScore + scoreIncrease);
        setMergedTiles(mergedPositions);

        setTimeout(() => {
          setBoard((prevBoard: BoardType) => {
            const boardWithNewTile = prevBoard.map((row: number[]) => [...row]);
            addRandomTile(boardWithNewTile);
            return boardWithNewTile;
          });
        }, 100); // Reduced from 150

        setTimeout(() => {
          setMergedTiles({});
        }, 200); // Reduced from 250
      }
      return newBoard;
    });
  }, []);

  const resetGame = useCallback(() => {
    const newBoard = createEmptyBoard(size);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setMergedTiles({});
  }, [size]);

  return {
    board,
    setBoard,
    score,
    bestScore,
    move,
    isGameOver: isGameOver(board),
    resetGame,
    mergedTiles,
  };
}