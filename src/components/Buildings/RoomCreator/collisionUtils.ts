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
  
  // Collect all potential snap positions from ALL rooms (not just overlapping ones)
  // This ensures we find valid positions even in complex multi-room scenarios
  const candidates: { x: number; y: number; distance: number }[] = [];
  
  // Generate snap points from all room edges
  for (const other of otherRooms) {
    const snapPoints = [
      // Snap to right edge of other room
      { x: other.x + other.width, y: targetY },
      { x: other.x + other.width, y: other.y },
      { x: other.x + other.width, y: other.y + other.height - movingRoom.height },
      
      // Snap to left edge of other room
      { x: other.x - movingRoom.width, y: targetY },
      { x: other.x - movingRoom.width, y: other.y },
      { x: other.x - movingRoom.width, y: other.y + other.height - movingRoom.height },
      
      // Snap to bottom edge of other room
      { x: targetX, y: other.y + other.height },
      { x: other.x, y: other.y + other.height },
      { x: other.x + other.width - movingRoom.width, y: other.y + other.height },
      
      // Snap to top edge of other room
      { x: targetX, y: other.y - movingRoom.height },
      { x: other.x, y: other.y - movingRoom.height },
      { x: other.x + other.width - movingRoom.width, y: other.y - movingRoom.height },
    ];
    
    for (const point of snapPoints) {
      // Ensure position is valid (not negative)
      if (point.x < 0 || point.y < 0) continue;
      
      // Round to 0.01 precision
      const x = Math.round(point.x * 100) / 100;
      const y = Math.round(point.y * 100) / 100;
      
      // Check if this position is valid (no overlap with any room)
      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
        candidates.push({ x, y, distance });
      }
    }
  }
  
  // Also try positions that align the moving room's edges with other rooms' edges
  for (const other of otherRooms) {
    // Align moving room's left edge with other's right edge
    const alignPoints = [
      { x: other.x + other.width, y: other.y },
      { x: other.x + other.width, y: other.y + other.height - movingRoom.height },
      { x: other.x - movingRoom.width, y: other.y },
      { x: other.x - movingRoom.width, y: other.y + other.height - movingRoom.height },
      { x: other.x, y: other.y + other.height },
      { x: other.x + other.width - movingRoom.width, y: other.y + other.height },
      { x: other.x, y: other.y - movingRoom.height },
      { x: other.x + other.width - movingRoom.width, y: other.y - movingRoom.height },
    ];
    
    for (const point of alignPoints) {
      if (point.x < 0 || point.y < 0) continue;
      
      const x = Math.round(point.x * 100) / 100;
      const y = Math.round(point.y * 100) / 100;
      
      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
        // Avoid duplicates
        if (!candidates.some(c => c.x === x && c.y === y)) {
          candidates.push({ x, y, distance });
        }
      }
    }
  }
  
  // If we found valid positions, return the closest one
  if (candidates.length > 0) {
    candidates.sort((a, b) => a.distance - b.distance);
    return { x: candidates[0].x, y: candidates[0].y };
  }
  
  // Fallback: try a grid search around the target position
  const searchRadius = 10; // meters
  const step = 0.5; // meter steps
  let bestPosition = { x: movingRoom.x, y: movingRoom.y };
  let bestDistance = Infinity;
  
  for (let dx = -searchRadius; dx <= searchRadius; dx += step) {
    for (let dy = -searchRadius; dy <= searchRadius; dy += step) {
      const x = Math.max(0, Math.round((targetX + dx) * 100) / 100);
      const y = Math.max(0, Math.round((targetY + dy) * 100) / 100);
      
      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPosition = { x, y };
        }
      }
    }
  }
  
  return bestPosition;
};
