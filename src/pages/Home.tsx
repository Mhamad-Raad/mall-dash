import CardsHome from '@/components/Home/CardsHome';
import RecentOrdersHome from '@/components/Home/RecentOrdersHome';
import TopSellingHome from '@/components/Home/TopSellingHome';

const cardsInfo = [
  {
    title: 'Orders',
    value: '1000',
    badge: { text: '-20%', trendingUp: false },
    footer: 'Down 20% this Month',
  },
  {
    title: 'Users',
    value: '253',
    badge: { text: 'App', trendingUp: null },
    footer: 'Application Wide',
  },
  {
    title: 'Vendors',
    value: '3',
    badge: { text: 'Web', trendingUp: null },
    footer: 'Web Based Vendors',
  },
  {
    title: 'Requests',
    value: '20',
    badge: { text: '+5%', trendingUp: true },
    footer: 'Customer Requests',
  },
];

const Home = () => {
  return (
    <div className='flex flex-col gap-12'>
      <CardsHome cards={cardsInfo} />
      <div className='flex items-center gap-6'>
        <div className='w-[60%] h-[400px] bg-card flex flex-col gap-4 border rounded-md p-4'>
          <h3 className='font-bold'>Recent Orders</h3>
          <RecentOrdersHome />
        </div>
        <div className='w-[30%] h-[400px] bg-card flex flex-col gap-4 border rounded-md p-4'>
          <h3 className='font-bold'>Top Selling</h3>
          <TopSellingHome />
        </div>
      </div>
    </div>
  );
};

export default Home;
