export type RoomType =
  | 'bedroom'
  | 'bathroom'
  | 'kitchen'
  | 'living'
  | 'dining'
  | 'balcony'
  | 'storage'
  | 'office'
  | 'hallway'
  | 'entrance';

export type DoorEdge = 'top' | 'bottom' | 'left' | 'right';

export interface Door {
  id: string;
  roomId: string;         // Room this door belongs to
  connectedRoomId?: string; // Optional connected room (null if external door)
  edge: DoorEdge;         // Which edge of the room the door is on
  position: number;       // Position along the edge (0-1 representing percentage)
  width: number;          // Door width in meters (typically 0.8-1.2m)
}

export interface Occupant {
  id: string;
  name: string;
  email: string;
}

export interface RoomLayout {
  id: string;
  type: RoomType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ApartmentLayout {
  rooms: RoomLayout[];
  doors: Door[];
  gridSize: number;
}

export interface Apartment {
  id: number;
  apartmentName?: string;
  occupant: Occupant | null; // New API format uses single occupant
  layout?: ApartmentLayout; // Floor plan layout
}

export interface Floor {
  id: number;
  floorNumber: number;
  apartments: Apartment[];
}

export interface Building {
  id: number;
  name: string;
  floors: Floor[];
}

// API response interface for building detail

export interface BuildingDetailFloor {
  id: number;
  floorNumber: number;
  apartments: Apartment[];
}

export interface BuildingDetail {
  id: number;
  name: string;
  floors: BuildingDetailFloor[];
}

// API response interface for buildings list
export interface BuildingListItem {
  id: number;
  name: string;
  numberOfFloors: number;
  totalApartments: number;
  occupants: number;
}

export interface BuildingsTableProps {
  buildings: BuildingListItem[];
}

export interface BuildingType {
  id: number;
  name: string;
  numberOfFloors: number;
  totalApartments: number;
  occupants: 0;
  floors?: Floor[];
}
