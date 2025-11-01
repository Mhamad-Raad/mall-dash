import { useNavigate } from 'react-router-dom';
import { Building2, Layers, Home, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { BuildingsTableProps } from '@/interfaces/Building.interface';

const BuildingsTable = ({ buildings }: BuildingsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (buildingId: number) => {
    navigate(`/buildings/${buildingId}`);
  };

  return (
    <div className='rounded-lg border bg-card shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable table area - responsive height based on viewport */}
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)] [&>div]:rounded-t-lg'>
        <Table className='w-full min-w-[700px]'>
          <TableHeader className='[&_tr:first-child>th:first-child]:rounded-tl-lg [&_tr:first-child>th:last-child]:rounded-tr-lg'>
            <TableRow className='hover:bg-transparent border-b'>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
                Building Name
              </TableHead>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
                Total Floors
              </TableHead>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
                Total Apartments
              </TableHead>
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
                Occupants
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildings.map((building) => (
              <TableRow
                key={building.id}
                className='hover:bg-muted/50 transition-colors cursor-pointer'
                onClick={() => handleRowClick(building.id)}
              >
                {/* Building Name */}
                <TableCell className='font-medium'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-primary/10 border-2 border-background shadow-sm'>
                      <Building2 className='h-5 w-5 text-primary' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-semibold text-sm'>{building.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        ID: {building.id}
                      </span>
                    </div>
                  </div>
                </TableCell>
                {/* Total Floors */}
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Layers className='size-3.5 text-muted-foreground' />
                    <span className='text-sm font-medium'>{building.numberOfFloors}</span>
                  </div>
                </TableCell>
                {/* Total Apartments */}
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Home className='size-3.5 text-muted-foreground' />
                    <span className='text-sm font-medium'>{building.totalApartments}</span>
                  </div>
                </TableCell>
                {/* Occupants */}
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Users className='size-3.5 text-muted-foreground' />
                    <span className='text-sm font-medium'>{building.occupants}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  );
};

export default BuildingsTable;
