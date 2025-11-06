import type { VendorType } from '@/interfaces/Vendor.interface';

export const initialVendor: VendorType = {
  _id: '',
  businessName: '',
  ownerName: '',
  email: '',
  phoneNumber: '',
  address: '',
  logo: '',
  fallback: '',
  workingHours: {
    open: '',
    close: '',
  },
  type: '',
  description: '',
  buildingName: '',
  apartmentNumber: '',
};
