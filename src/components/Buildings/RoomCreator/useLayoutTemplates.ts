import { useState, useEffect, useCallback } from 'react';
import type { ApartmentLayout } from './types';

export interface LayoutTemplate {
  id: string;
  name: string;
  createdAt: string;
  roomCount: number;
  doorCount: number;
  totalArea: number;
  layout: Omit<ApartmentLayout, 'gridSize'>;
}

const TEMPLATES_STORAGE_KEY = 'apartment-layout-templates';

const generateTemplateId = () => 
  `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useLayoutTemplates = () => {
  const [templates, setTemplates] = useState<LayoutTemplate[]>([]);

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }, []);

  // Save templates to localStorage whenever they change
  const saveToStorage = useCallback((newTemplates: LayoutTemplate[]) => {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(newTemplates));
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }, []);

  const saveTemplate = useCallback((name: string, layout: ApartmentLayout) => {
    const totalArea = layout.rooms.reduce(
      (sum, room) => sum + room.width * room.height,
      0
    );

    // Generate new IDs for rooms and update door references
    const idMap = new Map<string, string>();
    const newRooms = layout.rooms.map((room) => {
      const newId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      idMap.set(room.id, newId);
      return { ...room, id: newId };
    });

    const newDoors = (layout.doors || []).map((door) => ({
      ...door,
      id: `door-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId: idMap.get(door.roomId) || door.roomId,
      connectedRoomId: door.connectedRoomId 
        ? idMap.get(door.connectedRoomId) || door.connectedRoomId 
        : undefined,
    }));

    const template: LayoutTemplate = {
      id: generateTemplateId(),
      name,
      createdAt: new Date().toISOString(),
      roomCount: layout.rooms.length,
      doorCount: layout.doors?.length || 0,
      totalArea,
      layout: {
        rooms: newRooms,
        doors: newDoors,
      },
    };

    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    saveToStorage(newTemplates);
    return template;
  }, [templates, saveToStorage]);

  const deleteTemplate = useCallback((id: string) => {
    const newTemplates = templates.filter((t) => t.id !== id);
    setTemplates(newTemplates);
    saveToStorage(newTemplates);
  }, [templates, saveToStorage]);

  const applyTemplate = useCallback((template: LayoutTemplate): ApartmentLayout => {
    // Generate new IDs to avoid conflicts
    const idMap = new Map<string, string>();
    const newRooms = template.layout.rooms.map((room) => {
      const newId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      idMap.set(room.id, newId);
      return { ...room, id: newId };
    });

    const newDoors = (template.layout.doors || []).map((door) => ({
      ...door,
      id: `door-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId: idMap.get(door.roomId) || door.roomId,
      connectedRoomId: door.connectedRoomId 
        ? idMap.get(door.connectedRoomId) || door.connectedRoomId 
        : undefined,
    }));

    return {
      rooms: newRooms,
      doors: newDoors,
      gridSize: 48,
    };
  }, []);

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    applyTemplate,
  };
};
