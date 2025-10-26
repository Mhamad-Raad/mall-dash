export interface Apartment {
  id: number;
  apartmentNumber: number;
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
