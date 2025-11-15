import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Store as StoreIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CustomTablePagination from '../CustomTablePagination';
import type { VendorType } from '@/interfaces/Vendor.interface';

const getVendorTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower === 'restaurant')
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
  if (typeLower === 'market')
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  if (typeLower === 'bakery')
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  if (typeLower === 'cafe')
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
};

interface VendorsTableProps {
  vendors: VendorType[];
  total: number;
  loading: boolean;
}

const VendorsTable = ({ vendors, total, loading }: VendorsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (vendorId: string) => {
    navigate(`/vendors/${vendorId}`);
  };

  if (loading) {
    return (
      <div className='rounded-lg border bg-card shadow-sm'>
        <div className='p-8 text-center'>
          <div className='animate-pulse space-y-4'>
            <div className='h-10 bg-muted rounded' />
            <div className='h-16 bg-muted rounded' />
            <div className='h-16 bg-muted rounded' />
            <div className='h-16 bg-muted rounded' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg border bg-card shadow-sm flex flex-col h-[calc(100vh-280px)]'>
      <ScrollArea className='flex-1'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                Business
              </TableHead>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                Owner
              </TableHead>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                Type
              </TableHead>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                Contact
              </TableHead>

              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold'>
                Working Hours
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-32 text-center'>
                  <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground'>
                    <StoreIcon className='h-8 w-8' />
                    <p>No vendors found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow
                  key={vendor._id}
                  className='cursor-pointer hover:bg-muted/50 transition-colors'
                  onClick={() => handleRowClick(vendor._id)}
                >
                  {/* Business Name */}
                  <TableCell>
                    <div className='flex items-center gap-3 min-w-[200px]'>
                      <Avatar className='h-10 w-10 flex-shrink-0'>
                        <AvatarImage
                          src={vendor.logo}
                          alt={vendor.businessName}
                        />
                        <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                          {vendor.fallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col min-w-0'>
                        <span className='font-medium truncate'>
                          {vendor.businessName}
                        </span>
                        {vendor.description && (
                          <span className='text-xs text-muted-foreground truncate'>
                            {vendor.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Owner Name */}
                  <TableCell>
                    <span className='font-medium'>{vendor.ownerName}</span>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={getVendorTypeColor(vendor.type)}
                    >
                      {vendor.type}
                    </Badge>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className='flex flex-col gap-1 min-w-[180px]'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Mail className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0' />
                        <span className='truncate'>{vendor.email}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Phone className='h-3.5 w-3.5 flex-shrink-0' />
                        <span className='truncate'>{vendor.phoneNumber}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Working Hours */}
                  <TableCell>
                    <div className='flex items-center gap-2 min-w-[120px]'>
                      <Clock className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0' />
                      <span className='text-sm whitespace-nowrap'>
                        {vendor.workingHours.open} - {vendor.workingHours.close}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {/* Pagination */}
      <div className='border-t px-4 py-3 bg-muted/30'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 40, 50, 100]}
        />
      </div>
    </div>
  );
};

export default VendorsTable;
