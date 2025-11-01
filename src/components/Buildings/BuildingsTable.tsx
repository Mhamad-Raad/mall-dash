import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building2, Layers, Home, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CustomTablePagination from '../CustomTablePagination';
import type { RootState } from '@/store/store';

const BuildingsTable = () => {
  const { buildings, total } = useSelector(
    (state: RootState) => state.buildings
  );
  const navigate = useNavigate();

  const handleRowClick = (buildingId: number) => {
    navigate(`/buildings/${buildingId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent border-b'>
          <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
            Building Name
          </TableHead>
          <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b text-center'>
            Total Floors
          </TableHead>
          <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b text-center'>
            Total Apartments
          </TableHead>
          <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b text-center'>
            Occupants
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {buildings.map((building) => (
          <TableRow
            key={building.id}
            className='cursor-pointer hover:bg-muted/50 transition-colors'
            onClick={() => handleRowClick(building.id)}
          >
            <TableCell className='font-medium'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/5 border'>
                  <Building2 className='h-5 w-5 text-primary' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold text-base'>{building.name}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className='text-center'>
              <div className='flex items-center justify-center gap-2'>
                <Layers className='h-4 w-4 text-muted-foreground' />
                <span className='font-semibold text-base'>
                  {building.numberOfFloors}
                </span>
              </div>
            </TableCell>
            <TableCell className='text-center'>
              <div className='flex items-center justify-center gap-2'>
                <Home className='h-4 w-4 text-muted-foreground' />
                <span className='font-semibold text-base'>
                  {building.totalApartments}
                </span>
              </div>
            </TableCell>
            <TableCell className='text-center'>
              <div className='flex items-center justify-center gap-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <span className='font-semibold text-base'>
                  {building.occupants}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <tfoot>
        <tr>
          <td colSpan={4}>
            <div className='border-t px-4 py-3 bg-muted/30'>
              <CustomTablePagination
                total={total}
                suggestions={[10, 20, 40, 50, 100]}
              />
            </div>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default BuildingsTable;
