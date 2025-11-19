// API Response Type
export interface VendorAPIResponse {
  id: number;
  name: string;
  description: string;
  profileImageUrl: string | null;
  openingTime: string; // "02:16:00"
  closeTime: string; // "06:20:00"
  type: string; // "Restaurant"
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  userEmail: string;
}

// UI Display Type (for backwards compatibility with existing components)
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
  userId?: string;
}

export interface VendorsType {
  vendors: VendorType[];
}

// Helper function to convert API response to UI type
export function mapVendorAPIToUI(apiVendor: VendorAPIResponse): VendorType {
  return {
    _id: apiVendor.id.toString(),
    businessName: apiVendor.name,
    ownerName: `${apiVendor.firstName} ${apiVendor.lastName}`,
    email: apiVendor.userEmail,
    phoneNumber: apiVendor.phone,
    address: '', // Not provided in API
    logo: apiVendor.profileImageUrl || '',
    fallback: apiVendor.name.substring(0, 2).toUpperCase(),
    workingHours: {
      open: apiVendor.openingTime.substring(0, 5), // "02:16:00" -> "02:16"
      close: apiVendor.closeTime.substring(0, 5), // "06:20:00" -> "06:20"
    },
    type: apiVendor.type,
    description: apiVendor.description,
    buildingName: undefined,
    apartmentNumber: undefined,
    userId: apiVendor.userId,
  };
}
