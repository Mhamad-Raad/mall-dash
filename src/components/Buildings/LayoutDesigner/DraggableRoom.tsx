import { useDraggable } from '@dnd-kit/core';
import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES } from './types';
import { cn } from '@/lib/utils';

interface DraggableRoomProps {
  room: DroppedRoom;
  isSelected: boolean;
  onSelect: (id: string) => void;
  gridSize: number;
}

export function DraggableRoom({
  room,
  isSelected,
  onSelect,
  gridSize,
}: DraggableRoomProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: room.id,
    data: {
      type: 'room',
      room,
      isNew: false,
    },
  });

  const cellSize = GRID_CELL_SIZE * gridSize;
  const template = ROOM_TEMPLATES.find((t) => t.type === room.type);
  const borderColor = room.borderColor || template?.borderColor || '#666';
  
  // Calculate area in m²
  const area = room.width * room.height;

  const style = {
    position: 'absolute' as const,
    left: room.x * cellSize,
    top: room.y * cellSize,
    width: room.width * cellSize,
    height: room.height * cellSize,
    borderColor: borderColor,
    zIndex: isSelected ? 10 : 1,
    opacity: isDragging ? 0 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(room.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      className={cn(
        'relative rounded-md border cursor-grab active:cursor-grabbing',
        'bg-background/[0.06] backdrop-blur-sm',
        'flex flex-col items-center justify-center gap-1',
        'select-none touch-none transition',
        'hover:bg-background/[0.10] hover:shadow-md',
        isDragging && 'shadow-lg',
        isSelected && 'ring-2 ring-primary/40'
      )}
    >
      {/* Room Icon */}
      {template?.icon && (
        <template.icon className="w-4 h-4 opacity-90" style={{ color: borderColor }} />
      )}
      
      {/* Room Name */}
      <span 
        className="text-[11px] font-semibold text-center px-1 truncate max-w-full leading-none"
        style={{ color: borderColor }}
      >
        {room.name}
      </span>

      {/* Area indicator - positioned at bottom right */}
      <span 
        className="absolute bottom-1 right-1 text-[10px] opacity-80 tabular-nums"
        style={{ color: borderColor }}
      >
        {area.toFixed(3)}m²
      </span>
    </div>
  );
}
