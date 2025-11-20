import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VendorDetailErrorProps {
  error?: string;
  onBack: () => void;
}

const VendorDetailError = ({ error, onBack }: VendorDetailErrorProps) => {
  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' onClick={onBack}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Vendors
        </Button>
      </div>

      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className='max-w-md w-full'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center text-center space-y-4'>
              <div className='rounded-full bg-destructive/10 p-3'>
                <AlertCircle className='h-10 w-10 text-destructive' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-xl font-semibold'>Vendor Not Found</h3>
                <p className='text-sm text-muted-foreground'>
                  {error || 'The vendor you are looking for does not exist or has been removed.'}
                </p>
              </div>
              <Button onClick={onBack} className='w-full'>
                Return to Vendors List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDetailError;
