import { TrendingDownIcon, TrendingUpIcon, ShoppingCart, Users, Store, FileText } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { formatCompact } from '@/lib/formatNumbers';

import type { HomeCardsProps } from '@/interfaces/Home.interface';

const cardIcons = {
  Orders: ShoppingCart,
  Users: Users,
  Vendors: Store,
  Requests: FileText,
};

const cardIconColors = {
  Orders: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  Users: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  Vendors: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
  Requests: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
};

const HomeCards = ({ cards }: HomeCardsProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
      {cards.map((card, index) => {
        const Icon = cardIcons[card.title as keyof typeof cardIcons] || FileText;
        const iconColorClass = cardIconColors[card.title as keyof typeof cardIconColors] || cardIconColors.Requests;
        
        return (
          <Card key={index} className='@container/card flex flex-col transition-all hover:shadow-lg'>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex flex-col gap-1 flex-1'>
                  <CardDescription className='text-sm font-medium'>
                    {card.title}
                  </CardDescription>
                  <CardTitle className='text-3xl font-bold tabular-nums'>
                    {formatCompact(card.value)}
                  </CardTitle>
                </div>
                <div className={`p-3 rounded-full ${iconColorClass}`}>
                  <Icon className='size-5' />
                </div>
              </div>
              <Badge 
                variant='outline' 
                className={`gap-1 w-fit mt-2 ${
                  card.badge.trendingUp === true 
                    ? 'border-green-500/50 text-green-700 dark:text-green-400' 
                    : card.badge.trendingUp === false 
                    ? 'border-red-500/50 text-red-700 dark:text-red-400' 
                    : 'border-blue-500/50 text-blue-700 dark:text-blue-400'
                }`}
              >
                {card.badge.text}
                {card.badge.trendingUp === true && <TrendingUpIcon className='size-3' />}
                {card.badge.trendingUp === false && <TrendingDownIcon className='size-3' />}
              </Badge>
            </CardHeader>
            <CardFooter className='pt-0 pb-4'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                {card.badge.trendingUp === true && (
                  <TrendingUpIcon className='size-3.5 text-green-600 dark:text-green-400' />
                )}
                {card.badge.trendingUp === false && (
                  <TrendingDownIcon className='size-3.5 text-red-600 dark:text-red-400' />
                )}
                <span className='line-clamp-1'>{card.footer}</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default HomeCards;
