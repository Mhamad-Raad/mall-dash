export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  role: number;
  src: string;
  fallback: string;
  phoneNumber: string;
  email: string;
  buildingName: string;
}

export interface UsersType {
  users: UserType[];
}
