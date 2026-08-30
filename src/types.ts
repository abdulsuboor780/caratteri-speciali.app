export type TabType = 
  | 'home'
  | 'fonts'
  | 'symbols'
  | 'social'
  | 'composer'
  | 'favorites'
  | 'history'
  | 'settings';

export type FontCategory = 
  | 'tutti'
  | 'serif_sans'
  | 'calligrafici'
  | 'gotici'
  | 'cerchi_quadrati'
  | 'decorativi'
  | 'invertiti'
  | 'strutturali';

export interface FontStyle {
  id: string;
  name: string;
  category: FontCategory;
  description: string;
  transform: (text: string) => string;
  isPopular?: boolean;
}

export type SymbolCategory =
  | 'tutti'
  | 'popolari'
  | 'cuori'
  | 'stelle'
  | 'frecce'
  | 'fiori_natura'
  | 'faccine'
  | 'decorazioni'
  | 'linee_bordi'
  | 'cerchi_quadrati'
  | 'musica'
  | 'giochi'
  | 'meteo'
  | 'spiritualita'
  | 'matematica'
  | 'valute'
  | 'parentesi'
  | 'numeri'
  | 'lettere_greche'
  | 'zodiaco';

export interface SpecialSymbol {
  char: string;
  name: string;
  category: SymbolCategory;
  tags: string[];
  isPopular?: boolean;
}

export type SocialCategory =
  | 'tutti'
  | 'bio_instagram'
  | 'nickname_gaming'
  | 'separatori'
  | 'cornici'
  | 'frecce_social'
  | 'cuori_social'
  | 'aesthetic_tiktok';

export interface SocialPreset {
  id: string;
  name: string;
  category: SocialCategory;
  template: string; // e.g. "꧁༺ {text} ༻꧂" or "─── ⋆⋅☆⋅⋆ ───"
  description: string;
  tags: string[];
}

export type FavoriteType = 'symbol' | 'font' | 'social' | 'composed';

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  content: string;
  title: string;
  label?: string;
  subLabel?: string;
  dateAdded: number;
}

export interface HistoryItem {
  id: string;
  content: string;
  title: string;
  type: 'copy' | 'font' | 'symbol' | 'social' | 'composer';
  timestamp: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  autoCopyOnSelect: boolean;
  hapticFeedback: boolean;
  enableHistory: boolean;
  uppercaseFirstLetter: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'favorite';
}
