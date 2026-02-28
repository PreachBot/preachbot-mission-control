import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function isUrl(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

async function fetchRecipeText(url: string): Promise<string> {
  // Try multiple user agents to bypass basic bot detection
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  ];

  let lastError: Error | null = null;

  for (const ua of userAgents) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) continue;

      const html = await response.text();

      // Try to extract JSON-LD recipe schema first (most reliable)
      const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatch) {
        for (const block of jsonLdMatch) {
          const content = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          try {
            const data = JSON.parse(content);
            const recipe = Array.isArray(data) ? data.find(d => d['@type'] === 'Recipe') : 
                          data['@type'] === 'Recipe' ? data : 
                          data['@graph']?.find((d: { '@type': string }) => d['@type'] === 'Recipe');
            if (recipe) {
              return JSON.stringify(recipe);
            }
          } catch {}
        }
      }

      // Fall back to stripping HTML
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return text.slice(0, 15000);
    } catch (e) {
      lastError = e as Error;
      continue;
    }
  }

  throw new Error(`Could not fetch recipe from URL. The site may be blocking requests. Try pasting the recipe text instead. (${lastError?.message})`);
}

const CLAUDE_PROMPT = (recipeContent: string) => `You are a nutrition expert. Extract the recipe data from the content below and return ONLY a valid JSON object with no markdown, no explanation, no backticks.

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
          "highlight": "100g protein total"
        }
      ]
    }
  ],
  "instructions": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ]
}

Rules:
- Grocery categories must be one of: Meat & Protein 🥩, Dairy & Refrigerated 🧈, Produce 🥬, Pantry & Canned Goods 🥫, Spices & Seasonings 🌿, Other 🛒
- Only include categories that have items
- Estimate macros using standard USDA nutritional data
- Convert all quantities to grams for weightG
- totalWeightG is the sum of all ingredient weights
- totalMacros is the sum of all ingredient macros for the whole recipe
- instructions should be clean, concise steps (3-10 steps)
- If instructions are not in the text, write simple ones based on the ingredients
- highlight field should only be filled for high-protein ingredients (show "Xg protein")

Recipe content:
${recipeContent.slice(0, 15000)}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: string = body.url || body.text || '';

    if (!input.trim()) {
      return NextResponse.json({ error: 'Please provide a URL or recipe text.' }, { status: 400 });
    }

    let recipeContent: string;
    let source: string;

    if (isUrl(input.trim())) {
      source = 'url';
      try {
        recipeContent = await fetchRecipeText(input.trim());
      } catch (err) {
        return NextResponse.json(
          { error: (err as Error).message },
          { status: 400 }
        );
      }
    } else {
      source = 'text';
      recipeContent = input;
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 3000,
      messages: [{ role: 'user', content: CLAUDE_PROMPT(recipeContent) }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response from Claude' }, { status: 500 });
    }

    const clean = content.text.replace(/```json|```/g, '').trim();
    const recipeData = JSON.parse(clean);

    return NextResponse.json({ ...recipeData, _source: source });

  } catch (error) {
    console.error('Recipe API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze recipe. Please try again or paste the text directly.' },
      { status: 500 }
    );
  }
}

