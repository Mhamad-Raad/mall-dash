import type { RoomType, RoomLayout, Door, DoorEdge } from '@/interfaces/Building.interface';

export interface LayoutItem extends RoomLayout {
  color: string;
}

export interface DraggableRoomData {
  type: 'room';
  roomType: RoomType;
  isNew?: boolean;
}

export interface DroppedRoom {
  id: string;
  type: RoomType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderColor: string;
}

export interface DesignerState {
  rooms: DroppedRoom[];
  doors: Door[];
  selectedRoomId: string | null;
  gridSize: number;
  zoom: number;
}

export interface RoomTemplate {
  type: RoomType;
  name: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  borderColor: string;
}

// Border colors matching the reference design
export const ROOM_TEMPLATES: RoomTemplate[] = [
  { type: 'bedroom', name: 'Bedroom', icon: '🛏️', defaultWidth: 4, defaultHeight: 3, borderColor: '#A855F7' },    // Purple
  { type: 'bathroom', name: 'Bathroom', icon: '🚿', defaultWidth: 2, defaultHeight: 2, borderColor: '#22D3EE' },  // Cyan
  { type: 'kitchen', name: 'Kitchen', icon: '🍳', defaultWidth: 3, defaultHeight: 2, borderColor: '#F59E0B' },    // Orange/Amber
  { type: 'living', name: 'Living Room', icon: '🛋️', defaultWidth: 5, defaultHeight: 4, borderColor: '#22C55E' }, // Green
  { type: 'dining', name: 'Dining', icon: '🍽️', defaultWidth: 4, defaultHeight: 3, borderColor: '#EC4899' },      // Pink
  { type: 'balcony', name: 'Balcony', icon: '🌿', defaultWidth: 3, defaultHeight: 2, borderColor: '#84CC16' },    // Lime
  { type: 'storage', name: 'Storage', icon: '📦', defaultWidth: 2, defaultHeight: 2, borderColor: '#64748B' },    // Slate
  { type: 'office', name: 'Office', icon: '💼', defaultWidth: 3, defaultHeight: 3, borderColor: '#6366F1' },      // Indigo
  { type: 'hallway', name: 'Hallway', icon: '↔️', defaultWidth: 3, defaultHeight: 2, borderColor: '#EAB308' },    // Yellow
  { type: 'entrance', name: 'Entrance', icon: '🚪', defaultWidth: 2, defaultHeight: 2, borderColor: '#F97316' },  // Orange
];

export const DOOR_EDGES: { value: DoorEdge; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

export const GRID_CELL_SIZE = 40; // pixels per grid cell
export const MIN_ROOM_SIZE = 1; // minimum 1 grid cell
export const MAX_ROOM_SIZE = 10; // maximum 10 grid cells
