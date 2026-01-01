import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { FolderOpen, Trash2 } from 'lucide-react';
import { getRoomConfig } from './types';
import type { LayoutTemplate } from './useLayoutTemplates';

interface LoadTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: LayoutTemplate[];
  onLoad: (template: LayoutTemplate) => void;
  onDelete: (id: string) => void;
}

export const LoadTemplateDialog = ({
  open,
  onOpenChange,
  templates,
  onLoad,
  onDelete,
}: LoadTemplateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Load Template</DialogTitle>
          <DialogDescription>
            Choose a saved template to apply to this apartment.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          {templates.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <FolderOpen className='w-12 h-12 mx-auto mb-3 opacity-50' />
              <p>No templates saved yet</p>
              <p className='text-sm mt-1'>Save a layout as a template to reuse it later</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-5 max-h-[550px] overflow-auto p-1'>
              {templates.map((template) => {
                const rooms = template.layout.rooms;
                const doors = template.layout.doors || [];
                const minX = Math.min(...rooms.map(r => r.x));
                const minY = Math.min(...rooms.map(r => r.y));
                const maxX = Math.max(...rooms.map(r => r.x + r.width));
                const maxY = Math.max(...rooms.map(r => r.y + r.height));
                const layoutWidth = maxX - minX;
                const layoutHeight = maxY - minY;
                const previewSize = 240;
                const padding = 16;
                const availableSize = previewSize - padding * 2;
                const scale = Math.min(availableSize / layoutWidth, availableSize / layoutHeight, 22);
                
                return (
                  <div
                    key={template.id}
                    className='relative p-4 rounded-xl border-2 border-transparent bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/40 hover:from-muted/50 hover:to-muted/20 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md'
                    onClick={() => onLoad(template)}
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all z-10 bg-background/80 backdrop-blur-sm rounded-full'
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(template.id);
                      }}
                      title='Delete template'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                    </Button>
                    
                    <div 
                      className='relative rounded-lg mb-3 mx-auto overflow-hidden'
                      style={{ 
                        width: previewSize, 
                        height: previewSize,
                        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div 
                        className='absolute inset-0 opacity-20'
                        style={{
                          backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
                          backgroundSize: '10px 10px',
                        }}
                      />
                      
                      <div 
                        className='absolute'
                        style={{
                          left: (previewSize - layoutWidth * scale) / 2,
                          top: (previewSize - layoutHeight * scale) / 2,
                          width: layoutWidth * scale,
                          height: layoutHeight * scale,
                        }}
                      >
                        {rooms.map((room) => {
                          const config = getRoomConfig(room.type);
                          return (
                            <div
                              key={room.id}
                              className='absolute rounded border border-border/50 shadow-sm'
                              style={{
                                left: (room.x - minX) * scale,
                                top: (room.y - minY) * scale,
                                width: room.width * scale,
                                height: room.height * scale,
                                backgroundColor: `${config.color}20`,
                                borderColor: config.color,
                              }}
                            />
                          );
                        })}
                        
                        {doors.map((door) => {
                          const room = rooms.find(r => r.id === door.roomId);
                          if (!room) return null;
                          
                          const isVertical = door.edge === 'left' || door.edge === 'right';
                          let doorX = 0;
                          let doorY = 0;
                          
                          if (door.edge === 'top') {
                            doorX = (room.x - minX + room.width * door.position) * scale;
                            doorY = (room.y - minY) * scale;
                          } else if (door.edge === 'bottom') {
                            doorX = (room.x - minX + room.width * door.position) * scale;
                            doorY = (room.y - minY + room.height) * scale;
                          } else if (door.edge === 'left') {
                            doorX = (room.x - minX) * scale;
                            doorY = (room.y - minY + room.height * door.position) * scale;
                          } else {
                            doorX = (room.x - minX + room.width) * scale;
                            doorY = (room.y - minY + room.height * door.position) * scale;
                          }
                          
                          return (
                            <div
                              key={door.id}
                              className='absolute bg-amber-500 rounded-sm'
                              style={{
                                left: isVertical ? doorX - 1 : doorX - (door.width * scale) / 2,
                                top: isVertical ? doorY - (door.width * scale) / 2 : doorY - 1,
                                width: isVertical ? 2 : door.width * scale,
                                height: isVertical ? door.width * scale : 2,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className='text-center space-y-0.5'>
                      <p className='font-semibold text-sm truncate'>{template.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {template.roomCount} room{template.roomCount !== 1 ? 's' : ''} • {template.doorCount} door{template.doorCount !== 1 ? 's' : ''} • {template.totalArea.toFixed(0)} m²
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
