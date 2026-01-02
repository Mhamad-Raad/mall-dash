import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES } from './types';

interface DragOverlayContentProps {
  room: DroppedRoom;
  gridSize: number;
}

export function DragOverlayContent({ room, gridSize }: DragOverlayContentProps) {
  const cellSize = GRID_CELL_SIZE * gridSize;
  const template = ROOM_TEMPLATES.find((t) => t.type === room.type);
  const borderColor = room.borderColor || template?.borderColor || '#666';
  const area = room.width * room.height;

  return (
    <div
      className="rounded-sm border-2 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-0.5 shadow-xl"
      style={{
        width: room.width * cellSize,
        height: room.height * cellSize,
        borderColor: borderColor,
      }}
    >
      <span className="text-base opacity-80" style={{ color: borderColor }}>
        {template?.icon || '📦'}
      </span>
      <span 
        className="text-[10px] font-medium text-center px-1 truncate max-w-full"
        style={{ color: borderColor }}
      >
        {room.name}
      </span>
      <span 
        className="absolute bottom-1 right-1 text-[9px] opacity-70"
        style={{ color: borderColor }}
      >
        {area.toFixed(3)}m²
      </span>
    </div>
  );
}
