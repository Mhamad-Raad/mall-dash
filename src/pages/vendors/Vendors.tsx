import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import VendorsFilters from '@/components/Vendors/VendorsFilters';
import VendorsTable from '@/components/Vendors/VendorsTable';
import type { VendorType } from '@/interfaces/Vendor.interface';

// Mock data for now - replace with API call later
const mockVendors: VendorType[] = [
  {
    _id: '1',
    businessName: 'Mini-Markety barzyakan',
    ownerName: 'Ahmed Hassan',
    email: 'contact@minimarket.com',
    phoneNumber: '+964 770 123 4567',
    address: '123 Main Street',
    logo: '',
    fallback: 'MM',
    workingHours: {
      open: '08:00',
      close: '22:00',
    },
    type: 'Market',
    description: 'Your neighborhood grocery store',
    buildingName: 'Building A',
    apartmentNumber: '101',
  },
  {
    _id: '2',
    businessName: 'Aland StakeHouse',
    ownerName: 'Aland Mohammed',
    email: 'info@alandsteak.com',
    phoneNumber: '+964 770 234 5678',
    address: '456 Food Street',
    logo: '',
    fallback: 'AS',
    workingHours: {
      open: '12:00',
      close: '23:00',
    },
    type: 'Restaurant',
    description: 'Premium steakhouse experience',
    buildingName: 'Building B',
    apartmentNumber: '205',
  },
  {
    _id: '3',
    businessName: 'Barzayakan Bakery',
    ownerName: 'Sarah Ali',
    email: 'hello@barzayakan.com',
    phoneNumber: '+964 770 345 6789',
    address: '789 Bakery Lane',
    logo: '',
    fallback: 'BB',
    workingHours: {
      open: '06:00',
      close: '20:00',
    },
    type: 'Bakery',
    description: 'Fresh bread daily',
    buildingName: 'Building C',
    apartmentNumber: '105',
  },
  {
    _id: '4',
    businessName: 'Cafe Latte',
    ownerName: 'Omar Khalil',
    email: 'contact@cafelatte.com',
    phoneNumber: '+964 770 456 7890',
    address: '321 Coffee Street',
    logo: '',
    fallback: 'CL',
    workingHours: {
      open: '07:00',
      close: '21:00',
    },
    type: 'Cafe',
    description: 'Specialty coffee and pastries',
    buildingName: 'Building A',
    apartmentNumber: '302',
  },
  {
    _id: '5',
    businessName: 'Mini-Markety barzyakany 2',
    ownerName: 'Karim Mustafa',
    email: 'info@minimarket2.com',
    phoneNumber: '+964 770 567 8901',
    address: '555 Market Road',
    logo: '',
    fallback: 'M2',
    workingHours: {
      open: '08:00',
      close: '23:00',
    },
    type: 'Market',
    description: 'Convenience store with extended hours',
    buildingName: 'Building D',
    apartmentNumber: '110',
  },
];

const Vendors = () => {
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const typeFilter = searchParams.get('type') || '';

  // Filter vendors based on search and type
  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) => {
      const matchesSearch =
        !search ||
        vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
        vendor.ownerName.toLowerCase().includes(search.toLowerCase()) ||
        vendor.email.toLowerCase().includes(search.toLowerCase());

      const matchesType = !typeFilter || typeFilter === '-1' || vendor.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <VendorsFilters />

      {/* Vendors Table */}
      <div className='flex-1 min-h-0'>
        <VendorsTable
          vendors={filteredVendors}
          total={filteredVendors.length}
          loading={false}
        />
      </div>
    </section>
  );
};

export default Vendors;
