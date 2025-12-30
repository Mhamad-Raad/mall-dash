// Re-export types from the central interface
export type {
  RoomType,
  RoomLayout as Room,
  ApartmentLayout,
  Door,
  DoorEdge,
} from '@/interfaces/Building.interface';

import type { RoomType } from '@/interfaces/Building.interface';

export const ROOM_TYPES: {
  type: RoomType;
  label: string;
  color: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}[] = [
  {
    type: 'bedroom',
    label: 'Bedroom',
    color: '#8B5CF6',
    icon: 'bed',
    defaultWidth: 4,
    defaultHeight: 3,
  },
  {
    type: 'bathroom',
    label: 'Bathroom',
    color: '#06B6D4',
    icon: 'bath',
    defaultWidth: 2,
    defaultHeight: 2,
  },
  {
    type: 'kitchen',
    label: 'Kitchen',
    color: '#F59E0B',
    icon: 'cooking-pot',
    defaultWidth: 3,
    defaultHeight: 2,
  },
  {
    type: 'living',
    label: 'Living Room',
    color: '#10B981',
    icon: 'sofa',
    defaultWidth: 5,
    defaultHeight: 4,
  },
  {
    type: 'dining',
    label: 'Dining',
    color: '#EC4899',
    icon: 'utensils',
    defaultWidth: 3,
    defaultHeight: 3,
  },
  {
    type: 'balcony',
    label: 'Balcony',
    color: '#84CC16',
    icon: 'fence',
    defaultWidth: 4,
    defaultHeight: 1,
  },
  {
    type: 'storage',
    label: 'Storage',
    color: '#6B7280',
    icon: 'archive',
    defaultWidth: 2,
    defaultHeight: 1,
  },
  {
    type: 'office',
    label: 'Office',
    color: '#3B82F6',
    icon: 'briefcase',
    defaultWidth: 3,
    defaultHeight: 3,
  },
  {
    type: 'hallway',
    label: 'Hallway',
    color: '#A78BFA',
    icon: 'move-horizontal',
    defaultWidth: 4,
    defaultHeight: 1,
  },
  {
    type: 'entrance',
    label: 'Entrance',
    color: '#F97316',
    icon: 'door-open',
    defaultWidth: 2,
    defaultHeight: 2,
  },
];

export const getRoomConfig = (type: RoomType) =>
  ROOM_TYPES.find((r) => r.type === type)!;
