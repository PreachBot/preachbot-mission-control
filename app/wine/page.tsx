'use client';

import { useState, useEffect } from 'react';
import { WineEntry, WineType } from './types';
import { loadWines, addWine as saveWine } from './storage';
import WineCard from './components/WineCard';
import AddWineModal from './components/AddWineModal';

export default function WineJournal() {
  const [wines, setWines] = useState<WineEntry[]>([]);
  const [filteredWines, setFilteredWines] = useState<WineEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<WineType | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [likedOnly, setLikedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'name'>('date');

  useEffect(() => {
    const loadedWines = loadWines();
    setWines(loadedWines);
    setFilteredWines(loadedWines);
  }, []);

  useEffect(() => {
    let filtered = [...wines];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(wine =>
        wine.name.toLowerCase().includes(query) ||
        wine.producer?.toLowerCase().includes(query) ||
        wine.region?.toLowerCase().includes(query) ||
        wine.country?.toLowerCase().includes(query) ||
        wine.grapes?.some(g => g.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(wine => wine.type === typeFilter);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(wine => wine.rating >= ratingFilter);
    }

    // Liked filter
    if (likedOnly) {
      filtered = filtered.filter(wine => wine.liked);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return new Date(b.dateTasted).getTime() - new Date(a.dateTasted).getTime();
      }
    });

    setFilteredWines(filtered);
  }, [wines, searchQuery, typeFilter, ratingFilter, likedOnly, sortBy]);

  const handleAddWine = (wine: WineEntry) => {
    saveWine(wine);
    setWines(loadWines());
  };

  const handleUpdate = () => {
    setWines(loadWines());
  };

  const stats = {
    total: wines.length,
    red: wines.filter(w => w.type === 'red').length,
    white: wines.filter(w => w.type === 'white').length,
    rosé: wines.filter(w => w.type === 'rosé').length,
    sparkling: wines.filter(w => w.type === 'sparkling').length,
    favorites: wines.filter(w => w.liked).length,
    avgRating: wines.length > 0 
      ? (wines.reduce((sum, w) => sum + w.rating, 0) / wines.length).toFixed(1)
      : '0'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf5e6' }}>
      {/* Header */}
      <div className="text-white shadow-lg" style={{ background: 'linear-gradient(to right, #5c0a1e, #8b0000)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">🍷 Wine Journal</h1>
              <p className="text-red-100">Your personal wine tasting collection</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-white text-red-600 hover:bg-red-50 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              + Add Wine
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-red-100">Total Wines</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.red}</div>
              <div className="text-xs text-red-100">Red</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.white}</div>
              <div className="text-xs text-red-100">White</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.rosé}</div>
              <div className="text-xs text-red-100">Rosé</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.sparkling}</div>
              <div className="text-xs text-red-100">Sparkling</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.favorites}</div>
              <div className="text-xs text-red-100">Favorites</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.avgRating}</div>
              <div className="text-xs text-red-100">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="🔍 Search wines, producers, regions, grapes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': '#c9a84c' } as React.CSSProperties}
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as WineType | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': '#c9a84c' } as React.CSSProperties}
              >
                <option value="all">All Types</option>
                <option value="red">🍷 Red</option>
                <option value="white">🥂 White</option>
                <option value="rosé">🌸 Rosé</option>
                <option value="sparkling">🍾 Sparkling</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': '#c9a84c' } as React.CSSProperties}
              >
                <option value="all">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                <option value="3">⭐⭐⭐ 3+ Stars</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': '#c9a84c' } as React.CSSProperties}
              >
                <option value="date">Sort: Newest First</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Favorites Toggle */}
          <div className="mt-4 flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={likedOnly}
                onChange={(e) => setLikedOnly(e.target.checked)}
                className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-500 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                ❤️ Show favorites only
              </span>
            </label>
            <span className="text-sm text-gray-500 ml-auto">
              {filteredWines.length} {filteredWines.length === 1 ? 'wine' : 'wines'} shown
            </span>
          </div>
        </div>

        {/* Wine Grid */}
        {filteredWines.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍷</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              {wines.length === 0 ? 'Start Your Wine Journey' : 'No wines match your filters'}
            </h2>
            <p className="text-gray-500 mb-6">
              {wines.length === 0 
                ? 'Add your first wine to begin building your collection'
                : 'Try adjusting your search or filters'
              }
            </p>
            {wines.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(to right, #5c0a1e, #c9a84c)' }}
              >
                + Add Your First Wine
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWines.map(wine => (
              <WineCard key={wine.id} wine={wine} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>

      {/* Add Wine Modal */}
      <AddWineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddWine}
      />
    </div>
  );
}
