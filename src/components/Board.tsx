import Tile from "./Tile";
import type { BoardType, CellValue } from "@/types/game";

interface BoardProps {
  board: BoardType;
  mergedTiles: { [key: string]: boolean };
  isDark?: boolean;  // Add isDark prop
}

export default function Board({ board, mergedTiles, isDark }: BoardProps) {
  return (
    <div className={`relative w-[314px] h-[314px] rounded-lg p-[2px] ${
      isDark ? 'bg-gray-700' : 'bg-indigo-200'
    }`}>
      {/* Background grid */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-[2px] p-[2px]">
        {Array.from({ length: 16 }).map((_, index) => (
          <div 
            key={`grid-${index}`} 
            className={`rounded-md ${
              isDark ? 'bg-gray-600' : 'bg-indigo-300'
            }`}
          />
        ))}
      </div>
      {/* Tiles */}
      {board.flat().map((value: CellValue, index) => {
        const x = index % 4;
        const y = Math.floor(index / 4);
        const key = `${x}-${y}`;
        return (
          <Tile 
            key={key} 
            value={value ?? 0} 
            position={{ x, y }} 
            merged={mergedTiles[key] || false} 
            isDark={isDark}
          />
        );
      })}
    </div>
  );
}