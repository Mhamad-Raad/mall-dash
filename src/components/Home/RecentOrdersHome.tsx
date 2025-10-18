import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const items = [
  {
    id: '1',
    name: 'Philip George',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    fallback: 'PG',
    vendor: 'Mini-Markety barzyakan',
    location: 'Mumbai, India',
    status: 'On Going',
  },
  {
    id: '2',
    name: 'Tiana Curtis',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    fallback: 'TC',
    vendor: 'Aland StakeHouse',
    location: 'New York, US',
    status: 'Canceled',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
];

const RecentOrdersHome = () => {
  return (
    <div className='w-full'>
      <div className='[&>div]:rounded-sm [&>div]:border'>
        {/* Scrollable Table Container */}
        <div className='max-h-[300px] overflow-y-auto'>
          <Table className='min-w-full'>
            <TableHeader>
              <TableRow className='bg-background'>
                <TableHead className='bg-background sticky top-0 z-10'>
                  User
                </TableHead>
                <TableHead className='bg-background sticky top-0 z-10'>
                  Vendor
                </TableHead>
                <TableHead className='bg-background sticky top-0 z-10'>
                  Address
                </TableHead>
                <TableHead className='bg-background sticky top-0 z-10'>
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id + item.vendor}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage src={item.src} alt={item.fallback} />
                        <AvatarFallback className='text-xs'>
                          {item.fallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className='font-medium'>{item.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersHome;
