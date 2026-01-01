import { useCallback } from 'react';
import type { Door, ApartmentLayout } from './types';

interface SharedEdge {
  room1Id: string;
  room2Id: string;
  edge: 'left' | 'right' | 'top' | 'bottom';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const generateDoorId = () => `door-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface UseDoorOperationsProps {
  layout: ApartmentLayout;
  doors: Door[];
  selectedDoorId: string | null;
  onLayoutChange: (layout: ApartmentLayout) => void;
  onSelectDoor: (id: string | null) => void;
  onDoorModeChange: (enabled: boolean) => void;
}

export const useDoorOperations = ({
  layout,
  doors,
  selectedDoorId,
  onLayoutChange,
  onSelectDoor,
  onDoorModeChange,
}: UseDoorOperationsProps) => {
  const addDoor = useCallback(
    (edge: SharedEdge, clickPosition: number) => {
      const newDoor: Door = {
        id: generateDoorId(),
        roomId: edge.room1Id,
        connectedRoomId: edge.room2Id,
        edge: edge.edge,
        position: clickPosition, // 0-1 along the edge
        width: 0.9, // Default door width in meters
      };

      onLayoutChange({
        ...layout,
        doors: [...doors, newDoor],
      });
      onSelectDoor(newDoor.id);
      onDoorModeChange(false);
    },
    [layout, doors, onLayoutChange, onSelectDoor, onDoorModeChange]
  );

  const deleteDoor = useCallback(
    (id: string) => {
      onLayoutChange({
        ...layout,
        doors: doors.filter((d) => d.id !== id),
      });
      if (selectedDoorId === id) {
        onSelectDoor(null);
      }
    },
    [layout, doors, onLayoutChange, selectedDoorId, onSelectDoor]
  );

  const updateDoorPosition = useCallback(
    (id: string, position: number) => {
      onLayoutChange({
        ...layout,
        doors: doors.map((d) =>
          d.id === id
            ? { ...d, position: Math.max(0.1, Math.min(0.9, position)) }
            : d
        ),
      });
    },
    [layout, doors, onLayoutChange]
  );

  const updateDoorWidth = useCallback(
    (id: string, width: number) => {
      onLayoutChange({
        ...layout,
        doors: doors.map((d) =>
          d.id === id
            ? { ...d, width: Math.max(0.5, Math.min(2.5, width)) }
            : d
        ),
      });
    },
    [layout, doors, onLayoutChange]
  );

  return {
    addDoor,
    deleteDoor,
    updateDoorPosition,
    updateDoorWidth,
  };
};
