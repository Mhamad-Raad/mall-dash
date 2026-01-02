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
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shrink-0">
      {/* Room Type Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {ROOM_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <TooltipProvider key={template.type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 gap-2 text-xs font-medium hover:bg-white/5 transition-colors"
                    onClick={() => onAddRoom(template)}
                  >
                    <Icon className="w-4 h-4" style={{ color: template.borderColor }} />
                    <span>{template.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Add {template.name} ({template.defaultWidth}×{template.defaultHeight}m)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        
        {onAddDoor && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 gap-2 text-xs font-medium hover:bg-white/5"
                  onClick={onAddDoor}
                >
                  <DoorOpen className="w-4 h-4 text-muted-foreground" />
                  <span>Add Door</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Add Door</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border rounded-md bg-muted/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10"
                  onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <span className="text-xs font-medium text-muted-foreground w-14 text-center select-none">
              {Math.round(zoom * 100)}%
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10"
                  onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
                  disabled={zoom >= 2}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>
          
          {/* Reset */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
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
