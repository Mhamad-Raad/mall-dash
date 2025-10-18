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
    type: 'Market',
    vendor: 'Mini-Markety barzyakan',
    sold: '10',
  },
  {
    id: '2',
    type: 'Restaurant',
    vendor: 'Aland StakeHouse',
    sold: '20',
  },
  {
    id: '3',
    type: 'Bakery',
    vendor: 'Barzayakan Bakery',
    sold: '12',
  },
  {
    id: '4',
    type: 'Market',
    vendor: 'Mini-Markety barzyakany 2',
    sold: '100',
  },
];

const TopSelling = () => {
  return (
    <div className='w-full'>
      <div className='[&>div]:rounded-sm [&>div]:border'>
        {/* Scrollable Table Container */}
        <div className='max-h-[300px] overflow-y-auto'>
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
        </div>
      </div>
    </div>
  );
};

export default TopSelling;
