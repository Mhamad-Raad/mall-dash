import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE, GRID_PRECISION } from './types';

/**
 * Check if two rooms overlap (rectangles intersection)
 */
export function doRoomsOverlap(
  room1: { x: number; y: number; width: number; height: number },
  room2: { x: number; y: number; width: number; height: number }
): boolean {
  // Check if rectangles overlap (with small epsilon for floating point precision)
  const epsilon = 0.0001;
  return !(
    room1.x + room1.width <= room2.x + epsilon ||  // room1 is to the left of room2
    room1.x >= room2.x + room2.width - epsilon ||  // room1 is to the right of room2
    room1.y + room1.height <= room2.y + epsilon || // room1 is above room2
    room1.y >= room2.y + room2.height - epsilon    // room1 is below room2
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
 * Round to grid precision
 */
function roundToPrecision(value: number): number {
  return Math.round(value / GRID_PRECISION) * GRID_PRECISION;
}

/**
 * Calculate distance between two points
 */
function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Generate smart snap positions based on edges of nearby rooms
 * This creates positions that align with or are adjacent to existing rooms
 */
function generateSnapPositions(
  movingRoom: DroppedRoom,
  targetX: number,
  targetY: number,
  allRooms: DroppedRoom[],
  searchRadius: number = 10
): Array<{ x: number; y: number; score: number }> {
  const positions: Array<{ x: number; y: number; score: number }> = [];
  const otherRooms = allRooms.filter((r) => r.id !== movingRoom.id);

  // Always include the target position
  positions.push({ x: targetX, y: targetY, score: 0 });

  // For each nearby room, generate snap positions at their edges
  for (const room of otherRooms) {
    // Only consider rooms within search radius
    const centerX = room.x + room.width / 2;
    const centerY = room.y + room.height / 2;
    if (distance(targetX, targetY, centerX, centerY) > searchRadius + Math.max(movingRoom.width, movingRoom.height)) {
      continue;
    }

    // Snap to right edge of this room
    const rightSnap = { 
      x: roundToPrecision(room.x + room.width), 
      y: roundToPrecision(room.y),
      score: 1 // Bonus for edge alignment
    };
    positions.push(rightSnap);

    // Snap to left edge of this room
    const leftSnap = { 
      x: roundToPrecision(room.x - movingRoom.width), 
      y: roundToPrecision(room.y),
      score: 1
    };
    positions.push(leftSnap);

    // Snap to bottom edge of this room
    const bottomSnap = { 
      x: roundToPrecision(room.x), 
      y: roundToPrecision(room.y + room.height),
      score: 1
    };
    positions.push(bottomSnap);

    // Snap to top edge of this room
    const topSnap = { 
      x: roundToPrecision(room.x), 
      y: roundToPrecision(room.y - movingRoom.height),
      score: 1
    };
    positions.push(topSnap);

    // Align horizontally with room (same Y, adjacent X)
    positions.push({ 
      x: roundToPrecision(room.x + room.width), 
      y: roundToPrecision(targetY),
      score: 0.5
    });
    positions.push({ 
      x: roundToPrecision(room.x - movingRoom.width), 
      y: roundToPrecision(targetY),
      score: 0.5
    });

    // Align vertically with room (same X, adjacent Y)
    positions.push({ 
      x: roundToPrecision(targetX), 
      y: roundToPrecision(room.y + room.height),
      score: 0.5
    });
    positions.push({ 
      x: roundToPrecision(targetX), 
      y: roundToPrecision(room.y - movingRoom.height),
      score: 0.5
    });

    // Corner alignments (useful for L-shaped layouts)
    // Top-right of other room
    positions.push({
      x: roundToPrecision(room.x + room.width),
      y: roundToPrecision(room.y - movingRoom.height),
      score: 0.8
    });
    // Bottom-right of other room
    positions.push({
      x: roundToPrecision(room.x + room.width),
      y: roundToPrecision(room.y + room.height),
      score: 0.8
    });
    // Top-left of other room
    positions.push({
      x: roundToPrecision(room.x - movingRoom.width),
      y: roundToPrecision(room.y - movingRoom.height),
      score: 0.8
    });
    // Bottom-left of other room
    positions.push({
      x: roundToPrecision(room.x - movingRoom.width),
      y: roundToPrecision(room.y + room.height),
      score: 0.8
    });
  }

  return positions;
}

/**
 * Find the best valid position for a room based on:
 * 1. Proximity to target position
 * 2. Alignment with other room edges (snap points)
 * 3. No collisions
 */
export function findBestValidPosition(
  movingRoom: DroppedRoom,
  targetX: number,
  targetY: number,
  allRooms: DroppedRoom[],
  maxSearchDistance: number = 10
): { x: number; y: number; hasCollision: boolean } {
  const otherRooms = allRooms.filter((r) => r.id !== movingRoom.id);

  // If target position is valid, use it
  if (!wouldCollide(movingRoom, targetX, targetY, allRooms)) {
    return { x: targetX, y: targetY, hasCollision: false };
  }

  // Generate smart snap positions
  const snapPositions = generateSnapPositions(movingRoom, targetX, targetY, allRooms, maxSearchDistance);

  // Filter valid positions and score them
  const validPositions: Array<{ x: number; y: number; score: number; distance: number }> = [];

  for (const pos of snapPositions) {
    // Skip positions outside canvas (negative coordinates will be handled by shift)
    if (pos.x < -maxSearchDistance || pos.y < -maxSearchDistance) continue;

    // Check if this position is valid (no collision)
    if (!wouldCollide(movingRoom, pos.x, pos.y, otherRooms)) {
      const dist = distance(targetX, targetY, pos.x, pos.y);
      if (dist <= maxSearchDistance) {
        validPositions.push({
          x: pos.x,
          y: pos.y,
          score: pos.score,
          distance: dist,
        });
      }
    }
  }

  // If no snap positions work, try a fine grid search around the target
  if (validPositions.length === 0) {
    const step = 0.5;
    for (let dy = -maxSearchDistance; dy <= maxSearchDistance; dy += step) {
      for (let dx = -maxSearchDistance; dx <= maxSearchDistance; dx += step) {
        const testX = roundToPrecision(targetX + dx);
        const testY = roundToPrecision(targetY + dy);
        
        if (!wouldCollide(movingRoom, testX, testY, otherRooms)) {
          const dist = distance(targetX, targetY, testX, testY);
          validPositions.push({
            x: testX,
            y: testY,
            score: 0,
            distance: dist,
          });
        }
      }
    }
  }

  if (validPositions.length === 0) {
    // No valid position found
    return { x: movingRoom.x, y: movingRoom.y, hasCollision: true };
  }

  // Sort by: 
  // 1. Prefer positions closer to target
  // 2. Among similar distances, prefer snap positions (higher score)
  validPositions.sort((a, b) => {
    // Weight distance more heavily, but give bonus to snap positions
    const aWeighted = a.distance - a.score * 0.5;
    const bWeighted = b.distance - b.score * 0.5;
    return aWeighted - bWeighted;
  });

  const best = validPositions[0];
  return { x: best.x, y: best.y, hasCollision: false };
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
