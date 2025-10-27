export interface Occupant {
  id: number;
  name: string;
  email?: string;
}

export interface Apartment {
  id: number;
  apartmentNumber: number;
  occupants: Occupant[];
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

export interface BuildingsTableProps {
  buildings: Building[];
}
