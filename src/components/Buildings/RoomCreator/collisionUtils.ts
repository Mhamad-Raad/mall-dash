import type { Room } from './types';

const EPSILON = 0.01;

// Helper to check if two rooms overlap
export const roomsOverlap = (room1: Room, room2: Room): boolean => {
  if (room1.id === room2.id) return false;
  
  // Shrink the bounding box slightly to avoid floating point errors
  // and allow rooms to touch edges without counting as overlap
  const r1Left = room1.x + EPSILON;
  const r1Right = room1.x + room1.width - EPSILON;
  const r1Top = room1.y + EPSILON;
  const r1Bottom = room1.y + room1.height - EPSILON;
  
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

// Calculate distance from a point to a room's bounding box
const distanceToRoom = (x: number, y: number, width: number, height: number, room: Room): number => {
  const roomCenterX = room.x + room.width / 2;
  const roomCenterY = room.y + room.height / 2;
  const movingCenterX = x + width / 2;
  const movingCenterY = y + height / 2;
  return Math.sqrt(Math.pow(roomCenterX - movingCenterX, 2) + Math.pow(roomCenterY - movingCenterY, 2));
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
  
  // Find which room(s) the target position overlaps with
  const overlappingRooms = otherRooms.filter(r => roomsOverlap(testRoom, r));
  
  // Sort other rooms by distance to target position (prioritize nearby rooms)
  const roomsByDistance = [...otherRooms].sort((a, b) => {
    const distA = distanceToRoom(targetX, targetY, movingRoom.width, movingRoom.height, a);
    const distB = distanceToRoom(targetX, targetY, movingRoom.width, movingRoom.height, b);
    return distA - distB;
  });
  
  // Collect candidates - prioritize rooms that are overlapping or very close to target
  const candidates: { x: number; y: number; distance: number; priority: number }[] = [];
  
  // Generate snap points from rooms, prioritizing overlapping ones
  for (const other of roomsByDistance) {
    const isOverlapping = overlappingRooms.some(r => r.id === other.id);
    // Priority: 0 = overlapping (best), 1 = nearby, 2 = far
    const distToOther = distanceToRoom(targetX, targetY, movingRoom.width, movingRoom.height, other);
    const priority = isOverlapping ? 0 : (distToOther < 5 ? 1 : 2);
    
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
      // Allow negative positions - canvas will expand to accommodate
      
      // Round to 0.01 precision
      const x = Math.round(point.x * 100) / 100;
      const y = Math.round(point.y * 100) / 100;
      
      // Check if this position is valid (no overlap with any room)
      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
        candidates.push({ x, y, distance, priority });
      }
    }
  }
  
  // Also try positions that align the moving room's edges with other rooms' edges
  for (const other of roomsByDistance) {
    const isOverlapping = overlappingRooms.some(r => r.id === other.id);
    const distToOther = distanceToRoom(targetX, targetY, movingRoom.width, movingRoom.height, other);
    const priority = isOverlapping ? 0 : (distToOther < 5 ? 1 : 2);
    
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
      // Allow negative positions - canvas will expand to accommodate
      const x = Math.round(point.x * 100) / 100;
      const y = Math.round(point.y * 100) / 100;
      
      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
        // Avoid duplicates
        if (!candidates.some(c => c.x === x && c.y === y)) {
          candidates.push({ x, y, distance, priority });
        }
      }
    }
  }
  
  // If we found valid positions, return the closest one with highest priority
  // Priority 0 (overlapping room) > Priority 1 (nearby) > Priority 2 (far)
  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      // First sort by priority (lower is better)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      // Then by distance
      return a.distance - b.distance;
    });
    return { x: candidates[0].x, y: candidates[0].y };
  }
  
  // Fallback: try a grid search around the target position
  const searchRadius = 10; // meters
  const step = 0.5; // meter steps
  let bestPosition = { x: movingRoom.x, y: movingRoom.y };
  let bestDistance = Infinity;
  
  for (let dx = -searchRadius; dx <= searchRadius; dx += step) {
    for (let dy = -searchRadius; dy <= searchRadius; dy += step) {
      // Allow negative positions - canvas will expand to accommodate
      const x = Math.round((targetX + dx) * 100) / 100;
      const y = Math.round((targetY + dy) * 100) / 100;
      
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
