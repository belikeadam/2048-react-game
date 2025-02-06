import React, { memo } from 'react';
import Tile from './Tile';
import { Position  } from "../../types";  

interface GridProps {
  grid: number[][];
  onTileClick: (row: number, col: number) => void;
  swapMode: boolean;
  selectedTile: Position | null;
  hintDirection: string | null;
}

const Grid: React.FC<GridProps> = memo(({ grid, onTileClick, swapMode, selectedTile, hintDirection }) => {
  return (
    <div className="grid-container">
      <div className="grid-bg">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={`cell-${i}`} className="grid-cell" />
        ))}
      </div>
      <div className="relative w-full h-full">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid-row">
            {row.map((value, colIndex) => (
              value !== 0 && (
                <Tile
                  key={`tile-${rowIndex}-${colIndex}-${value}`}
                  value={value}
                  position={{ row: rowIndex, col: colIndex }}
                  onClick={() => onTileClick(rowIndex, colIndex)}
                  swapMode={swapMode}
                  selected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
                  hintDirection={hintDirection}
                />
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid;