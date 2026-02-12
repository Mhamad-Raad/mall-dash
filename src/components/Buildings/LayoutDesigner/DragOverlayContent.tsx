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
  const Icon = template?.icon;

  return (
    <div
      className="relative rounded-md border bg-background/[0.06] backdrop-blur-sm flex flex-col items-center justify-center gap-1 shadow-lg"
      style={{
        width: room.width * cellSize,
        height: room.height * cellSize,
        borderColor: borderColor,
      }}
    >
      {Icon && <Icon className="w-4 h-4 opacity-90" style={{ color: borderColor }} />}
      <span 
        className="text-[11px] font-semibold text-center px-1 truncate max-w-full leading-none"
        style={{ color: borderColor }}
      >
        {room.name}
      </span>
      <span 
        className="absolute bottom-1 right-1 text-[10px] opacity-80 tabular-nums"
        style={{ color: borderColor }}
      >
        {area.toFixed(3)}m²
      </span>
    </div>
  );
}
