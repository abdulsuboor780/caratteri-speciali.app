import { AppSettings, FavoriteItem, HistoryItem, ThemeMode } from '../types';

const STORAGE_KEYS = {
  FAVORITES: 'caratteri_speciali_favorites_v1',
  HISTORY: 'caratteri_speciali_history_v1',
  SETTINGS: 'caratteri_speciali_settings_v1',
  CUSTOM_TEMPLATES: 'caratteri_speciali_custom_templates_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  autoCopyOnSelect: true,
  hapticFeedback: true,
  enableHistory: true,
  uppercaseFirstLetter: false,
};

// In-memory fallbacks if localStorage is restricted
let memoryFavorites: FavoriteItem[] = [];
let memoryHistory: HistoryItem[] = [];
let memorySettings: AppSettings = { ...DEFAULT_SETTINGS };

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

const hasStorage = typeof window !== 'undefined' && isLocalStorageAvailable();

// --- FAVORITES MANAGEMENT ---

export function getFavorites(): FavoriteItem[] {
  if (!hasStorage) return memoryFavorites;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!data) return [];
    return JSON.parse(data) as FavoriteItem[];
  } catch {
    return memoryFavorites;
  }
}

export function saveFavorites(favorites: FavoriteItem[]): void {
  memoryFavorites = favorites;
  if (!hasStorage) return;
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (err) {
    console.warn('Storage quota exceeded or error saving favorites:', err);
  }
}

export function addFavorite(item: Omit<FavoriteItem, 'id' | 'dateAdded'>): FavoriteItem {
  const current = getFavorites();
  // Check if already exists
  const existing = current.find((f) => f.content === item.content && f.type === item.type);
  if (existing) return existing;

  const newItem: FavoriteItem = {
    ...item,
    id: `fav_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    dateAdded: Date.now(),
  };

  const updated = [newItem, ...current];
  saveFavorites(updated);
  return newItem;
}

export function removeFavorite(idOrContent: string): void {
  const current = getFavorites();
  const updated = current.filter((f) => f.id !== idOrContent && f.content !== idOrContent);
  saveFavorites(updated);
}

export function isFavorite(content: string, type?: string): boolean {
  const current = getFavorites();
  return current.some((f) => f.content === content && (!type || f.type === type));
}

export function toggleFavorite(item: Omit<FavoriteItem, 'id' | 'dateAdded'>): boolean {
  if (isFavorite(item.content, item.type)) {
    removeFavorite(item.content);
    return false; // Removed
  } else {
    addFavorite(item);
    return true; // Added
  }
}

export function clearFavorites(): void {
  memoryFavorites = [];
  if (hasStorage) {
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  }
}

// --- HISTORY MANAGEMENT ---

export function getHistory(): HistoryItem[] {
  if (!hasStorage) return memoryHistory;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return [];
    return JSON.parse(data) as HistoryItem[];
  } catch {
    return memoryHistory;
  }
}

export function saveHistory(history: HistoryItem[]): void {
  memoryHistory = history;
  if (!hasStorage) return;
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (err) {
    console.warn('Error saving history:', err);
  }
}

export function addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
  const settings = getSettings();
  if (!settings.enableHistory) return;

  const current = getHistory();
  // Avoid immediate consecutive duplicates
  if (current.length > 0 && current[0].content === item.content) {
    return;
  }

  const newItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
  };

  // Limit history to 60 recent items for optimum performance
  const updated = [newItem, ...current.filter((h) => h.content !== item.content)].slice(0, 60);
  saveHistory(updated);
}

export function deleteHistoryItem(id: string): void {
  const current = getHistory();
  const updated = current.filter((h) => h.id !== id);
  saveHistory(updated);
}

export function clearHistory(): void {
  memoryHistory = [];
  if (hasStorage) {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }
}

// --- SETTINGS MANAGEMENT ---

export function getSettings(): AppSettings {
  if (!hasStorage) return memorySettings;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return memorySettings;
  }
}

export function updateSettings(newSettings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  memorySettings = updated;
  if (hasStorage) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving settings:', err);
    }
  }
  return updated;
}
