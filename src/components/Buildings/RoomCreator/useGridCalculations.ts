import { useMemo } from 'react';
import type { ApartmentLayout, Door } from './types';
import { getAllOverlappingRoomIds } from './collisionUtils';
import { findSharedEdges } from './doorUtils';

const MIN_GRID_COLS = 45;
const MIN_GRID_ROWS = 35;
const GRID_PADDING = 3; // Extra cells beyond the furthest room

interface UseGridCalculationsProps {
  layout: ApartmentLayout;
}

export const useGridCalculations = ({ layout }: UseGridCalculationsProps) => {
  // Ensure doors array exists
  const doors: Door[] = layout.doors || [];
  
  // Dynamic grid sizing based on room positions - expands in all directions
  const { gridCols, gridRows, offsetX, offsetY } = useMemo(() => {
    if (layout.rooms.length === 0) {
      return { gridCols: MIN_GRID_COLS, gridRows: MIN_GRID_ROWS, offsetX: 0, offsetY: 0 };
    }
    
    // Find the bounding box of all rooms
    let minX = Infinity;
    let minY = Infinity;
    let maxX = 0;
    let maxY = 0;
    
    for (const room of layout.rooms) {
      minX = Math.min(minX, room.x);
      minY = Math.min(minY, room.y);
      maxX = Math.max(maxX, room.x + room.width);
      maxY = Math.max(maxY, room.y + room.height);
    }
    
    // Calculate offset to ensure padding on left/top
    const needsLeftPadding = minX < GRID_PADDING;
    const needsTopPadding = minY < GRID_PADDING;
    
    // Offset shifts the coordinate system so there's always padding
    const offX = needsLeftPadding ? GRID_PADDING - minX : 0;
    const offY = needsTopPadding ? GRID_PADDING - minY : 0;
    
    // Total grid size includes padding on all sides
    const totalWidth = maxX + offX + GRID_PADDING;
    const totalHeight = maxY + offY + GRID_PADDING;
    
    return {
      gridCols: Math.max(MIN_GRID_COLS, Math.ceil(totalWidth)),
      gridRows: Math.max(MIN_GRID_ROWS, Math.ceil(totalHeight)),
      offsetX: offX,
      offsetY: offY,
    };
  }, [layout.rooms]);

  // Collision detection
  const overlappingRoomIds = useMemo(
    () => getAllOverlappingRoomIds(layout.rooms),
    [layout.rooms]
  );
  const hasCollisions = overlappingRoomIds.size > 0;

  // Find shared edges between adjacent rooms
  const sharedEdges = useMemo(
    () => findSharedEdges(layout.rooms),
    [layout.rooms]
  );

  return {
    doors,
    gridCols,
    gridRows,
    offsetX,
    offsetY,
    overlappingRoomIds,
    hasCollisions,
    sharedEdges,
  };
};
