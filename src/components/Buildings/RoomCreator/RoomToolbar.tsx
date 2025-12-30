import {
  Bed,
  Bath,
  CookingPot,
  Sofa,
  Utensils,
  Fence,
  Archive,
  Briefcase,
  Plus,
  MoveHorizontal,
  DoorOpen,
} from 'lucide-react';
import type { RoomType } from './types';
import { ROOM_TYPES } from './types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  bed: Bed,
  bath: Bath,
  'cooking-pot': CookingPot,
  sofa: Sofa,
  utensils: Utensils,
  fence: Fence,
  archive: Archive,
  briefcase: Briefcase,
  'move-horizontal': MoveHorizontal,
  'door-open': DoorOpen,
};

interface RoomToolbarProps {
  onAddRoom: (type: RoomType) => void;
  selectedType: RoomType | null;
  onSelectType: (type: RoomType | null) => void;
}

export const RoomToolbar = ({
  onAddRoom,
  selectedType,
  onSelectType,
}: RoomToolbarProps) => {
  return (
    <div className='flex flex-wrap gap-1.5'>
      <TooltipProvider delayDuration={100}>
        {ROOM_TYPES.map((roomType) => {
          const IconComponent = ICON_MAP[roomType.icon];
          const isSelected = selectedType === roomType.type;

          return (
            <Tooltip key={roomType.type}>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size='sm'
                  className={cn(
                    'h-8 px-2.5 gap-1.5 transition-all',
                    isSelected && 'ring-2 ring-offset-1'
                  )}
                  style={{
                    borderColor: isSelected ? roomType.color : undefined,
                    backgroundColor: isSelected ? roomType.color : undefined,
                  }}
                  onClick={() => {
                    if (isSelected) {
                      onAddRoom(roomType.type);
                    } else {
                      onSelectType(roomType.type);
                    }
                  }}
                >
                  {IconComponent && (
                    <div style={{ color: isSelected ? 'white' : roomType.color }}>
                      <IconComponent className='w-3.5 h-3.5' />
                    </div>
                  )}
                  <span
                    className='text-xs'
                    style={{ color: isSelected ? 'white' : undefined }}
                  >
                    {roomType.label}
                  </span>
                  {isSelected && <Plus className='w-3 h-3 text-white' />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isSelected
                    ? `Click to add ${roomType.label}`
                    : `Select ${roomType.label}`}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};
