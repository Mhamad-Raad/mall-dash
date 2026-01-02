import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE } from './types';

const EPSILON = 0.01;

/**
 * Check if two rooms overlap (rectangles intersection)
 * Uses epsilon shrinking to avoid floating point errors and allow rooms to touch edges
 */
export function doRoomsOverlap(
  room1: { id?: string; x: number; y: number; width: number; height: number },
  room2: { id?: string; x: number; y: number; width: number; height: number }
): boolean {
  // Don't check against self
  if (room1.id && room2.id && room1.id === room2.id) return false;

  // Shrink room1's bounding box slightly to avoid floating point errors
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
}

/**
 * Check if a room overlaps with any other rooms
 */
export function roomOverlapsAny(room: DroppedRoom, allRooms: DroppedRoom[]): boolean {
  return allRooms.some((r) => doRoomsOverlap(room, r));
}

/**
 * Calculate the overlap area between two rooms
 */
export function getOverlapArea(
  room1: { x: number; y: number; width: number; height: number },
  room2: { x: number; y: number; width: number; height: number }
): number {
  const xOverlap = Math.max(
    0,
    Math.min(room1.x + room1.width, room2.x + room2.width) - Math.max(room1.x, room2.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(room1.y + room1.height, room2.y + room2.height) - Math.max(room1.y, room2.y)
  );
  return xOverlap * yOverlap;
}

/**
 * Check if moving a room to a new position would cause a collision
 */
export function wouldCollide(
  movingRoom: DroppedRoom,
  newX: number,
  newY: number,
  allRooms: DroppedRoom[]
): boolean {
  const movedRoom = {
    id: movingRoom.id,
    x: newX,
    y: newY,
    width: movingRoom.width,
    height: movingRoom.height,
  };

  for (const room of allRooms) {
    if (room.id === movingRoom.id) continue;
    if (doRoomsOverlap(movedRoom, room)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all rooms that collide with a given room position
 */
export function getCollidingRooms(
  movingRoom: DroppedRoom,
  newX: number,
  newY: number,
  allRooms: DroppedRoom[]
): DroppedRoom[] {
  const movedRoom = {
    id: movingRoom.id,
    x: newX,
    y: newY,
    width: movingRoom.width,
    height: movingRoom.height,
  };

  return allRooms.filter((room) => {
    if (room.id === movingRoom.id) return false;
    return doRoomsOverlap(movedRoom, room);
  });
}

/**
 * Round to grid precision (0.01 = 1cm)
 */
function roundToPrecision(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate distance from a point (with dimensions) to a room's center
 */
function distanceToRoom(
  x: number,
  y: number,
  width: number,
  height: number,
  room: DroppedRoom
): number {
  const roomCenterX = room.x + room.width / 2;
  const roomCenterY = room.y + room.height / 2;
  const movingCenterX = x + width / 2;
  const movingCenterY = y + height / 2;
  return Math.sqrt(
    Math.pow(roomCenterX - movingCenterX, 2) + Math.pow(roomCenterY - movingCenterY, 2)
  );
}

/**
 * Find the best valid position for a room based on:
 * 1. Priority: overlapping rooms first, then nearby, then far
 * 2. Distance to target position
 * 3. Smart snap points to room edges
 */
export function findBestValidPosition(
  movingRoom: DroppedRoom,
  targetX: number,
  targetY: number,
  allRooms: DroppedRoom[],
  _maxSearchDistance: number = 10
): { x: number; y: number; hasCollision: boolean } {
  const otherRooms = allRooms.filter((r) => r.id !== movingRoom.id);

  // Create a test room at the target position
  const testRoom: DroppedRoom = { ...movingRoom, x: targetX, y: targetY };

  // If no overlap, return the target position
  if (!roomOverlapsAny(testRoom, otherRooms)) {
    return { x: targetX, y: targetY, hasCollision: false };
  }

  // Find which rooms the target position overlaps with
  const overlappingRooms = otherRooms.filter((r) => doRoomsOverlap(testRoom, r));

  // Sort other rooms by distance to target position (prioritize nearby rooms)
  const roomsByDistance = [...otherRooms].sort((a, b) => {
    const distA = distanceToRoom(targetX, targetY, movingRoom.width, movingRoom.height, a);
    const distB = distanceToRoom(targetX, targetY, movingRoom.width, movingRoom.height, b);
    return distA - distB;
  });

  // Collect candidates with priority system
  // Priority: 0 = overlapping (best), 1 = nearby, 2 = far
  const candidates: { x: number; y: number; distance: number; priority: number }[] = [];

  // Generate snap points from rooms, prioritizing overlapping ones
  for (const other of roomsByDistance) {
    const isOverlapping = overlappingRooms.some((r) => r.id === other.id);
    const distToOther = distanceToRoom(
      targetX,
      targetY,
      movingRoom.width,
      movingRoom.height,
      other
    );
    const priority = isOverlapping ? 0 : distToOther < 5 ? 1 : 2;

    const snapPoints = [
      // Snap to right edge of other room (3 Y positions)
      { x: other.x + other.width, y: targetY },
      { x: other.x + other.width, y: other.y },
      { x: other.x + other.width, y: other.y + other.height - movingRoom.height },

      // Snap to left edge of other room (3 Y positions)
      { x: other.x - movingRoom.width, y: targetY },
      { x: other.x - movingRoom.width, y: other.y },
      { x: other.x - movingRoom.width, y: other.y + other.height - movingRoom.height },

      // Snap to bottom edge of other room (3 X positions)
      { x: targetX, y: other.y + other.height },
      { x: other.x, y: other.y + other.height },
      { x: other.x + other.width - movingRoom.width, y: other.y + other.height },

      // Snap to top edge of other room (3 X positions)
      { x: targetX, y: other.y - movingRoom.height },
      { x: other.x, y: other.y - movingRoom.height },
      { x: other.x + other.width - movingRoom.width, y: other.y - movingRoom.height },
    ];

    for (const point of snapPoints) {
      const x = roundToPrecision(point.x);
      const y = roundToPrecision(point.y);

      // Check if this position is valid (no overlap with any room)
      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
        candidates.push({ x, y, distance, priority });
      }
    }
  }

  // Also try positions that align room edges
  for (const other of roomsByDistance) {
    const isOverlapping = overlappingRooms.some((r) => r.id === other.id);
    const distToOther = distanceToRoom(
      targetX,
      targetY,
      movingRoom.width,
      movingRoom.height,
      other
    );
    const priority = isOverlapping ? 0 : distToOther < 5 ? 1 : 2;

    const alignPoints = [
      // Corner alignments
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
      const x = roundToPrecision(point.x);
      const y = roundToPrecision(point.y);

      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
        // Avoid duplicates
        if (!candidates.some((c) => c.x === x && c.y === y)) {
          candidates.push({ x, y, distance, priority });
        }
      }
    }
  }

  // If we found valid positions, return the best one
  if (candidates.length > 0) {
    // Sort by priority first (lower is better), then by distance
    candidates.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.distance - b.distance;
    });
    return { x: candidates[0].x, y: candidates[0].y, hasCollision: false };
  }

  // Fallback: grid search around the target position
  const searchRadius = 10; // meters
  const step = 0.5; // meter steps
  let bestPosition = { x: movingRoom.x, y: movingRoom.y };
  let bestDistance = Infinity;

  for (let dx = -searchRadius; dx <= searchRadius; dx += step) {
    for (let dy = -searchRadius; dy <= searchRadius; dy += step) {
      const x = roundToPrecision(targetX + dx);
      const y = roundToPrecision(targetY + dy);

      if (!roomOverlapsAny({ ...movingRoom, x, y }, otherRooms)) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPosition = { x, y };
        }
      }
    }
  }

  if (bestDistance < Infinity) {
    return { x: bestPosition.x, y: bestPosition.y, hasCollision: false };
  }

  // No valid position found - return original position
  return { x: movingRoom.x, y: movingRoom.y, hasCollision: true };
}

/**
 * Legacy function for backward compatibility
 */
export function findNearestValidPosition(
  movingRoom: DroppedRoom,
  targetX: number,
  targetY: number,
  allRooms: DroppedRoom[],
  maxSearchDistance: number = 5
): { x: number; y: number; hasCollision: boolean } {
  return findBestValidPosition(movingRoom, targetX, targetY, allRooms, maxSearchDistance);
}

/**
 * Convert pixel coordinates to grid coordinates
 */
export function pixelsToGrid(pixels: number, gridSize: number = 1): number {
  return pixels / (GRID_CELL_SIZE * gridSize);
}

/**
 * Convert grid coordinates to pixel coordinates
 */
export function gridToPixels(grid: number, gridSize: number = 1): number {
  return grid * GRID_CELL_SIZE * gridSize;
}