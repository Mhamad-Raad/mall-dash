import { Separator } from '@/components/ui/separator';
import type { DroppedRoom } from './types';
import { ROOM_TEMPLATES } from './types';

interface RoomSummaryPanelProps {
  rooms: DroppedRoom[];
  doors: number;
}

export function RoomSummaryPanel({
  rooms,
  doors,
}: RoomSummaryPanelProps) {
  // Count rooms by type
  const roomCounts = ROOM_TEMPLATES.map((template) => ({
    ...template,
    count: rooms.filter((r) => r.type === template.type).length,
  })).filter((t) => t.count > 0);

  return (
    <div className="w-56 shrink-0 border-l p-4 overflow-auto space-y-4 bg-background">
      {/* Instruction */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Click a room to edit</p>
        <p>or drag to reposition</p>
      </div>

      <Separator />

      {/* Room Summary */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Room Summary</h3>
        <div className="space-y-1.5">
          {roomCounts.map((template) => (
            <div
              key={template.type}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: template.borderColor }}
                />
                <span>{template.name}</span>
              </div>
              <span className="text-muted-foreground">{template.count}</span>
            </div>
          ))}
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

      <Separator />

      {/* Keyboard Shortcuts */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Undo</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Redo</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl+Y</kbd>
          </div>
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
  );
}
