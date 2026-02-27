'use client';

import { WineEntry } from '../types';
import { updateWine } from '../storage';

interface WineCardProps {
  wine: WineEntry;
  onUpdate: () => void;
}

export default function WineCard({ wine, onUpdate }: WineCardProps) {
  const toggleLike = () => {
    updateWine(wine.id, { liked: !wine.liked });
    onUpdate();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            className={`text-xl ${star <= wine.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'white': return 'bg-yellow-50 text-yellow-800';
      case 'rosé': return 'bg-pink-100 text-pink-800';
      case 'sparkling': return 'bg-blue-50 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow font-[family-name:var(--font-raleway)]">
      {/* Photo */}
      {wine.photo && (
        <div className="relative h-64 bg-gray-100">
          <img 
            src={wine.photo} 
            alt={wine.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
          >
            <span className={`text-2xl ${wine.liked ? 'text-red-500' : 'text-gray-300'}`}>
              {wine.liked ? '❤️' : '♡'}
            </span>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 leading-tight font-[family-name:var(--font-bodoni)]">
              {wine.name}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getTypeColor(wine.type)}`}>
              {wine.type}
            </span>
          </div>
          
          {wine.producer && (
            <p className="text-gray-700 font-medium">{wine.producer}</p>
          )}
          
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            {wine.vintage && <span className="font-semibold">{wine.vintage}</span>}
            {wine.region && wine.country && (
              <span>• {wine.region}, {wine.country}</span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3">
          {renderStars()}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm mb-3">
          {wine.grapes && wine.grapes.length > 0 && (
            <div>
              <span className="font-semibold text-gray-700">Grapes:</span>{' '}
              <span className="text-gray-600">{wine.grapes.join(', ')}</span>
            </div>
          )}
          
          {wine.style && (
            <div>
              <span className="font-semibold text-gray-700">Style:</span>{' '}
              <span className="text-gray-600">{wine.style}</span>
            </div>
          )}
          
          {wine.priceRange && (
            <div>
              <span className="font-semibold text-gray-700">Price:</span>{' '}
              <span className="text-gray-600">{wine.priceRange}</span>
            </div>
          )}
        </div>

        {/* Tasting Notes */}
        {wine.tastingNotes && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 italic">"{wine.tastingNotes}"</p>
          </div>
        )}

        {/* Food Pairings */}
        {wine.foodPairings && wine.foodPairings.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">Pairs with:</p>
            <div className="flex flex-wrap gap-1">
              {wine.foodPairings.map((pairing, idx) => (
                <span key={idx} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#fef3e2', color: '#a67c00' }}>
                  {pairing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 flex items-end justify-between">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Tasted: {formatDate(wine.dateTasted)}</div>
            {wine.location && <div>At: {wine.location}</div>}
          </div>
          
          {/* Would Buy Again Badge */}
          <div className={`px-2 py-1 rounded text-xs font-semibold ${
            wine.wouldBuyAgain 
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-500 border border-gray-300'
          }`}>
            {wine.wouldBuyAgain ? '🤙 Would Buy Again' : '✗ Pass'}
          </div>
        </div>
      </div>
    </div>
  );
}
