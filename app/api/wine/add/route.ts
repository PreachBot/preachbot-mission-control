import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { WineEntry } from '@/app/wine/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'wines.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // Create data directory if it doesn't exist
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    // Create empty wines file
    await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf-8');
  }
}

async function readWines(): Promise<WineEntry[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeWines(wines: WineEntry[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(wines, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const wine: WineEntry = await request.json();

    // Validate required fields
    if (!wine.name || !wine.type) {
      return NextResponse.json(
        { error: 'Missing required fields: name and type' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!wine.id) {
      wine.id = Date.now().toString();
    }

    // Set timestamps if not provided
    if (!wine.createdAt) {
      wine.createdAt = new Date().toISOString();
    }
    if (!wine.dateTasted) {
      wine.dateTasted = new Date().toISOString().split('T')[0];
    }

    // Set defaults
    wine.rating = wine.rating || 3;
    wine.liked = wine.liked ?? false;
    wine.wouldBuyAgain = wine.wouldBuyAgain ?? true;
    wine.tastingNotes = wine.tastingNotes || '';

    // Read existing wines
    const wines = await readWines();

    // Add new wine at the beginning
    wines.unshift(wine);

    // Write back to file
    await writeWines(wines);

    return NextResponse.json({ 
      success: true, 
      wine,
      message: 'Wine added successfully'
    });

  } catch (error: any) {
    console.error('Error adding wine:', error);
    return NextResponse.json(
      { error: 'Failed to add wine', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const wines = await readWines();
    return NextResponse.json({ wines, count: wines.length });
  } catch (error: any) {
    console.error('Error reading wines:', error);
    return NextResponse.json(
      { error: 'Failed to read wines', details: error.message },
      { status: 500 }
    );
  }
}
