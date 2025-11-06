export interface VendorType {
  _id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  logo: string;
  fallback: string;
  workingHours: {
    open: string;  // e.g., "09:00"
    close: string; // e.g., "18:00"
  };
  type: string; // e.g., "Restaurant", "Market", "Bakery"
  description?: string;
  buildingName?: string;
  apartmentNumber?: string;
}

export interface VendorsType {
  vendors: VendorType[];
}
