import { WineEntry } from './types';

const API_BASE = '/api/wine';

export const fetchWines = async (): Promise<WineEntry[]> => {
  try {
    const response = await fetch(`${API_BASE}/add`);
    if (response.ok) {
      const data = await response.json();
      return data.wines || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch wines from API:', error);
    return [];
  }
};

export const addWineToServer = async (wine: WineEntry): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wine),
    });
    
    if (response.ok) {
      return true;
    }
    console.error('Failed to add wine to server');
    return false;
  } catch (error) {
    console.error('Error adding wine to server:', error);
    return false;
  }
};

export const updateWineOnServer = async (id: string, updates: Partial<WineEntry>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates }),
    });
    
    if (response.ok) {
      return true;
    }
    console.error('Failed to update wine on server');
    return false;
  } catch (error) {
    console.error('Error updating wine on server:', error);
    return false;
  }
};

export const syncWinesWithServer = async (localWines: WineEntry[]): Promise<WineEntry[]> => {
  try {
    const serverWines = await fetchWines();
    
    // Merge: prefer server data, but include any local-only wines
    const serverIds = new Set(serverWines.map(w => w.id));
    const localOnlyWines = localWines.filter(w => !serverIds.has(w.id));
    
    // Add local-only wines to server
    for (const wine of localOnlyWines) {
      await addWineToServer(wine);
    }
    
    // Return combined list
    return [...serverWines, ...localOnlyWines];
  } catch (error) {
    console.error('Failed to sync with server:', error);
    return localWines; // Fall back to local data
  }
};
