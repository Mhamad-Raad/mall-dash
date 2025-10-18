import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CardsHome = () => {
  return (
    <div className='flex flex-wrap items-center gap-5'>
      <Card className='@container/card w-[210px]'>
        <CardHeader>
          <CardDescription>Orders this</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            1000
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingDownIcon />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground line-clamp-1 flex gap-2 font-medium'>
            Down 20% this Month <TrendingDownIcon className='size-4' />
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card w-[210px]'>
        <CardHeader>
          <CardDescription>Users</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            253
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>App</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground line-clamp-1 flex gap-2 font-medium'>
            Application Wide
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card w-[210px]'>
        <CardHeader>
          <CardDescription>Vendors</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            3
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>Web</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground line-clamp-1 flex gap-2 font-medium'>
            Website Wide
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card w-[210px]'>
        <CardHeader>
          <CardDescription>Requests</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            20
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>System</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground line-clamp-1 flex gap-2 font-medium'>
            System Wide <TrendingUpIcon className='size-4' />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardsHome;
