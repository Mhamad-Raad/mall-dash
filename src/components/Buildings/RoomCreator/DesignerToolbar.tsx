import { Button } from '@/components/ui/button';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  AlertTriangle,
  DoorOpen,
  Save,
  FolderOpen,
  Undo,
  Redo,
} from 'lucide-react';
import { RoomToolbar } from './RoomToolbar';
import type { RoomType } from './types';

interface DesignerToolbarProps {
  selectedType: RoomType | null;
  doorMode: boolean;
  hasCollisions: boolean;
  canUndo: boolean;
  canRedo: boolean;
  cellSize: number;
  showGrid: boolean;
  hasRooms: boolean;
  defaultCellSize: number;
  onAddRoom: (type: RoomType) => void;
  onSelectType: (type: RoomType | null) => void;
  onDoorModeChange: (enabled: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onToggleGrid: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: () => void;
  onClearAll: () => void;
}

export const DesignerToolbar = ({
  selectedType,
  doorMode,
  hasCollisions,
  canUndo,
  canRedo,
  cellSize,
  showGrid,
  hasRooms,
  defaultCellSize,
  onAddRoom,
  onSelectType,
  onDoorModeChange,
  onUndo,
  onRedo,
  onZoomOut,
  onZoomIn,
  onToggleGrid,
  onSaveTemplate,
  onLoadTemplate,
  onClearAll,
}: DesignerToolbarProps) => {
  return (
    <div className='flex items-center justify-between gap-2 flex-wrap'>
      <div className='flex items-center gap-1 flex-wrap'>
        <RoomToolbar
          onAddRoom={onAddRoom}
          selectedType={selectedType}
          onSelectType={onSelectType}
        />

        {/* Door mode button */}
        <Button
          variant={doorMode ? 'default' : 'outline'}
          size='sm'
          className='gap-1 h-8 px-2'
          onClick={() => {
            onDoorModeChange(!doorMode);
            onSelectType(null);
          }}
          title='Add doors between rooms'
        >
          <DoorOpen className='w-4 h-4' />
          <span className='hidden lg:inline text-xs'>Add Door</span>
        </Button>
        
        {hasCollisions && (
          <div className='flex items-center gap-1 text-amber-500 text-xs px-1.5 py-0.5 bg-amber-500/10 rounded shrink-0'>
            <AlertTriangle className='w-3 h-3' />
            <span className='hidden md:inline'>Overlap</span>
          </div>
        )}
      </div>

      <div className='flex items-center gap-0.5 shrink-0'>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={onUndo}
          disabled={!canUndo}
          title='Undo (Ctrl+Z)'
        >
          <Undo className='w-3.5 h-3.5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={onRedo}
          disabled={!canRedo}
          title='Redo (Ctrl+Y)'
        >
          <Redo className='w-3.5 h-3.5' />
        </Button>
        <div className='w-px h-4 bg-border mx-0.5' />
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={onZoomOut}
          title='Zoom out'
        >
          <ZoomOut className='w-3.5 h-3.5' />
        </Button>
        <span className='text-xs text-muted-foreground w-9 text-center tabular-nums'>
          {Math.round((cellSize / defaultCellSize) * 100)}%
        </span>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={onZoomIn}
          title='Zoom in'
        >
          <ZoomIn className='w-3.5 h-3.5' />
        </Button>
        <Button
          variant={showGrid ? 'secondary' : 'ghost'}
          size='icon'
          className='h-7 w-7'
          onClick={onToggleGrid}
          title='Toggle grid'
        >
          <Grid3X3 className='w-3.5 h-3.5' />
        </Button>
        <div className='w-px h-4 bg-border mx-0.5' />
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={onSaveTemplate}
          title='Save as template'
          disabled={!hasRooms}
        >
          <Save className='w-3.5 h-3.5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={onLoadTemplate}
          title='Load template'
        >
          <FolderOpen className='w-3.5 h-3.5' />
        </Button>
        <div className='w-px h-4 bg-border mx-0.5' />
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10'
          onClick={onClearAll}
          title='Clear all rooms'
        >
          <RotateCcw className='w-3.5 h-3.5' />
        </Button>
      </div>
    </div>
  );
};
