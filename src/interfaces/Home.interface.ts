export interface HomeCard {
  title: string;
  value: string;
  badge: { text: string; trendingUp: boolean | null };
  footer: string;
}

export interface HomeCardsProps {
  cards: HomeCard[];
}

export interface RecentOrderItems {
  id: string;
  name: string;
  src: string;
  fallback: string;
  vendor: string;
  location: string;
  status: string;
}

export interface RecentOrdersHomeProps {
  items: RecentOrderItems[];
}

export interface TopSellingItems {
  id: string;
  type: string;
  vendor: string;
  sold: number;
}

export interface TopSellingItemsHomeProps {
  items: TopSellingItems[];
}
