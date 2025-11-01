export interface Occupant {
  id: number;
  name: string;
  email?: string;
}

export interface Apartment {
  id: number;
  apartmentNumber: number;
  name?: string;
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

export interface BuildingType {
  id: number;
  name: string;
  numberOfFloors: number;
  totalApartments: number;
  occupants: 0;
  floors?: Floor[]
}
