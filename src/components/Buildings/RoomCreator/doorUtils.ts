import type { Room, Door, DoorEdge } from './types';

export interface SharedEdge {
  room1Id: string;
  room2Id: string;
  edge: DoorEdge; // Edge from room1's perspective
  startPos: number; // Where the shared edge starts (in room1's edge coordinates)
  endPos: number;   // Where the shared edge ends
  // Absolute coordinates for rendering
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Find all shared edges between adjacent rooms
export const findSharedEdges = (rooms: Room[]): SharedEdge[] => {
  const edges: SharedEdge[] = [];
  const tolerance = 0.1; // Small tolerance for floating point comparisons

  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const r1 = rooms[i];
      const r2 = rooms[j];

      // Check if r2 is to the right of r1 (r1's right edge touches r2's left edge)
      if (Math.abs((r1.x + r1.width) - r2.x) < tolerance) {
        const overlapStart = Math.max(r1.y, r2.y);
        const overlapEnd = Math.min(r1.y + r1.height, r2.y + r2.height);
        if (overlapEnd > overlapStart) {
          edges.push({
            room1Id: r1.id,
            room2Id: r2.id,
            edge: 'right',
            startPos: (overlapStart - r1.y) / r1.height,
            endPos: (overlapEnd - r1.y) / r1.height,
            x1: r1.x + r1.width,
            y1: overlapStart,
            x2: r1.x + r1.width,
            y2: overlapEnd,
          });
        }
      }

      // Check if r2 is to the left of r1 (r1's left edge touches r2's right edge)
      if (Math.abs(r1.x - (r2.x + r2.width)) < tolerance) {
        const overlapStart = Math.max(r1.y, r2.y);
        const overlapEnd = Math.min(r1.y + r1.height, r2.y + r2.height);
        if (overlapEnd > overlapStart) {
          edges.push({
            room1Id: r1.id,
            room2Id: r2.id,
            edge: 'left',
            startPos: (overlapStart - r1.y) / r1.height,
            endPos: (overlapEnd - r1.y) / r1.height,
            x1: r1.x,
            y1: overlapStart,
            x2: r1.x,
            y2: overlapEnd,
          });
        }
      }

      // Check if r2 is below r1 (r1's bottom edge touches r2's top edge)
      if (Math.abs((r1.y + r1.height) - r2.y) < tolerance) {
        const overlapStart = Math.max(r1.x, r2.x);
        const overlapEnd = Math.min(r1.x + r1.width, r2.x + r2.width);
        if (overlapEnd > overlapStart) {
          edges.push({
            room1Id: r1.id,
            room2Id: r2.id,
            edge: 'bottom',
            startPos: (overlapStart - r1.x) / r1.width,
            endPos: (overlapEnd - r1.x) / r1.width,
            x1: overlapStart,
            y1: r1.y + r1.height,
            x2: overlapEnd,
            y2: r1.y + r1.height,
          });
        }
      }

      // Check if r2 is above r1 (r1's top edge touches r2's bottom edge)
      if (Math.abs(r1.y - (r2.y + r2.height)) < tolerance) {
        const overlapStart = Math.max(r1.x, r2.x);
        const overlapEnd = Math.min(r1.x + r1.width, r2.x + r2.width);
        if (overlapEnd > overlapStart) {
          edges.push({
            room1Id: r1.id,
            room2Id: r2.id,
            edge: 'top',
            startPos: (overlapStart - r1.x) / r1.width,
            endPos: (overlapEnd - r1.x) / r1.width,
            x1: overlapStart,
            y1: r1.y,
            x2: overlapEnd,
            y2: r1.y,
          });
        }
      }
    }
  }

  return edges;
};

// Find shared edge for a specific door
export const findEdgeForDoor = (
  door: Door,
  rooms: Room[]
): SharedEdge | null => {
  const edges = findSharedEdges(rooms);
  return edges.find(
    (e) =>
      (e.room1Id === door.roomId && e.room2Id === door.connectedRoomId) ||
      (e.room2Id === door.roomId && e.room1Id === door.connectedRoomId)
  ) || null;
};

// Get door position in absolute coordinates
export const getDoorPosition = (
  door: Door,
  room: Room,
  cellSize: number
): { x: number; y: number; width: number; height: number; rotation: number } => {
  const doorWidthPx = door.width * cellSize;
  const isVertical = door.edge === 'left' || door.edge === 'right';

  let x = room.x * cellSize;
  let y = room.y * cellSize;

  if (door.edge === 'top') {
    x += room.width * cellSize * door.position - doorWidthPx / 2;
    y -= 4; // Center on edge
  } else if (door.edge === 'bottom') {
    x += room.width * cellSize * door.position - doorWidthPx / 2;
    y += room.height * cellSize - 4;
  } else if (door.edge === 'left') {
    x -= 4;
    y += room.height * cellSize * door.position - doorWidthPx / 2;
  } else if (door.edge === 'right') {
    x += room.width * cellSize - 4;
    y += room.height * cellSize * door.position - doorWidthPx / 2;
  }

  return {
    x,
    y,
    width: isVertical ? 8 : doorWidthPx,
    height: isVertical ? doorWidthPx : 8,
    rotation: 0,
  };
};

// Check if a point is near a shared edge (for click detection)
export const getEdgeAtPoint = (
  x: number,
  y: number,
  rooms: Room[],
  cellSize: number,
  threshold: number = 15
): SharedEdge | null => {
  const edges = findSharedEdges(rooms);

  for (const edge of edges) {
    const x1 = edge.x1 * cellSize;
    const y1 = edge.y1 * cellSize;
    const x2 = edge.x2 * cellSize;
    const y2 = edge.y2 * cellSize;

    // Calculate distance from point to line segment
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) continue;

    // Project point onto line
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (length * length)));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    const distance = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);

    if (distance < threshold) {
      return edge;
    }
  }

  return null;
};

// Generate a unique door ID
export const generateDoorId = () =>
  `door-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
