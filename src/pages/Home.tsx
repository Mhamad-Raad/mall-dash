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

const recentItems = [
  {
    id: '1',
    name: 'Philip George',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    fallback: 'PG',
    vendor: 'Mini-Markety barzyakan',
    location: 'Mumbai, India',
    status: 'On Going',
  },
  {
    id: '2',
    name: 'Tiana Curtis',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    fallback: 'TC',
    vendor: 'Aland StakeHouse',
    location: 'New York, US',
    status: 'Canceled',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    vendor: 'Barzayakan Bakery',
    location: 'Washington, US',
    status: 'On the Way',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    vendor: 'Mini-Markety barzyakany 2',
    location: 'Busan, South Korea',
    status: 'Delivered',
  },
];

const topSellingItems = [
  {
    id: '1',
    type: 'Market',
    vendor: 'Mini-Markety barzyakan',
    sold: 10,
  },
  {
    id: '2',
    type: 'Restaurant',
    vendor: 'Aland StakeHouse',
    sold: 20,
  },
  {
    id: '3',
    type: 'Bakery',
    vendor: 'Barzayakan Bakery',
    sold: 12,
  },
  {
    id: '4',
    type: 'Market',
    vendor: 'Mini-Markety barzyakany 2',
    sold: 100,
  },
];

const Home = () => {
  return (
    <div className='flex flex-col gap-12'>
      <CardsHome cards={cardsInfo} />
      <div className='flex items-center gap-6'>
        <div className='w-[60%] h-[400px] bg-card flex flex-col gap-4 border rounded-md p-4'>
          <h3 className='font-bold'>Recent Orders</h3>
          <RecentOrdersHome items={recentItems} />
        </div>
        <div className='w-[30%] h-[400px] bg-card flex flex-col gap-4 border rounded-md p-4'>
          <h3 className='font-bold'>Top Selling</h3>
          <TopSellingHome items={topSellingItems} />
        </div>
      </div>
    </div>
  );
};

export default Home;
