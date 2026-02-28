import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the recipe page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RecipeBot/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch recipe page' }, { status: 400 });
    }

    const html = await response.text();

    // Strip HTML tags to get plain text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 15000);

    // Send to Claude to extract recipe data
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Extract the recipe data from this webpage text and return ONLY a JSON object with no markdown or explanation.

The JSON must follow this exact structure:
{
  "name": "Recipe name",
  "servings": 4,
  "totalWeightG": 1200,
  "totalMacros": {
    "cal": 2000,
    "protein": 150,
    "carbs": 180,
    "fat": 60
  },
  "ingredients": [
    {
      "name": "Ingredient name",
      "weightG": 500,
      "originalQty": "1 lb",
      "cal": 800,
      "protein": 100,
      "carbs": 0,
      "fat": 10
    }
  ],
  "groceryCategories": [
    {
      "name": "Meat & Protein",
      "icon": "🥩",
      "items": [
        {
          "name": "Ingredient name",
          "qty": "1 lb",
          "note": "any helpful note",
          "highlight": "optional macro highlight like 100g protein"
        }
      ]
    }
  ]
}

Grocery categories should be: Meat & Protein 🥩, Dairy & Refrigerated 🧈, Produce 🥬, Pantry & Canned Goods 🥫, Spices & Seasonings 🌿, Other 🛒

Estimate macros as accurately as possible based on standard nutritional data.
Convert all ingredient quantities to grams for weightG.

Webpage text:
${text}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response from Claude' }, { status: 500 });
    }

    const clean = content.text.replace(/```json|```/g, '').trim();
    const recipeData = JSON.parse(clean);

    return NextResponse.json(recipeData);

  } catch (error) {
    console.error('Recipe API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze recipe' },
      { status: 500 }
    );
  }
}

