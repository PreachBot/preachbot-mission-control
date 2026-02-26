export type WineType = 'red' | 'white' | 'rosé' | 'sparkling';

export interface WineEntry {
  id: string;
  name: string;
  producer?: string;
  vintage?: string;
  region?: string;
  country?: string;
  grapes?: string[];
  type: WineType;
  style?: string;
  priceRange?: string;
  foodPairings?: string[];
  wineryDescription?: string;
  photo?: string;
  rating: number; // 1-5
  liked: boolean;
  tastingNotes: string;
  location?: string; // Where you had it
  dateTasted: string;
  createdAt: string;
}

export interface WineAnalysis {
  name: string;
  producer: string;
  vintage?: string;
  region?: string;
  country?: string;
  grapes?: string[];
  type: WineType;
  style?: string;
  priceRange?: string;
  foodPairings?: string[];
  wineryDescription?: string;
}
