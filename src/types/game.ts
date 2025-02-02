export type CellValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | null;

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