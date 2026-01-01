import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  selectedRoomId: string | null;
  selectedDoorId: string | null;
  rooms: Array<{ id: string; x: number; y: number }>;
  onUndo: () => void;
  onRedo: () => void;
  onDeleteRoom: (id: string) => void;
  onDeleteDoor: (id: string) => void;
  onMoveRoom: (id: string, x: number, y: number) => void;
}

export const useKeyboardShortcuts = ({
  selectedRoomId,
  selectedDoorId,
  rooms,
  onUndo,
  onRedo,
  onDeleteRoom,
  onDeleteDoor,
  onMoveRoom,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        onRedo();
      }
      
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only if not typing in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          if (selectedRoomId) {
            onDeleteRoom(selectedRoomId);
          } else if (selectedDoorId) {
            onDeleteDoor(selectedDoorId);
          }
        }
      }

      // Nudge with arrows
      if (selectedRoomId && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        const room = rooms.find(r => r.id === selectedRoomId);
        if (room && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          let dx = 0;
          let dy = 0;
          if (e.key === 'ArrowLeft') dx = -0.1;
          if (e.key === 'ArrowRight') dx = 0.1;
          if (e.key === 'ArrowUp') dy = -0.1;
          if (e.key === 'ArrowDown') dy = 0.1;
          
          if (dx !== 0 || dy !== 0) {
            e.preventDefault();
            const newX = Math.round((room.x + dx) * 100) / 100;
            const newY = Math.round((room.y + dy) * 100) / 100;
            onMoveRoom(selectedRoomId, newX, newY);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRoomId, selectedDoorId, rooms, onUndo, onRedo, onDeleteRoom, onDeleteDoor, onMoveRoom]);
};
