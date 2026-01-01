import { useState, useCallback, useRef, useEffect } from 'react';
import type { DragStartEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import type { Room, ApartmentLayout, Door } from './types';
import { findNearestValidPosition } from './collisionUtils';

interface UseDragHandlersProps {
  layout: ApartmentLayout;
  doors: Door[];
  cellSize: number;
  onUpdateDoorPosition: (doorId: string, position: number) => void;
  onMoveRoom: (id: string, x: number, y: number) => void;
}

export const useDragHandlers = ({
  layout,
  doors,
  cellSize,
  onUpdateDoorPosition,
  onMoveRoom,
}: UseDragHandlersProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ghostPosition, setGhostPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Throttled ghost position update to prevent render thrashing (~60fps)
  const ghostUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttledSetGhostPosition = useCallback((pos: { x: number; y: number; width: number; height: number } | null) => {
    if (ghostUpdateTimeoutRef.current) {
      clearTimeout(ghostUpdateTimeoutRef.current);
      ghostUpdateTimeoutRef.current = null;
    }
    // Use requestAnimationFrame instead of setTimeout for smoother updates
    ghostUpdateTimeoutRef.current = setTimeout(() => {
      setGhostPosition(pos);
      ghostUpdateTimeoutRef.current = null;
    }, 16); // ~60fps
  }, []);

  // Cleanup throttled function on unmount
  useEffect(() => {
    return () => {
      if (ghostUpdateTimeoutRef.current) {
        clearTimeout(ghostUpdateTimeoutRef.current);
        ghostUpdateTimeoutRef.current = null;
      }
    };
  }, []);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { active, delta } = event;
    const id = active.id as string;

    // Only show ghost for rooms, not doors
    if (id.startsWith('door-')) return;

    const room = layout.rooms.find((r: Room) => r.id === id);
    if (room && delta) {
      const targetX = Math.round((room.x + delta.x / cellSize) * 100) / 100;
      const targetY = Math.round((room.y + delta.y / cellSize) * 100) / 100;

      const otherRooms = layout.rooms.filter((r: Room) => r.id !== id);
      const validPosition = findNearestValidPosition(room, targetX, targetY, otherRooms);

      // Only show ghost if position was adjusted (snapped) to avoid collision
      const wasSnapped = Math.abs(validPosition.x - targetX) > 0.01 || Math.abs(validPosition.y - targetY) > 0.01;
      
      if (wasSnapped) {
        throttledSetGhostPosition({
          x: validPosition.x,
          y: validPosition.y,
          width: room.width,
          height: room.height
        });
      } else {
        throttledSetGhostPosition(null);
      }
    }
  }, [layout.rooms, cellSize, throttledSetGhostPosition]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    // Clear any pending ghost update before clearing the ghost
    if (ghostUpdateTimeoutRef.current) {
      clearTimeout(ghostUpdateTimeoutRef.current);
      ghostUpdateTimeoutRef.current = null;
    }
    setGhostPosition(null);
    const { active, delta } = event;
    const id = active.id as string;

    // Check if dragging a door
    if (id.startsWith('door-')) {
      const doorId = id.replace('door-', '');
      const door = doors.find((d: Door) => d.id === doorId);
      const room = layout.rooms.find((r: Room) => r.id === door?.roomId);

      if (door && room && delta) {
        const isVertical = door.edge === 'left' || door.edge === 'right';
        const edgeLength = isVertical ? room.height : room.width;
        const deltaPx = isVertical ? delta.y : delta.x;
        const deltaPos = deltaPx / (edgeLength * cellSize);
        const newPosition = Math.max(0.1, Math.min(0.9, door.position + deltaPos));

        onUpdateDoorPosition(doorId, newPosition);
      }
      return;
    }

    // Handle room drag
    const room = layout.rooms.find((r: Room) => r.id === id);
    if (room && delta) {
      const targetX = Math.round((room.x + delta.x / cellSize) * 100) / 100;
      const targetY = Math.round((room.y + delta.y / cellSize) * 100) / 100;

      const otherRooms = layout.rooms.filter((r: Room) => r.id !== id);
      const validPosition = findNearestValidPosition(room, targetX, targetY, otherRooms);

      onMoveRoom(id, validPosition.x, validPosition.y);
    }
  }, [layout.rooms, doors, cellSize, onUpdateDoorPosition, onMoveRoom]);

  return {
    activeId,
    ghostPosition,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};
