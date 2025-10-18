import CardsHome from '@/components/Home/CardsHome';

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
    <div className='flex flex-col gap-4'>
      <CardsHome cards={cardsInfo} />
    </div>
  );
};

export default Home;
