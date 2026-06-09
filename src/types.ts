export interface NoteCard {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  isFavorite: boolean;
  color: string; // solid bg color class
  gradient: string; // gradient bg color class
  tags: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  category: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
}
