import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { TopSellingItemsHomeProps } from '@/interfaces/Home.interface';

const TopSelling = ({ items }: TopSellingItemsHomeProps) => {
  return (
    <div className='w-full'>
      <div className='[&>div]:rounded-sm [&>div]:border'>
        {/* Scrollable Table Container */}
        <ScrollArea className='h-[300px] overflow-y-auto'>
          <Table className='min-w-full'>
            <TableHeader>
              <TableRow className='bg-background'>
                <TableHead className='bg-background sticky top-0 z-10'>
                  Vendor
                </TableHead>
                <TableHead className='bg-background sticky top-0 z-10'>
                  Type
                </TableHead>
                <TableHead className='bg-background sticky top-0 z-10'>
                  Sold
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.sold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TopSelling;
