import { useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragMoveEvent } from '@dnd-kit/core';
import { RoomBox } from './RoomBox';
import { DoorMarker } from './DoorMarker';
import { cn } from '@/lib/utils';
import { getRoomConfig } from './types';
import type { RoomType, ApartmentLayout, Door } from './types';
import type { SharedEdge } from './doorUtils';
import { getEdgeAtPoint } from './doorUtils';

interface DesignerCanvasProps {
  layout: ApartmentLayout;
  doors: Door[];
  cellSize: number;
  showGrid: boolean;
  gridCols: number;
  gridRows: number;
  offsetX: number;
  offsetY: number;
  selectedType: RoomType | null;
  doorMode: boolean;
  selectedRoomId: string | null;
  selectedDoorId: string | null;
  activeId: string | null;
  ghostPosition: { x: number; y: number; width: number; height: number } | null;
  overlappingRoomIds: Set<string>;
  sharedEdges: SharedEdge[];
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onSelectRoom: (id: string | null) => void;
  onSelectDoor: (id: string | null) => void;
  onSelectType: (type: RoomType | null) => void;
  onAddRoomAtPosition: (type: RoomType, x: number, y: number) => void;
  onAddDoor: (edge: SharedEdge, position: number) => void;
  onDeleteDoor: (id: string) => void;
  onResizeRoom: (id: string, width: number, height: number, deltaX?: number, deltaY?: number, isResizing?: boolean) => void;
}

