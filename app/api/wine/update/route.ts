import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { WineEntry } from '@/app/wine/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'wines.json');

async function readWines(): Promise<WineEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWines(wines: WineEntry[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(wines, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing wine ID' },
        { status: 400 }
      );
    }

    const wines = await readWines();
    const index = wines.findIndex(w => w.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Wine not found' },
        { status: 404 }
      );
    }

    // Update the wine
    wines[index] = { ...wines[index], ...updates };

    await writeWines(wines);

    return NextResponse.json({ 
      success: true, 
      wine: wines[index],
      message: 'Wine updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating wine:', error);
    return NextResponse.json(
      { error: 'Failed to update wine', details: error.message },
      { status: 500 }
    );
  }
}
