import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { photo } = await request.json();

    if (!photo) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
    }

    // Extract base64 data and media type
    const matches = photo.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid photo format' }, { status: 400 });
    }

    const [, mediaType, base64Data] = matches;

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Call Claude with vision
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: `image/${mediaType}` as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Analyze this wine bottle label and extract the following information. Return ONLY valid JSON with no additional text or formatting:

{
  "name": "exact wine name from the label",
  "producer": "winery or producer name",
  "vintage": "year (if visible)",
  "region": "wine region (e.g., Napa Valley, Tuscany)",
  "country": "country of origin",
  "grapes": ["list", "of", "grape", "varieties"],
  "type": "red|white|rosé|sparkling",
  "style": "brief style description (e.g., 'Bold & Full-bodied', 'Crisp & Elegant')",
  "priceRange": "estimated price range (e.g., '$20-30', '$50-70')",
  "foodPairings": ["suggested", "food", "pairings"],
  "wineryDescription": "brief 1-sentence description of the winery or wine's character"
}

If any field cannot be determined from the label, omit it or use null. Be accurate and concise.`
            }
          ],
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Try to parse JSON from the response
    let wineData;
    try {
      // Remove any markdown code blocks if present
      const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                       responseText.match(/(\{[\s\S]*\})/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      wineData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json({ 
        error: 'Failed to parse wine data',
        rawResponse: responseText 
      }, { status: 500 });
    }

    return NextResponse.json(wineData);

  } catch (error: any) {
    console.error('Wine analysis error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze wine label',
      details: error.message 
    }, { status: 500 });
  }
}
