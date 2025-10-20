export interface User {
  id: string;
  name: string;
  src: string;
  fallback: string;
  phoneNumber: string;
  email: string;
  type: string;
  buildingName: string;
}

export interface Users {
  users: User[];
}
