export interface HomeCard {
  title: string;
  value: string;
  badge: { text: string; trendingUp: boolean | null };
  footer: string;
}

export interface HomeCardsProps {
  cards: HomeCard[];
}
