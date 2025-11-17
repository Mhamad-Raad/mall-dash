import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Clock, Store as StoreIcon, ChevronRight } from 'lucide-react';
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
    return 'bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300 border-red-500/30 dark:border-red-500/40';
  if (typeLower === 'market')
    return 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 border-indigo-500/30 dark:border-indigo-500/40';
  if (typeLower === 'bakery')
    return 'bg-orange-500/15 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300 border-orange-500/30 dark:border-orange-500/40';
  if (typeLower === 'cafe')
    return 'bg-teal-500/15 text-teal-700 dark:bg-teal-500/25 dark:text-teal-300 border-teal-500/30 dark:border-teal-500/40';
  return 'bg-slate-500/15 text-slate-700 dark:bg-slate-500/25 dark:text-slate-300 border-slate-500/30 dark:border-slate-500/40';
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
      <div className='rounded-xl border bg-card shadow-sm p-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-10 bg-muted rounded' />
          <div className='h-16 bg-muted rounded' />
          <div className='h-16 bg-muted rounded' />
          <div className='h-16 bg-muted rounded' />
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable table area - responsive height based on viewport */}
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
        <Table className='w-full min-w-[700px]'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b bg-muted/50'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                Business
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                Owner
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                Type
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                Contact
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                Working Hours
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-12 bg-muted/50 backdrop-blur-sm border-b h-12'></TableHead>
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
                  className='group hover:bg-muted/50 transition-all cursor-pointer border-b last:border-0'
                  onClick={() => handleRowClick(vendor._id)}
                >
                  {/* Business Name */}
                  <TableCell className='py-4'>
                    <div className='flex items-center gap-3 min-w-[200px]'>
                      <Avatar className='h-11 w-11 border-2 border-border shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/50'>
                        <AvatarImage
                          src={vendor.logo}
                          alt={vendor.businessName}
                        />
                        <AvatarFallback className='text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/10 text-primary'>
                          {vendor.fallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col gap-0.5 min-w-0'>
                        <span className='font-semibold text-sm leading-tight group-hover:text-primary transition-colors truncate'>
                          {vendor.businessName}
                        </span>
                        {vendor.description && (
                          <span className='text-[11px] text-muted-foreground leading-tight truncate'>
                            {vendor.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Owner Name */}
                  <TableCell className='py-4'>
                    <span className='text-sm font-medium text-foreground/80'>{vendor.ownerName}</span>
                  </TableCell>

                  {/* Type */}
                  <TableCell className='py-4'>
                    <Badge
                      variant='outline'
                      className={`${getVendorTypeColor(vendor.type)} font-semibold text-xs px-3 py-1`}
                    >
                      {vendor.type}
                    </Badge>
                  </TableCell>

                  {/* Contact */}
                  <TableCell className='py-4'>
                    <div className='flex flex-col gap-2 min-w-[180px]'>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                          <Mail className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                        </div>
                        <span className='text-xs text-foreground/80 truncate'>{vendor.email}</span>
                      </div>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                          <Phone className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                        </div>
                        <span className='text-xs font-medium text-foreground/80 truncate'>{vendor.phoneNumber}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Working Hours */}
                  <TableCell className='py-4'>
                    <div className='flex items-center gap-2.5 min-w-[120px]'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                        <Clock className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='text-xs font-medium text-foreground/80 whitespace-nowrap'>
                        {vendor.workingHours.open} - {vendor.workingHours.close}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className='py-4'>
                    <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors' />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {/* Pagination footer */}
      <div className='border-t bg-muted/30 px-4 py-3 mt-auto'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 40, 50, 100]}
        />
      </div>
    </div>
  );
};

export default VendorsTable;
