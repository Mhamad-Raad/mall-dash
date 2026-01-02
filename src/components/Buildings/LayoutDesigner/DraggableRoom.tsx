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
        'rounded-sm border-2 bg-transparent cursor-grab active:cursor-grabbing',
        'flex flex-col items-center justify-center gap-0.5',
        'select-none touch-none',
        isDragging && 'shadow-xl opacity-80',
        isSelected && 'ring-2 ring-white/50'
      )}
    >
      {/* Room Icon */}
      <span className="text-base opacity-80" style={{ color: borderColor }}>
        {template?.icon || '📦'}
      </span>
      
      {/* Room Name */}
      <span 
        className="text-[10px] font-medium text-center px-1 truncate max-w-full"
        style={{ color: borderColor }}
      >
        {room.name}
      </span>

      {/* Area indicator - positioned at bottom right */}
      <span 
        className="absolute bottom-1 right-1 text-[9px] opacity-70"
        style={{ color: borderColor }}
      >
        {area.toFixed(3)}m²
      </span>
    </div>
  );
}
