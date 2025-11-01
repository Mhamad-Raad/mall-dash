import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const BuildingDetailError = ({
  error,
  onBack,
}: {
  error: string;
  onBack: () => void;
}) => (
  <div className='container mx-auto p-6 max-w-6xl'>
    <Button variant='ghost' className='mb-6' onClick={onBack}>
      <ArrowLeft className='mr-2 h-4 w-4' />
      Back to Buildings
    </Button>
    <Card className='p-12 text-center'>
      <CardTitle className='text-2xl mb-2'>Building Not Found</CardTitle>
      <CardDescription>{error}</CardDescription>
    </Card>
  </div>
);

export default BuildingDetailError;
