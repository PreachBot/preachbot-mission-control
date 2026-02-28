'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const seedWines = [
  {
    id: '1',
    name: 'Napa Valley Cabernet Sauvignon',
    producer: 'Louis M. Martini',
    vintage: '2021',
    region: 'Napa Valley',
    country: 'USA',
    grapes: ['Cabernet Sauvignon'],
    type: 'red' as const,
    style: 'Bold & Full-bodied',
    priceRange: '$25-35',
    foodPairings: ['Grilled steak', 'Aged cheese', 'Roasted lamb'],
    wineryDescription: 'Historic Napa Valley winery known for elegant, structured Cabernets.',
    rating: 5,
    liked: true,
    wouldBuyAgain: true,
    tastingNotes: 'Structured, bold tannins, perfect balance. One of my absolute favorites.',
    location: 'Home',
    dateTasted: '2024-01-15',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Cabernet Sauvignon',
    producer: 'JAX Vineyards',
    vintage: '2020',
    region: 'Napa Valley',
    country: 'USA',
    grapes: ['Cabernet Sauvignon'],
    type: 'red' as const,
    style: 'Powerful & Complex',
    priceRange: '$40-60',
    foodPairings: ['Prime rib', 'Wild game', 'Dark chocolate'],
    wineryDescription: 'Premium Napa producer crafting bold, age-worthy Cabernets.',
    rating: 5,
    liked: true,
    wouldBuyAgain: true,
    tastingNotes: 'Exceptional structure, rich dark fruit, perfectly balanced tannins.',
    location: 'Wine tasting',
    dateTasted: '2024-02-10',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    name: 'St. Giorgio Toscana',
    producer: 'St. Giorgio',
    vintage: '2019',
    region: 'Tuscany',
    country: 'Italy',
    grapes: ['Sangiovese', 'Cabernet Sauvignon', 'Merlot'],
    type: 'red' as const,
    style: 'Super Tuscan - Bold & Elegant',
    priceRange: '$30-45',
    foodPairings: ['Tuscan steak', 'Pasta with ragu', 'Pecorino cheese'],
    wineryDescription: 'Super Tuscan blend combining traditional Sangiovese with international varietals.',
    rating: 5,
    liked: true,
    wouldBuyAgain: true,
    tastingNotes: 'Complex Super Tuscan, amazing depth and sophistication. Love this style.',
    location: 'Restaurant',
    dateTasted: '2024-03-05',
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: '4',
    name: 'Cabernet Sauvignon Y3',
    producer: 'Y3 Winery',
    vintage: '2019',
    region: 'Napa Valley',
    country: 'USA',
    grapes: ['Cabernet Sauvignon'],
    type: 'red' as const,
    style: 'Rich & Structured',
    priceRange: '$35-50',
    foodPairings: ['Ribeye steak', 'Braised short ribs', 'Aged cheddar'],
    wineryDescription: 'Boutique Napa producer focusing on premium mountain Cabernets.',
    rating: 4,
    liked: true,
    wouldBuyAgain: true,
    tastingNotes: 'Excellent Napa Cab with good structure and aging potential.',
    location: 'Home',
    dateTasted: '2024-04-12',
    createdAt: new Date('2024-04-12').toISOString(),
  },
  {
    id: '5',
    name: 'Unánime Gran Vino Tinto',
    producer: 'Unánime',
    vintage: '2018',
    region: 'Rioja',
    country: 'Spain',
    grapes: ['Tempranillo', 'Garnacha'],
    type: 'red' as const,
    style: 'Traditional Rioja - Elegant & Earthy',
    priceRange: '$20-30',
    foodPairings: ['Chorizo', 'Paella', 'Manchego cheese'],
    wineryDescription: 'Classic Rioja producer known for elegant, terroir-driven wines.',
    rating: 4,
    liked: true,
    wouldBuyAgain: true,
    tastingNotes: 'Great Rioja character, earthy notes, good complexity for the price.',
    location: 'Wine bar',
    dateTasted: '2024-05-20',
    createdAt: new Date('2024-05-20').toISOString(),
  },
  {
    id: '6',
    name: 'Mucchietto Primitivo',
    producer: 'Pasqua',
    vintage: '2020',
    region: 'Puglia',
    country: 'Italy',
    grapes: ['Primitivo'],
    type: 'red' as const,
    style: 'Bold & Fruity',
    priceRange: '$15-25',
    foodPairings: ['BBQ ribs', 'Pizza', 'Spicy sausage'],
    wineryDescription: 'Italian producer specializing in robust, fruit-forward Primitivo.',
    rating: 4,
    liked: false,
    wouldBuyAgain: true,
    tastingNotes: 'Rich, jammy fruit, very approachable. Great value Italian red.',
    location: 'Home',
    dateTasted: '2024-06-08',
    createdAt: new Date('2024-06-08').toISOString(),
  },
];

export default function SeedWines() {
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const seedData = async () => {
      try {
        // Check if server already has wines
        const response = await fetch('/api/wine/add');
        if (response.ok) {
          const data = await response.json();
          if (data.wines && data.wines.length > 0) {
            setSeeded(true);
            setLoading(false);
            return;
          }
        }

        // Seed each wine to the server
        for (const wine of seedWines) {
          await fetch('/api/wine/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wine),
          });
        }

        // Also save to localStorage as backup
        localStorage.setItem('wine-journal', JSON.stringify(seedWines));
        
        setSeeded(true);
        setLoading(false);
      } catch (error) {
        console.error('Error seeding wines:', error);
        // Fall back to localStorage only
        localStorage.setItem('wine-journal', JSON.stringify(seedWines));
        setSeeded(true);
        setLoading(false);
      }
    };

    seedData();
  }, []);

  const handleGoToJournal = () => {
    router.push('/wine');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-[family-name:var(--font-raleway)]" style={{ backgroundColor: '#fdf5e6' }}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        {loading ? (
          <>
            <div className="text-6xl mb-4 animate-pulse">🍷</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-bodoni)]">
              Seeding Your Collection...
            </h1>
            <p className="text-gray-600">Adding your favorite wines to the server...</p>
          </>
        ) : seeded ? (
          <>
            <div className="text-6xl mb-4">🍷✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-bodoni)]">
              Wine Collection Seeded!
            </h1>
            <p className="text-gray-600 mb-6">
              Your 6 favorite wines have been added to your journal:
            </p>
            <ul className="text-left text-sm text-gray-700 mb-6 space-y-1">
              <li>⭐⭐⭐⭐⭐ Louis M. Martini Napa Cab 2021</li>
              <li>⭐⭐⭐⭐⭐ JAX Vineyards Cabernet</li>
              <li>⭐⭐⭐⭐⭐ St. Giorgio Toscana</li>
              <li>⭐⭐⭐⭐ Y3 Cabernet Sauvignon 2019</li>
              <li>⭐⭐⭐⭐ Unánime Rioja</li>
              <li>⭐⭐⭐⭐ Pasqua Primitivo 2020</li>
            </ul>
            <button
              onClick={handleGoToJournal}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg"
            >
              View Wine Journal →
            </button>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4 animate-pulse">🍷</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-bodoni)]">
              Seeding Your Collection...
            </h1>
            <p className="text-gray-600">Adding your favorite wines...</p>
          </>
        )}
      </div>
    </div>
  );
}
