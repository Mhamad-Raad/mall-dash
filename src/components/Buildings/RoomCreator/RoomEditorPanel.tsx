import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Copy, RotateCw, DoorOpen } from 'lucide-react';
import { getRoomConfig } from './types';
import type { Room, Door } from './types';

interface RoomEditorPanelProps {
  selectedRoom: Room | undefined;
  selectedDoor: Door | undefined;
  rooms: Room[];
  overlappingRoomIds: Set<string>;
  onUpdateRoomName: (id: string, name: string) => void;
  onResizeRoom: (id: string, width: number, height: number) => void;
  onDuplicateRoom: (id: string) => void;
  onRotateRoom: (id: string) => void;
  onDeleteRoom: (id: string) => void;
  onUpdateDoorWidth: (id: string, width: number) => void;
  onDeleteDoor: (id: string) => void;
}

export const RoomEditorPanel = ({
  selectedRoom,
  selectedDoor,
  rooms,
  overlappingRoomIds,
  onUpdateRoomName,
  onResizeRoom,
  onDuplicateRoom,
  onRotateRoom,
  onDeleteRoom,
  onUpdateDoorWidth,
  onDeleteDoor,
}: RoomEditorPanelProps) => {
  if (selectedRoom) {
    return (
      <div className='p-3 bg-muted/30 rounded-lg border space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div
              className='w-3 h-3 rounded'
              style={{ backgroundColor: overlappingRoomIds.has(selectedRoom.id) ? '#ef4444' : getRoomConfig(selectedRoom.type).color }}
            />
            <span className='font-medium text-sm'>Edit Room</span>
          </div>
          {overlappingRoomIds.has(selectedRoom.id) && (
            <AlertTriangle className='w-4 h-4 text-amber-500' />
          )}
        </div>
        
        <div className='space-y-2'>
          <div>
            <Label className='text-xs text-muted-foreground'>Name</Label>
            <Input
              value={selectedRoom.name}
              onChange={(e) => onUpdateRoomName(selectedRoom.id, e.target.value)}
              className='mt-1 h-8 text-sm'
            />
          </div>
          <div>
            <Label className='text-xs text-muted-foreground'>Size (m)</Label>
            <div className='flex gap-1.5 mt-1 items-center'>
              <Input
                type='number'
                min={0.5}
                max={50}
                step={0.01}
                value={selectedRoom.width}
                onChange={(e) =>
                  onResizeRoom(
                    selectedRoom.id,
                    parseFloat(e.target.value) || 0.5,
                    selectedRoom.height
                  )
                }
                className='w-16 h-8 text-sm'
              />
              <span className='text-muted-foreground text-xs'>×</span>
              <Input
                type='number'
                min={0.5}
                max={50}
                step={0.01}
                value={selectedRoom.height}
                onChange={(e) =>
                  onResizeRoom(
                    selectedRoom.id,
                    selectedRoom.width,
                    parseFloat(e.target.value) || 0.5
                  )
                }
                className='w-16 h-8 text-sm'
              />
            </div>
            <div className='mt-1 text-xs text-muted-foreground'>
              Area: <span className='font-medium text-foreground'>{(selectedRoom.width * selectedRoom.height).toFixed(2)} m²</span>
            </div>
          </div>
          
          <div className='flex gap-1.5'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1 h-7 text-xs'
              onClick={() => onDuplicateRoom(selectedRoom.id)}
              title='Duplicate'
            >
              <Copy className='w-3 h-3 mr-1' />
              Copy
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='flex-1 h-7 text-xs'
              onClick={() => onRotateRoom(selectedRoom.id)}
              title='Rotate'
            >
              <RotateCw className='w-3 h-3 mr-1' />
              Rotate
            </Button>
          </div>
          
          <Button
            variant='destructive'
            size='sm'
            className='w-full h-7 text-xs'
            onClick={() => onDeleteRoom(selectedRoom.id)}
          >
            Delete Room
          </Button>
        </div>
      </div>
    );
  }

  if (selectedDoor) {
    return (
      <div className='p-3 bg-muted/30 rounded-lg border space-y-3'>
        <div className='flex items-center gap-2'>
          <DoorOpen className='w-4 h-4 text-amber-500' />
          <span className='font-medium text-sm'>Edit Door</span>
        </div>
        
        <div className='space-y-2'>
          <div className='text-xs'>
            <span className='text-muted-foreground'>Connects:</span>
            <div className='mt-1 space-y-0.5'>
              <div className='flex items-center gap-1.5'>
                <div
                  className='w-2 h-2 rounded'
                  style={{ backgroundColor: getRoomConfig(rooms.find(r => r.id === selectedDoor.roomId)?.type || 'bedroom').color }}
                />
                <span className='truncate'>{rooms.find(r => r.id === selectedDoor.roomId)?.name}</span>
              </div>
              {selectedDoor.connectedRoomId && (
                <div className='flex items-center gap-1.5'>
                  <div
                    className='w-2 h-2 rounded'
                    style={{ backgroundColor: getRoomConfig(rooms.find(r => r.id === selectedDoor.connectedRoomId)?.type || 'bedroom').color }}
                  />
                  <span className='truncate'>{rooms.find(r => r.id === selectedDoor.connectedRoomId)?.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label className='text-xs text-muted-foreground'>Width (m)</Label>
            <Input
              type='number'
              min={0.6}
              max={2}
              step={0.1}
              value={selectedDoor.width}
              onChange={(e) => {
                const newWidth = parseFloat(e.target.value) || 0.9;
                onUpdateDoorWidth(selectedDoor.id, Math.max(0.6, Math.min(2, newWidth)));
              }}
              className='mt-1 w-20 h-8 text-sm'
            />
          </div>
          
          <Button
            variant='destructive'
            size='sm'
            className='w-full h-7 text-xs'
            onClick={() => onDeleteDoor(selectedDoor.id)}
          >
            Delete Door
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-3 bg-muted/20 rounded-lg border border-dashed text-center text-muted-foreground'>
      <p className='text-xs'>Click a room to edit</p>
      <p className='text-[10px] mt-0.5'>or drag to reposition</p>
    </div>
  );
};