export const DesignerCanvas = ({
  layout,
  doors,
  cellSize,
  showGrid,
  gridCols,
  gridRows,
  offsetX,
  offsetY,
  selectedType,
  doorMode,
  selectedRoomId,
  selectedDoorId,
  activeId,
  ghostPosition,
  overlappingRoomIds,
  sharedEdges,
  scrollContainerRef,
  onDragStart,
  onDragMove,
  onDragEnd,
  onSelectRoom,
  onSelectDoor,
  onSelectType,
  onAddRoomAtPosition,
  onAddDoor,
  onDeleteDoor,
  onResizeRoom,
}: DesignerCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeRoom = layout.rooms.find((r) => r.id === activeId);

  return (
    <div ref={scrollContainerRef} className='flex-1 overflow-auto bg-muted/20 rounded-lg'>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      >
        <div
          ref={canvasRef}
          className={cn(
            'relative overflow-hidden bg-background',
            'transition-colors',
            selectedType && 'cursor-crosshair',
            doorMode && 'cursor-pointer'
          )}
          style={{
            width: gridCols * cellSize,
            height: gridRows * cellSize,
            minWidth: '100%',
            minHeight: '100%',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

                if (doorMode) {
                  const adjustedClickX = clickX - offsetX * cellSize;
                  const adjustedClickY = clickY - offsetY * cellSize;
                  const edge = getEdgeAtPoint(adjustedClickX, adjustedClickY, layout.rooms, cellSize, 20);
                  if (edge) {
                    const isVertical = edge.edge === 'left' || edge.edge === 'right';
                    const edgeStart = isVertical ? edge.y1 * cellSize : edge.x1 * cellSize;
                    const edgeEnd = isVertical ? edge.y2 * cellSize : edge.x2 * cellSize;
                    const clickPos = isVertical ? adjustedClickY : adjustedClickX;
                    const position = (clickPos - edgeStart) / (edgeEnd - edgeStart);
                    onAddDoor(edge, Math.max(0.15, Math.min(0.85, position)));
                  }
                  return;
                }

                if (selectedType) {
                  const x = Math.round(((clickX / cellSize) - offsetX) * 100) / 100;
                  const y = Math.round(((clickY / cellSize) - offsetY) * 100) / 100;
                  onAddRoomAtPosition(selectedType, x, y);
                  onSelectType(null);
                } else {
                  onSelectRoom(null);
                  onSelectDoor(null);
                }
              }}
            >
              {/* Ruler markings - horizontal (top) */}
              {showGrid && (
                <div className='absolute -top-6 left-0 right-0 h-5 flex pointer-events-none'>
                  {Array.from({ length: Math.ceil(gridCols) }).map((_, i) => {
                    const actualCoord = Math.round(i - offsetX);
                    return (
                      <div
                        key={`ruler-h-${i}`}
                        className='relative'
                        style={{ width: cellSize }}
                      >
                        {i % 2 === 0 && (
                          <span className='absolute left-0 -top-0.5 text-[9px] text-muted-foreground/70 font-mono'>
                            {actualCoord}m
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ruler markings - vertical (left) */}
              {showGrid && (
                <div className='absolute top-0 -left-6 bottom-0 w-5 pointer-events-none'>
                  {Array.from({ length: Math.ceil(gridRows) }).map((_, i) => {
                    const actualCoord = Math.round(i - offsetY);
                    return (
                      <div
                        key={`ruler-v-${i}`}
                        className='relative'
                        style={{ height: cellSize }}
                      >
                        {i % 2 === 0 && (
                          <span className='absolute -left-0.5 top-0 text-[9px] text-muted-foreground/70 font-mono'>
                            {actualCoord}m
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Grid lines */}
              {showGrid &&
                Array.from({ length: gridCols + 1 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className={cn(
                      'absolute top-0 bottom-0 w-px',
                      i % 5 === 0 ? 'bg-border/50' : 'bg-border/20'
                    )}
                    style={{ left: i * cellSize }}
                  />
                ))}
              {showGrid &&
                Array.from({ length: gridRows + 1 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className={cn(
                      'absolute left-0 right-0 h-px',
                      i % 5 === 0 ? 'bg-border/50' : 'bg-border/20'
                    )}
                    style={{ top: i * cellSize }}
                  />
                ))}

              {/* Ghost Room */}
              {ghostPosition && (
                <div
                  className="absolute border-2 border-dashed border-primary/50 bg-primary/10 pointer-events-none z-10 transition-all duration-200 ease-out"
                  style={{
                    left: (ghostPosition.x + offsetX) * cellSize,
                    top: (ghostPosition.y + offsetY) * cellSize,
                    width: ghostPosition.width * cellSize,
                    height: ghostPosition.height * cellSize,
                  }}
                />
              )}

              {/* Rooms */}
              {layout.rooms.map((room) => (
                <RoomBox
                  key={room.id}
                  room={room}
                  cellSize={cellSize}
                  isSelected={selectedRoomId === room.id}
                  isOverlapping={overlappingRoomIds.has(room.id)}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  onSelect={(id) => {
                    onSelectRoom(id);
                    onSelectDoor(null);
                  }}
                  onResize={onResizeRoom}
                />
              ))}

              {/* Shared edges highlight (when in door mode) */}
              {doorMode && sharedEdges.map((edge, i) => {
                const x1 = (edge.x1 + offsetX) * cellSize;
                const y1 = (edge.y1 + offsetY) * cellSize;
                const x2 = (edge.x2 + offsetX) * cellSize;
                const y2 = (edge.y2 + offsetY) * cellSize;
                const isVertical = x1 === x2;
                
                return (
                  <div
                    key={`edge-${i}`}
                    className='absolute bg-amber-500/50 hover:bg-amber-500/80 transition-colors z-20 pointer-events-auto'
                    style={{
                      left: Math.min(x1, x2) - (isVertical ? 3 : 0),
                      top: Math.min(y1, y2) - (isVertical ? 0 : 3),
                      width: isVertical ? 6 : Math.abs(x2 - x1),
                      height: isVertical ? Math.abs(y2 - y1) : 6,
                      cursor: 'pointer',
                    }}
                  />
                );
              })}

              {/* Doors */}
              {doors.map((door) => {
                const room = layout.rooms.find((r) => r.id === door.roomId);
                const connectedRoom = door.connectedRoomId
                  ? layout.rooms.find((r) => r.id === door.connectedRoomId)
                  : undefined;
                if (!room) return null;
                
                return (
                  <DoorMarker
                    key={door.id}
                    door={door}
                    room={room}
                    connectedRoom={connectedRoom}
                    cellSize={cellSize}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    isSelected={selectedDoorId === door.id}
                    onSelect={(id) => {
                      onSelectDoor(id);
                      onSelectRoom(null);
                    }}
                    onDelete={onDeleteDoor}
                  />
                );
              })}

              {/* Empty state */}
              {layout.rooms.length === 0 && (
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                  <div className='text-center space-y-2 max-w-md'>
                    <p className='text-muted-foreground'>
                      Click a room type above and click here to add rooms
                    </p>
                    <p className='text-xs mt-1'>Place rooms next to each other to add doors</p>
                  </div>
                </div>
              )}

              {doorMode && sharedEdges.length > 0 && (
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/90 px-3 py-1.5 rounded-full border shadow-sm pointer-events-none'>
                  Click on a highlighted wall to add a door
                </div>
              )}
            </div>

        <DragOverlay>
          {activeRoom && (
            <div
              className={cn(
                'rounded-lg group overflow-hidden',
                'flex flex-col border',
                'opacity-90 shadow-2xl cursor-grabbing scale-[1.02]',
                'border-border/50 bg-card shadow-sm'
              )}
              style={{
                width: activeRoom.width * cellSize,
                height: activeRoom.height * cellSize,
              }}
            >
              {/* Color indicator bar */}
              <div 
                className='w-full shrink-0'
                style={{ 
                  height: (activeRoom.width * cellSize < 80 || activeRoom.height * cellSize < 60) ? 3 : 4,
                  background: `linear-gradient(90deg, ${getRoomConfig(activeRoom.type).color}, ${getRoomConfig(activeRoom.type).color}dd)`
                }}
              />
              
              {/* Main content */}
              <div className='flex-1 flex flex-col items-center justify-center p-1 min-h-0 relative'>
                {(() => {
                  const config = getRoomConfig(activeRoom.type);
                  const isVerySmall = activeRoom.width * cellSize < 80 || activeRoom.height * cellSize < 60;
                  const isSmall = activeRoom.width * cellSize < 120 || activeRoom.height * cellSize < 80;
                  
                  return (
                    <>
                      {!isVerySmall && (
                        <span
                          className={cn(
                            'font-medium text-center truncate max-w-full text-foreground',
                            isSmall ? 'text-[10px] leading-tight' : 'text-xs mt-0.5'
                          )}
                        >
                          {activeRoom.name || config.label}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Area footer */}
              <div 
                className={cn(
                  'shrink-0 text-center font-medium border-t border-border',
                  'bg-muted/50 text-muted-foreground',
                  (activeRoom.width * cellSize < 80 || activeRoom.height * cellSize < 60) ? 'text-[8px] py-0.5 px-0.5' : 
                  (activeRoom.width * cellSize < 120 || activeRoom.height * cellSize < 80) ? 'text-[9px] py-0.5 px-1' : 'text-[10px] py-1 px-1.5'
                )}
              >
                {(activeRoom.width * activeRoom.height).toFixed(2)}m²
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
