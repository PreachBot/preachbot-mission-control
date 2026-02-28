'use client';

import { useState } from 'react';

type Macros = {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Ingredient = {
  name: string;
  weightG: number;
  originalQty: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
};

type GroceryItem = {
  name: string;
  qty: string;
  note?: string;
  highlight?: string;
};

type GroceryCategory = {
  name: string;
  icon: string;
  items: GroceryItem[];
};

type RecipeData = {
  name: string;
  servings: number;
  totalWeightG: number;
  totalMacros: Macros;
  ingredients: Ingredient[];
  groceryCategories: GroceryCategory[];
};

export default function RecipePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a recipe URL');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze recipe');
      }

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze recipe');
    } finally {
      setLoading(false);
    }
  };

  const perServingMacros = recipe ? {
    cal: Math.round(recipe.totalMacros.cal / recipe.servings),
    protein: Math.round(recipe.totalMacros.protein / recipe.servings),
    carbs: Math.round(recipe.totalMacros.carbs / recipe.servings),
    fat: Math.round(recipe.totalMacros.fat / recipe.servings),
  } : null;

  return (
    <div className="min-h-screen font-[family-name:var(--font-raleway)]" style={{ backgroundColor: '#f0f9f4' }}>
      {/* Header */}
      <div className="text-white shadow-lg" style={{ background: 'linear-gradient(to right, #16a34a, #22c55e)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-[family-name:var(--font-bodoni)]">🍳 Recipe Parser</h1>
              <p className="text-green-100 font-light">AI-powered recipe analysis with macros & shopping lists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recipe URL
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="https://example.com/recipe..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold shadow-md transition-all"
            >
              {loading ? '🔄 Analyzing...' : '🧠 Analyze'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {recipe && (
          <div className="space-y-6">
            {/* Recipe Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-bodoni)]">
                {recipe.name}
              </h2>
              <p className="text-gray-600">
                🍽️ <span className="font-semibold">{recipe.servings}</span> servings
                {' • '}
                ⚖️ <span className="font-semibold">{recipe.totalWeightG}g</span> total
              </p>
            </div>

            {/* Macros Card */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-bodoni)]">
                📊 Nutrition Per Serving
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{perServingMacros?.cal}</div>
                  <div className="text-sm text-green-100">Calories</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{perServingMacros?.protein}g</div>
                  <div className="text-sm text-green-100">Protein</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{perServingMacros?.carbs}g</div>
                  <div className="text-sm text-green-100">Carbs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{perServingMacros?.fat}g</div>
                  <div className="text-sm text-green-100">Fat</div>
                </div>
              </div>
              
              {/* Total Macros */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-green-100 mb-2">Total Recipe:</p>
                <div className="flex gap-4 text-sm">
                  <span>{recipe.totalMacros.cal} cal</span>
                  <span>•</span>
                  <span>{recipe.totalMacros.protein}g protein</span>
                  <span>•</span>
                  <span>{recipe.totalMacros.carbs}g carbs</span>
                  <span>•</span>
                  <span>{recipe.totalMacros.fat}g fat</span>
                </div>
              </div>
            </div>

            {/* Shopping List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-bodoni)]">
                🛒 Shopping List
              </h3>
              <div className="space-y-6">
                {recipe.groceryCategories.map((category, idx) => (
                  <div key={idx}>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </h4>
                    <div className="space-y-2 pl-8">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start gap-3">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <span className="text-gray-600">— {item.qty}</span>
                            </div>
                            {item.note && (
                              <p className="text-sm text-gray-500 mt-0.5">{item.note}</p>
                            )}
                            {item.highlight && (
                              <p className="text-sm text-green-600 font-medium mt-0.5">
                                💪 {item.highlight}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-bodoni)]">
                📋 Ingredients Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">Ingredient</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Quantity</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Cal</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Protein</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Carbs</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ingredient, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{ingredient.name}</td>
                        <td className="p-3 text-gray-600">
                          {ingredient.originalQty}
                          <span className="text-gray-400 text-xs ml-1">({ingredient.weightG}g)</span>
                        </td>
                        <td className="p-3 text-right text-gray-700">{ingredient.cal}</td>
                        <td className="p-3 text-right text-gray-700">{ingredient.protein}g</td>
                        <td className="p-3 text-right text-gray-700">{ingredient.carbs}g</td>
                        <td className="p-3 text-right text-gray-700">{ingredient.fat}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!recipe && !loading && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Analyze Your First Recipe
            </h2>
            <p className="text-gray-500 mb-6">
              Paste a recipe URL above to get instant macros and a shopping list
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
