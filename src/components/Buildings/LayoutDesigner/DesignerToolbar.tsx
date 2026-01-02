import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ROOM_TEMPLATES, type RoomTemplate } from './types';
import { ZoomIn, ZoomOut, RotateCcw, Grid3X3, DoorOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignerToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
  onAddRoom: (template: RoomTemplate) => void;
  onAddDoor?: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

export function DesignerToolbar({
  zoom,
  onZoomChange,
  onReset,
  onAddRoom,
  onAddDoor,
  showGrid,
  onToggleGrid,
}: DesignerToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 bg-background border-b shrink-0">
      {/* Room Type Buttons */}
      <div className="flex items-center gap-1 flex-wrap">
        {ROOM_TEMPLATES.map((template) => (
          <Button
            key={template.type}
            variant="ghost"
            size="sm"
            className="h-8 px-3 gap-1.5 text-xs font-medium"
            onClick={() => onAddRoom(template)}
            style={{ 
              color: template.borderColor,
            }}
          >
            <span>{template.icon}</span>
            {template.name}
          </Button>
        ))}
        
        {onAddDoor && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 gap-1.5 text-xs font-medium text-orange-500"
            onClick={onAddDoor}
          >
            <DoorOpen className="w-4 h-4" />
            Add Door
          </Button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
                  disabled={zoom >= 2}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          {/* Grid Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", showGrid && "bg-accent")}
                onClick={onToggleGrid}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          {/* Reset */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onReset}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Layout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
