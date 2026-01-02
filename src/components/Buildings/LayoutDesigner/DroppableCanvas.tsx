import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { GRID_CELL_SIZE } from './types';

interface DroppableCanvasProps {
  children: React.ReactNode;
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  showGrid: boolean;
  onCanvasClick: () => void;
}

export function DroppableCanvas({
  children,
  gridSize,
  canvasWidth,
  canvasHeight,
  showGrid,
  onCanvasClick,
}: DroppableCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const cellSize = GRID_CELL_SIZE * gridSize;
  const pixelWidth = canvasWidth * cellSize;
  const pixelHeight = canvasHeight * cellSize;

  return (
    <div
      ref={setNodeRef}
      onClick={onCanvasClick}
      data-droppable="canvas"
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary/50'
      )}
      style={{
        width: pixelWidth,
        height: pixelHeight,
        backgroundColor: 'transparent',
        backgroundImage: showGrid
          ? `
            linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
          `
          : 'none',
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    >
      {children}
    </div>
  );
}
