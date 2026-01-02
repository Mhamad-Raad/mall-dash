import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  RotateCw, 
  Copy, 
  Trash2, 
  Move,
  Maximize2,
  Type
} from 'lucide-react';
import type { DroppedRoom } from './types';
import { ROOM_TEMPLATES, MIN_ROOM_SIZE, MAX_ROOM_SIZE } from './types';

interface RoomPropertiesPanelProps {
  rooms: DroppedRoom[];
  doors: number;
  selectedRoom: DroppedRoom | null;
  onUpdateRoom: (id: string, updates: Partial<DroppedRoom>) => void;
  onRotateRoom: (id: string) => void;
  onDuplicateRoom: (id: string) => void;
  onDeleteRoom: (id: string) => void;
}

export function RoomSummaryPanel({
  rooms,
  doors,
  selectedRoom,
  onUpdateRoom,
  onRotateRoom,
  onDuplicateRoom,
  onDeleteRoom,
}: RoomPropertiesPanelProps) {
  // Count rooms by type
  const roomCounts = ROOM_TEMPLATES.map((template) => ({
    ...template,
    count: rooms.filter((r) => r.type === template.type).length,
  })).filter((t) => t.count > 0);

  const totalArea = rooms.reduce((sum, r) => sum + r.width * r.height, 0);

  const handleNameChange = (value: string) => {
    if (selectedRoom) {
      onUpdateRoom(selectedRoom.id, { name: value });
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    if (!selectedRoom) return;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    const clampedValue = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, numValue));
    onUpdateRoom(selectedRoom.id, { [dimension]: clampedValue });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    if (!selectedRoom) return;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    onUpdateRoom(selectedRoom.id, { [axis]: Math.max(0, numValue) });
  };

  return (
    <div className="w-64 shrink-0 border-l overflow-auto bg-background flex flex-col">
      {/* Selected Room Editor */}
      {selectedRoom ? (
        <div className="p-4 space-y-4">
          {/* Room Type Header */}
          <div className="flex items-center gap-2">
            {(() => {
              const template = ROOM_TEMPLATES.find(t => t.type === selectedRoom.type);
              const Icon = template?.icon;
              return Icon ? (
                <Icon className="w-5 h-5" style={{ color: selectedRoom.borderColor }} />
              ) : null;
            })()}
            <span className="font-semibold" style={{ color: selectedRoom.borderColor }}>
              {ROOM_TEMPLATES.find(t => t.type === selectedRoom.type)?.name || 'Room'}
            </span>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Type className="w-3 h-3" />
              Name
            </Label>
            <Input
              value={selectedRoom.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Dimensions */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3" />
              Dimensions (m)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Width</Label>
                <Input
                  type="number"
                  min={MIN_ROOM_SIZE}
                  max={MAX_ROOM_SIZE}
                  step={0.1}
                  value={selectedRoom.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Height</Label>
                <Input
                  type="number"
                  min={MIN_ROOM_SIZE}
                  max={MAX_ROOM_SIZE}
                  step={0.1}
                  value={selectedRoom.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Move className="w-3 h-3" />
              Position (m)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">X</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={selectedRoom.x}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Y</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={selectedRoom.y}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Area Display */}
          <div className="p-2 bg-muted/50 rounded-md text-center">
            <span className="text-xs text-muted-foreground">Area: </span>
            <span className="text-sm font-semibold tabular-nums">
              {(selectedRoom.width * selectedRoom.height).toFixed(3)} m²
            </span>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Actions</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex-col gap-1"
                onClick={() => onRotateRoom(selectedRoom.id)}
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-[10px]">Rotate</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex-col gap-1"
                onClick={() => onDuplicateRoom(selectedRoom.id)}
              >
                <Copy className="w-4 h-4" />
                <span className="text-[10px]">Clone</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex-col gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDeleteRoom(selectedRoom.id)}
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-[10px]">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Instruction */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>Click a room to edit</p>
            <p className="text-xs mt-1">or drag edges to resize</p>
          </div>
        </div>
      )}

      <Separator />

      {/* Room Summary - Always visible */}
      <div className="p-4 space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Room Summary</h3>
            <span className="text-xs text-muted-foreground">{rooms.length} rooms</span>
          </div>
          <div className="space-y-1.5">
            {roomCounts.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.type}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: template.borderColor }} />
                    <span>{template.name}</span>
                  </div>
                  <span className="text-muted-foreground">{template.count}</span>
                </div>
              );
            })}
            {doors > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Doors</span>
                </div>
                <span className="text-muted-foreground">{doors}</span>
              </div>
            )}
            {roomCounts.length === 0 && doors === 0 && (
              <p className="text-xs text-muted-foreground">No rooms added yet</p>
            )}
          </div>
        </div>

        {rooms.length > 0 && (
          <div className="p-2 bg-muted/50 rounded-md text-center">
            <span className="text-xs text-muted-foreground">Total Area: </span>
            <span className="text-sm font-semibold tabular-nums">
              {totalArea.toFixed(2)} m²
            </span>
          </div>
        )}

        <Separator />

        {/* Keyboard Shortcuts */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Shortcuts</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duplicate</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl+D</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rotate</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">R</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delete</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Del</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
