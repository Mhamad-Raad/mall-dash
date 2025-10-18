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

import { formatCompact } from '@/lib/formatNumbers';

import type { HomeCardsProps } from '@/interfaces/Home.interface';

const HomeCards = ({ cards }: HomeCardsProps) => {
  return (
    <div className='flex flex-wrap items-center gap-5'>
      {cards.map((card, index) => (
        <Card key={index} className='@container/card w-[210px]'>
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {formatCompact(card.value)}
            </CardTitle>
            <CardAction>
              <Badge variant='outline'>
                {card.badge.text}
                {card.badge.trendingUp === true && <TrendingUpIcon />}
                {card.badge.trendingUp === false && <TrendingDownIcon />}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='text-muted-foreground line-clamp-1 flex gap-2 font-medium'>
              {card.footer}
              {card.badge.trendingUp === true && (
                <TrendingUpIcon className='size-4' />
              )}
              {card.badge.trendingUp === false && (
                <TrendingDownIcon className='size-4' />
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HomeCards;
