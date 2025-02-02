export type CellValue = number | null;
export type BoardType = CellValue[][];
 

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface TileData {
  value: number;
  position: Position;
  isNew?: boolean;
  isMerged?: boolean;
}