import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building2, Layers, Home, Users, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import BuildingsTableSkeleton from './BuildingsTableSkeleton';
import CustomTablePagination from '../CustomTablePagination';
import type { RootState } from '@/store/store';

const BuildingsTable = () => {
  const { buildings, total, loading, error } = useSelector(
    (state: RootState) => state.buildings
  );
  const navigate = useNavigate();

  const handleRowClick = (buildingId: number) => {
    navigate(`/buildings/${buildingId}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
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
                Building Name
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 text-center'>
                Total Floors
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 text-center'>
                Total Apartments
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 text-center'>
                Occupants
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-12 bg-muted/50 backdrop-blur-sm border-b h-12'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <BuildingsTableSkeleton key={`skeleton-${index}`} />
                ))
              : buildings.map((building) => (
                  <TableRow
                    key={building.id}
                    className='group hover:bg-muted/50 transition-all cursor-pointer border-b last:border-0'
                    onClick={() => handleRowClick(building.id)}
                  >
                  <TableCell className='font-medium py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2.5 rounded-lg bg-primary/10 border border-primary/20 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/50'>
                        <Building2 className='h-5 w-5 text-primary' />
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-semibold text-sm leading-tight group-hover:text-primary transition-colors'>{building.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center py-4'>
                    <div className='flex items-center justify-center gap-2.5'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                        <Layers className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='text-xs font-medium text-foreground/80'>
                        {building.numberOfFloors}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-center py-4'>
                    <div className='flex items-center justify-center gap-2.5'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                        <Home className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='text-xs font-medium text-foreground/80'>
                        {building.totalApartments}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-center py-4'>
                    <div className='flex items-center justify-center gap-2.5'>
                      <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                        <Users className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <span className='text-xs font-medium text-foreground/80'>
                        {building.occupants}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='py-4'>
                    <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors' />
                  </TableCell>
                </TableRow>
              ))
            }
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

export default BuildingsTable;
