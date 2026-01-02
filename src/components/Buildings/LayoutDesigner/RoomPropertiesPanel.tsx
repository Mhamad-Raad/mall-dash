import { useState, useEffect, useRef, useCallback } from 'react';
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

// Throttled input component - updates periodically during interaction, not just at end
function DebouncedNumberInput({
  value,
  onChange,
  min,
  max,
  step = 0.1,
  throttleMs = 150,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  throttleMs?: number;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(value.toString());
  const lastCommitTimeRef = useRef(0);
  const pendingCommitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommittedRef = useRef(value);

  // Sync local value when external value changes (from other sources like drag resize)
  useEffect(() => {
    if (value !== lastCommittedRef.current) {
      setLocalValue(value.toString());
      lastCommittedRef.current = value;
    }
  }, [value]);

  const commitValue = useCallback((strValue: string, force = false) => {
    const numValue = parseFloat(strValue);
    if (isNaN(numValue)) return;
    
    let clamped = numValue;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    
    const now = Date.now();
    const timeSinceLastCommit = now - lastCommitTimeRef.current;
    
    // Clear any pending commit
    if (pendingCommitRef.current) {
      clearTimeout(pendingCommitRef.current);
      pendingCommitRef.current = null;
    }
    
    // Throttle: only commit if enough time has passed, or if forced (on blur)
    if (force || timeSinceLastCommit >= throttleMs) {
      if (clamped !== lastCommittedRef.current) {
        lastCommittedRef.current = clamped;
        lastCommitTimeRef.current = now;
        onChange(clamped);
      }
    } else {
      // Schedule a commit for when the throttle period ends
      const remaining = throttleMs - timeSinceLastCommit;
      pendingCommitRef.current = setTimeout(() => {
        if (clamped !== lastCommittedRef.current) {
          lastCommittedRef.current = clamped;
          lastCommitTimeRef.current = Date.now();
          onChange(clamped);
        }
        pendingCommitRef.current = null;
      }, remaining);
    }
  }, [min, max, throttleMs, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    commitValue(newValue);
  };

  const handleBlur = () => {
    // Commit immediately on blur and sync display
    commitValue(localValue, true);
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue)) {
      let clamped = numValue;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      setLocalValue(clamped.toString());
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pendingCommitRef.current) {
        clearTimeout(pendingCommitRef.current);
      }
    };
  }, []);

  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`${className} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
    />
  );
}

// Debounced text input for name
function DebouncedTextInput({
  value,
  onChange,
  debounceMs = 300,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
      timeoutRef.current = null;
    }, debounceMs);
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onChange(localValue);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      type="text"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
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

  // Handlers that update parent state
  const handleNameChange = useCallback((value: string) => {
    if (selectedRoom) {
      onUpdateRoom(selectedRoom.id, { name: value });
    }
  }, [selectedRoom, onUpdateRoom]);

  const handleWidthChange = useCallback((value: number) => {
    if (selectedRoom) {
      onUpdateRoom(selectedRoom.id, { width: value });
    }
  }, [selectedRoom, onUpdateRoom]);

  const handleHeightChange = useCallback((value: number) => {
    if (selectedRoom) {
      onUpdateRoom(selectedRoom.id, { height: value });
    }
  }, [selectedRoom, onUpdateRoom]);

  const handleXChange = useCallback((value: number) => {
    if (selectedRoom) {
      onUpdateRoom(selectedRoom.id, { x: value });
    }
  }, [selectedRoom, onUpdateRoom]);

  const handleYChange = useCallback((value: number) => {
    if (selectedRoom) {
      onUpdateRoom(selectedRoom.id, { y: value });
    }
  }, [selectedRoom, onUpdateRoom]);

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
            <DebouncedTextInput
              value={selectedRoom.name}
              onChange={handleNameChange}
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
                <DebouncedNumberInput
                  min={MIN_ROOM_SIZE}
                  max={MAX_ROOM_SIZE}
                  step={0.25}
                  value={selectedRoom.width}
                  onChange={handleWidthChange}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Height</Label>
                <DebouncedNumberInput
                  min={MIN_ROOM_SIZE}
                  max={MAX_ROOM_SIZE}
                  step={0.25}
                  value={selectedRoom.height}
                  onChange={handleHeightChange}
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
                <DebouncedNumberInput
                  min={0}
                  step={0.25}
                  value={selectedRoom.x}
                  onChange={handleXChange}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Y</Label>
                <DebouncedNumberInput
                  min={0}
                  step={0.25}
                  value={selectedRoom.y}
                  onChange={handleYChange}
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
