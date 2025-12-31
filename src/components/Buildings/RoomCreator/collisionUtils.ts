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

// Check if a room overlaps with any other rooms
export const roomOverlapsAny = (room: Room, allRooms: Room[]): boolean => {
  return allRooms.some(r => roomsOverlap(room, r));
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

// Find the nearest non-overlapping position for a room
export const findNearestValidPosition = (
  movingRoom: Room,
  targetX: number,
  targetY: number,
  otherRooms: Room[]
): { x: number; y: number } => {
  // Create a test room at the target position
  const testRoom: Room = { ...movingRoom, x: targetX, y: targetY };
  
  // If no overlap, return the target position
  if (!roomOverlapsAny(testRoom, otherRooms)) {
    return { x: targetX, y: targetY };
  }
  
  // Find all rooms that overlap with the test position
  const overlappingRooms = otherRooms.filter(r => roomsOverlap(testRoom, r));
  
  // Calculate possible snap positions (edges of overlapping rooms)
  const candidates: { x: number; y: number; distance: number }[] = [];
  
  for (const other of overlappingRooms) {
    // Snap to right edge of other room
    const rightX = other.x + other.width;
    if (!roomOverlapsAny({ ...movingRoom, x: rightX, y: targetY }, otherRooms)) {
      candidates.push({
        x: rightX,
        y: targetY,
        distance: Math.abs(rightX - targetX) + Math.abs(targetY - targetY),
      });
    }
    
    // Snap to left edge of other room
    const leftX = other.x - movingRoom.width;
    if (leftX >= 0 && !roomOverlapsAny({ ...movingRoom, x: leftX, y: targetY }, otherRooms)) {
      candidates.push({
        x: leftX,
        y: targetY,
        distance: Math.abs(leftX - targetX),
      });
    }
    
    // Snap to bottom edge of other room
    const bottomY = other.y + other.height;
    if (!roomOverlapsAny({ ...movingRoom, x: targetX, y: bottomY }, otherRooms)) {
      candidates.push({
        x: targetX,
        y: bottomY,
        distance: Math.abs(bottomY - targetY),
      });
    }
    
    // Snap to top edge of other room
    const topY = other.y - movingRoom.height;
    if (topY >= 0 && !roomOverlapsAny({ ...movingRoom, x: targetX, y: topY }, otherRooms)) {
      candidates.push({
        x: targetX,
        y: topY,
        distance: Math.abs(topY - targetY),
      });
    }
    
    // Also try corner positions
    // Bottom-right of other
    if (!roomOverlapsAny({ ...movingRoom, x: rightX, y: bottomY }, otherRooms)) {
      candidates.push({
        x: rightX,
        y: bottomY,
        distance: Math.sqrt(Math.pow(rightX - targetX, 2) + Math.pow(bottomY - targetY, 2)),
      });
    }
    
    // Bottom-left of other
    if (leftX >= 0 && !roomOverlapsAny({ ...movingRoom, x: leftX, y: bottomY }, otherRooms)) {
      candidates.push({
        x: leftX,
        y: bottomY,
        distance: Math.sqrt(Math.pow(leftX - targetX, 2) + Math.pow(bottomY - targetY, 2)),
      });
    }
    
    // Top-right of other
    if (topY >= 0 && !roomOverlapsAny({ ...movingRoom, x: rightX, y: topY }, otherRooms)) {
      candidates.push({
        x: rightX,
        y: topY,
        distance: Math.sqrt(Math.pow(rightX - targetX, 2) + Math.pow(topY - targetY, 2)),
      });
    }
    
    // Top-left of other
    if (leftX >= 0 && topY >= 0 && !roomOverlapsAny({ ...movingRoom, x: leftX, y: topY }, otherRooms)) {
      candidates.push({
        x: leftX,
        y: topY,
        distance: Math.sqrt(Math.pow(leftX - targetX, 2) + Math.pow(topY - targetY, 2)),
      });
    }
  }
  
  // If we found valid positions, return the closest one
  if (candidates.length > 0) {
    candidates.sort((a, b) => a.distance - b.distance);
    return { x: Math.round(candidates[0].x * 100) / 100, y: Math.round(candidates[0].y * 100) / 100 };
  }
  
  // Fallback: keep the room at its original position
  return { x: movingRoom.x, y: movingRoom.y };
};
