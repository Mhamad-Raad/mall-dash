import type { Room } from './types';

// Helper to check if two rooms overlap
export const roomsOverlap = (room1: Room, room2: Room): boolean => {
  if (room1.id === room2.id) return false;
  
  const r1Left = room1.x;
  const r1Right = room1.x + room1.width;
  const r1Top = room1.y;
  const r1Bottom = room1.y + room1.height;
  
  const r2Left = room2.x;
  const r2Right = room2.x + room2.width;
  const r2Top = room2.y;
  const r2Bottom = room2.y + room2.height;
  
  // Check if they don't overlap
  if (r1Right <= r2Left || r2Right <= r1Left) return false;
  if (r1Bottom <= r2Top || r2Bottom <= r1Top) return false;
  
  return true;
};

// Get all rooms that overlap with a given room
export const getOverlappingRooms = (room: Room, allRooms: Room[]): string[] => {
  return allRooms
    .filter(r => roomsOverlap(room, r))
    .map(r => r.id);
};

// Check if any rooms in the layout overlap
export const hasOverlappingRooms = (rooms: Room[]): boolean => {
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      if (roomsOverlap(rooms[i], rooms[j])) {
        return true;
      }
    }
  }
  return false;
};

// Get all overlapping room IDs
export const getAllOverlappingRoomIds = (rooms: Room[]): Set<string> => {
  const overlapping = new Set<string>();
  
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      if (roomsOverlap(rooms[i], rooms[j])) {
        overlapping.add(rooms[i].id);
        overlapping.add(rooms[j].id);
      }
    }
  }
  
  return overlapping;
};
