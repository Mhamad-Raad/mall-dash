import { useState, useRef, useEffect } from 'react';
import { getRoomConfig } from './types';
import type { Room, RoomType, ApartmentLayout } from './types';
import { useLayoutTemplates } from './useLayoutTemplates';
import { SaveTemplateDialog } from './SaveTemplateDialog';
import { LoadTemplateDialog } from './LoadTemplateDialog';
import { RoomEditorPanel } from './RoomEditorPanel';
import { RoomSummaryPanel } from './RoomSummaryPanel';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useRoomOperations } from './useRoomOperations';
import { useDoorOperations } from './useDoorOperations';
import { DesignerToolbar } from './DesignerToolbar';
import { DesignerCanvas } from './DesignerCanvas';
import { usePanHandlers } from './usePanHandlers';
import { useDragHandlers } from './useDragHandlers';
import { useGridCalculations } from './useGridCalculations';


interface RoomCreatorProps {
  layout: ApartmentLayout;
  onLayoutChange: (layout: ApartmentLayout) => void;
}

const DEFAULT_CELL_SIZE = 52;

export const RoomCreator = ({ layout, onLayoutChange }: RoomCreatorProps) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [doorMode, setDoorMode] = useState(false);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  const [showGrid, setShowGrid] = useState(true);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { templates, saveTemplate, deleteTemplate, applyTemplate } = useLayoutTemplates();

  // Ctrl+scroll zoom handler - needs non-passive event listener to prevent browser zoom
  // Attached to scroll container to capture wheel events in the entire area
  useEffect(() => {
    const container = scrollContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomDelta = e.deltaY > 0 ? -4 : 4;
        
        setCellSize((oldCellSize) => {
          const newCellSize = Math.max(24, Math.min(96, oldCellSize + zoomDelta));
          
          if (newCellSize !== oldCellSize) {
            const scale = newCellSize / oldCellSize;
            const scrollX = container.scrollLeft;
            const scrollY = container.scrollTop;
            const newScrollX = mouseX * scale - (mouseX - scrollX);
            const newScrollY = mouseY * scale - (mouseY - scrollY);
            
            requestAnimationFrame(() => {
              container.scrollLeft = Math.max(0, newScrollX);
              container.scrollTop = Math.max(0, newScrollY);
            });
          }
          
          return newCellSize;
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Pan handlers
  usePanHandlers({ scrollContainerRef });

  // Grid calculations and derived values
  const { doors, gridCols, gridRows, offsetX, offsetY, overlappingRoomIds, hasCollisions, sharedEdges } = useGridCalculations({ layout });

  // Room operations hook
  const {
    addRoomAtPosition,
    deleteRoom,
    duplicateRoom,
    rotateRoom,
    resizeRoom,
    updateRoomName,
    moveRoom,
  } = useRoomOperations({
    layout,
    doors,
    selectedRoomId,
    onLayoutChange,
    onSelectRoom: setSelectedRoomId,
    onSelectType: setSelectedType,
  });

  // Door operations hook
  const { addDoor, deleteDoor, updateDoorPosition } = useDoorOperations({
    layout,
    doors,
    selectedDoorId,
    onLayoutChange,
    onSelectDoor: setSelectedDoorId,
    onDoorModeChange: setDoorMode,
  });

  // Drag handlers
  const { activeId, ghostPosition, handleDragStart, handleDragMove, handleDragEnd } = useDragHandlers({
    layout,
    doors,
    cellSize,
    onUpdateDoorPosition: updateDoorPosition,
    onMoveRoom: moveRoom,
  });

  const handleClearAll = () => {
    onLayoutChange({ ...layout, rooms: [], doors: [] });
    setSelectedRoomId(null);
    setSelectedDoorId(null);
  };

  // Keyboard shortcuts hook
  useKeyboardShortcuts({
    selectedRoomId,
    selectedDoorId,
    rooms: layout.rooms,
    onDeleteRoom: deleteRoom,
    onDeleteDoor: deleteDoor,
    onMoveRoom: moveRoom,
  });

  // Cleanup effect to release memory when component unmounts
  useEffect(() => {
    return () => {
      // Clear all state to help garbage collection
      setSelectedRoomId(null);
      setSelectedDoorId(null);
      setSelectedType(null);
      setDoorMode(false);
      setSaveTemplateOpen(false);
      setLoadTemplateOpen(false);
      
      // Clear refs
      if (scrollContainerRef.current) {
        scrollContainerRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current = null;
      }
    };
  }, []);

  // Center canvas on mount only (not on subsequent changes)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Small delay to ensure layout is calculated
    const timer = setTimeout(() => {
      const canvasWidth = gridCols * cellSize;
      const canvasHeight = gridRows * cellSize;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Scroll to center
      container.scrollLeft = (canvasWidth - containerWidth) / 2;
      container.scrollTop = (canvasHeight - containerHeight) / 2;
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const selectedRoom = layout.rooms.find((r) => r.id === selectedRoomId);
  const selectedDoor = doors.find((d) => d.id === selectedDoorId);

  return (
    <div className='flex flex-col h-full'>
      {/* Compact toolbar */}
      <div className='pb-2 border-b mb-2'>
        <DesignerToolbar
          selectedType={selectedType}
          doorMode={doorMode}
          hasCollisions={hasCollisions}
          cellSize={cellSize}
          showGrid={showGrid}
          hasRooms={layout.rooms.length > 0}
          defaultCellSize={DEFAULT_CELL_SIZE}
          onAddRoom={(type) => {
            const config = getRoomConfig(type);
            const newRoom: Room = {
              id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type,
              name: config.label,
              x: 1,
              y: 1,
              width: config.defaultWidth,
              height: config.defaultHeight,
            };
            onLayoutChange({
              ...layout,
              rooms: [...layout.rooms, newRoom],
            });
            setSelectedRoomId(newRoom.id);
            setSelectedType(null);
          }}
          onSelectType={setSelectedType}
          onDoorModeChange={setDoorMode}
          onZoomOut={() => setCellSize((s) => Math.max(24, s - 8))}
          onZoomIn={() => setCellSize((s) => Math.min(96, s + 8))}
          onToggleGrid={() => setShowGrid(!showGrid)}
          onSaveTemplate={() => setSaveTemplateOpen(true)}
          onLoadTemplate={() => setLoadTemplateOpen(true)}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Main content: Canvas + Room Editor side panel */}
      <div className='flex-1 flex gap-2 min-h-0 overflow-hidden'>
        {/* Canvas area - scrollable */}
        <DesignerCanvas
          scrollContainerRef={scrollContainerRef}
          layout={layout}
          doors={doors}
          cellSize={cellSize}
          gridRows={gridRows}
          gridCols={gridCols}
          offsetX={offsetX}
          offsetY={offsetY}
          showGrid={showGrid}
          selectedType={selectedType}
          doorMode={doorMode}
          ghostPosition={ghostPosition}
          selectedRoomId={selectedRoomId}
          selectedDoorId={selectedDoorId}
          activeId={activeId}
          overlappingRoomIds={overlappingRoomIds}
          sharedEdges={sharedEdges}
          onSelectRoom={(id) => {
            setSelectedRoomId(id);
            setSelectedDoorId(null);
          }}
          onSelectDoor={(id) => {
            setSelectedDoorId(id);
            setSelectedRoomId(null);
          }}
          onSelectType={setSelectedType}
          onDeleteDoor={deleteDoor}
          onResizeRoom={resizeRoom}
          onAddRoomAtPosition={addRoomAtPosition}
          onAddDoor={addDoor}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />

        {/* Right panel - Selected room/door editor */}
        <div className='w-52 shrink-0 space-y-2 overflow-auto'>
          <RoomEditorPanel
            selectedRoom={selectedRoom}
            selectedDoor={selectedDoor}
            rooms={layout.rooms}
            overlappingRoomIds={overlappingRoomIds}
            onUpdateRoomName={updateRoomName}
            onResizeRoom={resizeRoom}
            onDuplicateRoom={duplicateRoom}
            onRotateRoom={rotateRoom}
            onDeleteRoom={deleteRoom}
            onUpdateDoorWidth={(id, width) => {
              onLayoutChange({
                ...layout,
                doors: doors.map(d => 
                  d.id === id ? { ...d, width } : d
                ),
              });
            }}
            onDeleteDoor={deleteDoor}
          />

          <RoomSummaryPanel rooms={layout.rooms} doors={doors} />
        </div>
      </div>

      <SaveTemplateDialog
        open={saveTemplateOpen}
        onOpenChange={setSaveTemplateOpen}
        layout={layout}
        onSave={saveTemplate}
      />

      <LoadTemplateDialog
        open={loadTemplateOpen}
        onOpenChange={setLoadTemplateOpen}
        templates={templates}
        onLoad={(template) => {
          const newLayout = applyTemplate(template);
          onLayoutChange(newLayout);
          setLoadTemplateOpen(false);
          setSelectedRoomId(null);
          setSelectedDoorId(null);
        }}
        onDelete={deleteTemplate}
      />
    </div>
  );
};

export default RoomCreator;