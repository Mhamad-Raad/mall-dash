import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE } from './types';

/**
 * Check if two rooms overlap (rectangles intersection)
 */
export function doRoomsOverlap(
  room1: { x: number; y: number; width: number; height: number },
  room2: { x: number; y: number; width: number; height: number }
): boolean {
  // Check if rectangles overlap
  return !(
    room1.x + room1.width <= room2.x ||  // room1 is to the left of room2
    room1.x >= room2.x + room2.width ||  // room1 is to the right of room2
    room1.y + room1.height <= room2.y || // room1 is above room2
    room1.y >= room2.y + room2.height    // room1 is below room2
  );
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
    x: newX,
    y: newY,
    width: movingRoom.width,
    height: movingRoom.height,
  };

  for (const room of allRooms) {
    // Skip the room being moved
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
 * Find the nearest valid position that doesn't cause a collision
 * Returns the original position if no collision, or adjusted position if needed
 */
export function findNearestValidPosition(
  movingRoom: DroppedRoom,
  targetX: number,
  targetY: number,
  allRooms: DroppedRoom[],
  maxSearchDistance: number = 5
): { x: number; y: number; hasCollision: boolean } {
  // First check if target position is valid
  if (!wouldCollide(movingRoom, targetX, targetY, allRooms)) {
    return { x: targetX, y: targetY, hasCollision: false };
  }

  // Search in expanding squares for a valid position
  for (let distance = 0.1; distance <= maxSearchDistance; distance += 0.1) {
    // Try positions in a square pattern around the target
    const positions = [
      { x: targetX + distance, y: targetY },
      { x: targetX - distance, y: targetY },
      { x: targetX, y: targetY + distance },
      { x: targetX, y: targetY - distance },
      { x: targetX + distance, y: targetY + distance },
      { x: targetX - distance, y: targetY - distance },
      { x: targetX + distance, y: targetY - distance },
      { x: targetX - distance, y: targetY + distance },
    ];

    for (const pos of positions) {
      if (pos.x >= 0 && pos.y >= 0 && !wouldCollide(movingRoom, pos.x, pos.y, allRooms)) {
        return { x: pos.x, y: pos.y, hasCollision: false };
      }
    }
  }

  // If no valid position found within search distance, return original position
  return { x: movingRoom.x, y: movingRoom.y, hasCollision: true };
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
