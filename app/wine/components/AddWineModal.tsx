'use client';

import { useState, useRef, FormEvent } from 'react';
import { WineEntry, WineType, WineAnalysis } from '../types';

interface AddWineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (wine: WineEntry) => void;
}

export default function AddWineModal({ isOpen, onClose, onAdd }: AddWineModalProps) {
  const [photo, setPhoto] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<Partial<WineAnalysis> | null>(null);
  
  const [name, setName] = useState('');
  const [producer, setProducer] = useState('');
  const [vintage, setVintage] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [grapes, setGrapes] = useState('');
  const [type, setType] = useState<WineType>('red');
  const [style, setStyle] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [foodPairings, setFoodPairings] = useState('');
  const [wineryDescription, setWineryDescription] = useState('');
  const [tastingNotes, setTastingNotes] = useState('');
  const [location, setLocation] = useState('');
  const [dateTasted, setDateTasted] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(3);
  const [liked, setLiked] = useState(false);
  const [wouldBuyAgain, setWouldBuyAgain] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhoto(base64);
      analyzeWineLabel(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeWineLabel = async (photoBase64: string) => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/wine/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: photoBase64 })
      });

      if (response.ok) {
        const data: WineAnalysis = await response.json();
        setAnalysisData(data);
        
        // Pre-fill form with AI analysis
        if (data.name) setName(data.name);
        if (data.producer) setProducer(data.producer);
        if (data.vintage) setVintage(data.vintage);
        if (data.region) setRegion(data.region);
        if (data.country) setCountry(data.country);
        if (data.grapes) setGrapes(data.grapes.join(', '));
        if (data.type) setType(data.type);
        if (data.style) setStyle(data.style);
        if (data.priceRange) setPriceRange(data.priceRange);
        if (data.foodPairings) setFoodPairings(data.foodPairings.join(', '));
        if (data.wineryDescription) setWineryDescription(data.wineryDescription);
      }
    } catch (error) {
      console.error('Failed to analyze wine label:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newWine: WineEntry = {
      id: Date.now().toString(),
      name: name.trim() || 'Unknown Wine',
      producer: producer.trim() || undefined,
      vintage: vintage.trim() || undefined,
      region: region.trim() || undefined,
      country: country.trim() || undefined,
      grapes: grapes.trim() ? grapes.split(',').map(g => g.trim()) : undefined,
      type,
      style: style.trim() || undefined,
      priceRange: priceRange.trim() || undefined,
      foodPairings: foodPairings.trim() ? foodPairings.split(',').map(p => p.trim()) : undefined,
      wineryDescription: wineryDescription.trim() || undefined,
      photo: photo || undefined,
      rating,
      liked,
      wouldBuyAgain,
      tastingNotes: tastingNotes.trim(),
      location: location.trim() || undefined,
      dateTasted,
      createdAt: new Date().toISOString()
    };

    onAdd(newWine);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPhoto('');
    setAnalysisData(null);
    setName('');
    setProducer('');
    setVintage('');
    setRegion('');
    setCountry('');
    setGrapes('');
    setType('red');
    setStyle('');
    setPriceRange('');
    setFoodPairings('');
    setWineryDescription('');
    setTastingNotes('');
    setLocation('');
    setDateTasted(new Date().toISOString().split('T')[0]);
    setRating(3);
    setLiked(false);
    setWouldBuyAgain(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Wine to Journal</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wine Photo
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="Wine" className="max-h-64 mx-auto rounded" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  📷 Upload Wine Photo
                </button>
              )}
            </div>
            {analyzing && (
              <p className="text-center text-purple-600 mt-2 animate-pulse">
                🧠 Analyzing wine label with AI...
              </p>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Wine Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Producer/Winery
              </label>
              <input
                type="text"
                value={producer}
                onChange={(e) => setProducer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Vintage Year
              </label>
              <input
                type="text"
                value={vintage}
                onChange={(e) => setVintage(e.target.value)}
                placeholder="e.g., 2021"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Region
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., Napa Valley"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., USA"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WineType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              >
                <option value="red">Red</option>
                <option value="white">White</option>
                <option value="rosé">Rosé</option>
                <option value="sparkling">Sparkling</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Grape Varieties
              </label>
              <input
                type="text"
                value={grapes}
                onChange={(e) => setGrapes(e.target.value)}
                placeholder="e.g., Cabernet Sauvignon, Merlot"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Style
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., Bold & Full-bodied"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price Range
              </label>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="e.g., $30-50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Food Pairings
              </label>
              <input
                type="text"
                value={foodPairings}
                onChange={(e) => setFoodPairings(e.target.value)}
                placeholder="e.g., Grilled steak, Aged cheese"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Personal Notes */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-bold text-gray-900">Your Tasting Experience</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-3xl focus:outline-none"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tasting Notes
              </label>
              <textarea
                value={tastingNotes}
                onChange={(e) => setTastingNotes(e.target.value)}
                placeholder="What did you taste? How was it?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date Tasted *
                </label>
                <input
                  type="date"
                  value={dateTasted}
                  onChange={(e) => setDateTasted(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Where?
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Home, Restaurant name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={liked}
                  onChange={(e) => setLiked(e.target.checked)}
                  className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  ❤️ Add to favorites
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={wouldBuyAgain}
                  onChange={(e) => setWouldBuyAgain(e.target.checked)}
                  className="w-4 h-4 text-green-500 focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  ✓ Would buy again
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(to right, #5c0a1e, #c9a84c)' }}
          >
            Add to Journal
          </button>
        </div>
      </div>
    </div>
  );
}
