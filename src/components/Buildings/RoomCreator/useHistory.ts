import { useState, useCallback } from 'react';

const MAX_HISTORY = 50; // Hard limit to prevent unbounded growth

export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback((newState: T) => {
    setHistory(prev => {
      // Prevent duplicate entries - don't push if the state is identical
      if (prev.length > 0 && JSON.stringify(prev[currentIndex]) === JSON.stringify(newState)) {
        return prev;
      }
      
      const newHistory = prev.slice(0, currentIndex + 1);
      const updated = [...newHistory, newState];
      
      // Hard limit - remove oldest entries
      if (updated.length > MAX_HISTORY) {
        const trimmed = updated.slice(-MAX_HISTORY);
        // Update index in the same update cycle
        setCurrentIndex(MAX_HISTORY - 1);
        return trimmed;
      }
      
      // Update index in the same update cycle
      setCurrentIndex(newHistory.length);
      return updated;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
