import CardsHome from '@/components/Home/CardsHome';
import RecentOrdersHome from '@/components/Home/RecentOrdersHome';
import TopSellingHome from '@/components/Home/TopSellingHome';
import ActivityChart from '@/components/Home/ActivityChart';
import RevenueSummary from '@/components/Home/RevenueSummary';
import MiniStatsCard from '@/components/Home/MiniStatsCard';
import OrderStatusChart from '@/components/Home/OrderStatusChart';
import CategoryPerformance from '@/components/Home/CategoryPerformance';
import OccupancyChart from '@/components/Home/OccupancyChart';
import { Package, TrendingUp, Users } from 'lucide-react';

const cardsInfo = [
  {
    title: 'Orders',
    value: 1010,
    badge: { text: '-20%', trendingUp: false },
    footer: 'Down 20% this Month',
  },
  {
    title: 'Users',
    value: 253,
    badge: { text: 'App', trendingUp: null },
    footer: 'Application Wide',
  },
  {
    title: 'Vendors',
    value: 3,
    badge: { text: 'Web', trendingUp: null },
    footer: 'Web Based Vendors',
  },
  {
    title: 'Requests',
    value: 20,
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

// Weekly activity data for chart
const weeklyOrders = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 65 },
  { label: 'Fri', value: 58 },
  { label: 'Sat', value: 72 },
  { label: 'Sun', value: 48 },
];

// Revenue data
const revenueData = {
  totalRevenue: 45280,
  monthlyGrowth: 12.5,
  avgOrderValue: 85.5,
  topVendorRevenue: {
    name: 'Mini-Markety barzyakany 2',
    amount: 15420,
  },
};

// Mini stats data with sparklines
const deliveryRate = {
  title: 'Delivery Rate',
  value: '94.5%',
  change: 2.3,
  sparklineData: [85, 88, 90, 87, 92, 94, 95, 93, 94, 96],
  icon: <Package className='size-5' />,
};

const customerGrowth = {
  title: 'Customer Growth',
  value: '+12.5%',
  change: 5.2,
  sparklineData: [100, 105, 108, 112, 115, 118, 120, 125, 128, 132],
  icon: <Users className='size-5' />,
};

const avgResponseTime = {
  title: 'Avg Response',
  value: '2.4m',
  change: -8.1,
  sparklineData: [5, 4.8, 4.5, 4, 3.5, 3.2, 2.8, 2.6, 2.5, 2.4],
  icon: <TrendingUp className='size-5' />,
};

// Order status data
const orderStatusData = [
  { status: 'Delivered', count: 156, color: '#22c55e' },
  { status: 'On the Way', count: 45, color: '#3b82f6' },
  { status: 'Processing', count: 28, color: '#f59e0b' },
  { status: 'Cancelled', count: 12, color: '#ef4444' },
];

// Category performance data
const categoryData = [
  { category: 'Groceries', value: 12500, color: '#3b82f6' },
  { category: 'Restaurants', value: 9800, color: '#f59e0b' },
  { category: 'Bakery', value: 7200, color: '#ec4899' },
  { category: 'Fast Food', value: 5400, color: '#8b5cf6' },
];

const Home = () => {
  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Stats Cards */}
      <CardsHome cards={cardsInfo} />

      {/* Chart and Revenue Summary */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 bg-card border rounded-lg p-6 shadow-sm'>
          <ActivityChart data={weeklyOrders} title='Weekly Orders' trend={8.2} />
        </div>
        <div className='lg:col-span-1'>
          <RevenueSummary
            totalRevenue={revenueData.totalRevenue}
            monthlyGrowth={revenueData.monthlyGrowth}
            avgOrderValue={revenueData.avgOrderValue}
            topVendorRevenue={revenueData.topVendorRevenue}
          />
        </div>
      </div>

      {/* Occupancy Chart */}
      <OccupancyChart totalApartments={180} occupied={142} totalBuildings={3} />

      {/* Recent Orders and Top Selling */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='xl:col-span-2 bg-card border rounded-lg p-6 shadow-sm'>
          <h3 className='text-lg font-semibold mb-4'>Recent Orders</h3>
          <RecentOrdersHome items={recentItems} />
        </div>
        <div className='xl:col-span-1 bg-card border rounded-lg p-6 shadow-sm'>
          <h3 className='text-lg font-semibold mb-4'>Top Selling</h3>
          <TopSellingHome items={topSellingItems} />
        </div>
      </div>

      {/* Mini Charts Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Mini Stats with Sparklines */}
        <MiniStatsCard {...deliveryRate} />
        <MiniStatsCard {...customerGrowth} />
        <MiniStatsCard {...avgResponseTime} />
      </div>

      {/* Performance Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <OrderStatusChart data={orderStatusData} />
        <CategoryPerformance data={categoryData} />
      </div>
    </div>
  );
};

export default Home;
