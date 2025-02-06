import React from 'react';
import Tile from './Tile';
import { Position, BoardType } from "../../types";  

interface GridProps {
  grid: number[][];
  onTileClick: (row: number, col: number) => void;
  swapMode: boolean;
  selectedTile: Position | null;
  hintDirection: string | null;
}

const Grid: React.FC<GridProps> = ({ grid, onTileClick, swapMode, selectedTile, hintDirection }) => {
  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((value, colIndex) => (
            <Tile
              key={colIndex}
              value={value}
              position={{ row: rowIndex, col: colIndex }}
              onClick={() => onTileClick(rowIndex, colIndex)}
              swapMode={swapMode}
              selected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
              hintDirection={hintDirection}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;