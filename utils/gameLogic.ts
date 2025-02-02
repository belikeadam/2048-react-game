import type { BoardType, Direction } from "../types"

export function createEmptyBoard(size: number): BoardType {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(0))
}

export function addRandomTile(board: BoardType): void {
  const emptyTiles = board.flatMap((row, i) =>
    row.map((value, j) => (value === 0 ? [i, j] : null)).filter((val): val is [number, number] => val !== null),
  )
  if (emptyTiles.length > 0) {
    const [i, j] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
    board[i][j] = Math.random() < 0.9 ? 2 : 4
  }
}

export function moveBoard(
  board: BoardType,
  direction: Direction,
): { newBoard: BoardType; scoreIncrease: number; mergedPositions: { [key: string]: boolean } } {
  const size = board.length
  const newBoard = board.map((row) => [...row])
  let scoreIncrease = 0
  const mergedPositions: { [key: string]: boolean } = {}

  const moveAndMerge = (line: number[], rowOrCol: number, isRow: boolean): number[] => {
    const movedLine = line.filter((tile) => tile !== 0)
    for (let i = 0; i < movedLine.length - 1; i++) {
      if (movedLine[i] === movedLine[i + 1]) {
        movedLine[i] *= 2
        scoreIncrease += movedLine[i]
        movedLine.splice(i + 1, 1)
        const position = isRow ? `${rowOrCol}-${i}` : `${i}-${rowOrCol}`
        mergedPositions[position] = true
      }
    }
    while (movedLine.length < size) {
      movedLine.push(0)
    }
    return movedLine
  }

  if (direction === "left") {
    for (let i = 0; i < size; i++) {
      newBoard[i] = moveAndMerge(newBoard[i], i, true)
    }
  } else if (direction === "right") {
    for (let i = 0; i < size; i++) {
      newBoard[i] = moveAndMerge(newBoard[i].reverse(), i, true).reverse()
    }
  } else if (direction === "up") {
    for (let j = 0; j < size; j++) {
      let column = newBoard.map((row) => row[j])
      column = moveAndMerge(column, j, false)
      for (let i = 0; i < size; i++) {
        newBoard[i][j] = column[i]
      }
    }
  } else if (direction === "down") {
    for (let j = 0; j < size; j++) {
      let column = newBoard.map((row) => row[j]).reverse()
      column = moveAndMerge(column, j, false)
      column.reverse()
      for (let i = 0; i < size; i++) {
        newBoard[i][j] = column[i]
      }
    }
  }

  return { newBoard, scoreIncrease, mergedPositions }
}

export function isGameOver(board: BoardType): boolean {
  const directions: Direction[] = ["up", "down", "left", "right"]
  return directions.every((direction) => {
    const { newBoard } = moveBoard(board, direction)
    return JSON.stringify(newBoard) === JSON.stringify(board)
  })
}

