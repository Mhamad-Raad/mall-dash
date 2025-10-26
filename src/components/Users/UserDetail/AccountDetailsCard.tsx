import { Calendar, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AccountDetailsCard = () => {
  return (
    <Card className='md:col-span-2'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2'>
          <UserIcon className='h-5 w-5' />
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Calendar className='h-4 w-4' />
              <span className='font-medium'>Account Created</span>
            </div>
            <p className='text-base font-semibold'>January 15, 2024</p>
          </div>
          <div className='space-y-2'>
            <div className='text-sm text-muted-foreground font-medium'>Last Login</div>
            <p className='text-base font-semibold'>October 25, 2025</p>
          </div>
          <div className='space-y-2'>
            <div className='text-sm text-muted-foreground font-medium'>Status</div>
            <Badge
              variant='outline'
              className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 w-fit'
            >
              Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;
