export interface UserType {
  userId: string;
  firstName: string;
  lastName: string;
  roles: [string];
  src: string;
  fallback: string;
  phoneNumber: string;
  email: string;
  buildingName: string;
}

export interface UsersType {
  users: UserType[];
}
