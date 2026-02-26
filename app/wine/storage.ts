import { WineEntry } from './types';

const STORAGE_KEY = 'wine-journal';

export const saveWines = (wines: WineEntry[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
  }
};

export const loadWines = (): WineEntry[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const addWine = (wine: WineEntry): void => {
  const wines = loadWines();
  wines.unshift(wine); // Add to beginning
  saveWines(wines);
};

export const updateWine = (id: string, updates: Partial<WineEntry>): void => {
  const wines = loadWines();
  const index = wines.findIndex(w => w.id === id);
  if (index !== -1) {
    wines[index] = { ...wines[index], ...updates };
    saveWines(wines);
  }
};

export const deleteWine = (id: string): void => {
  const wines = loadWines();
  saveWines(wines.filter(w => w.id !== id));
};
