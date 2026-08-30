import React from 'react';
import { Sparkles, Moon, Sun, Monitor, Search, Globe, Smartphone, Heart } from 'lucide-react';
import { TabType, ThemeMode } from '../types';

interface HeaderProps {
  currentTab: TabType;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenSearch: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  favoritesCount: number;
  onNavigateTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  theme,
  onThemeChange,
  onOpenSearch,
  isMobileFrame,
  onToggleMobileFrame,
  favoritesCount,
  onNavigateTab,
}) => {
  const nextTheme: ThemeMode = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-indigo-400" />;
    return <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Luce';
    if (theme === 'dark') return 'Buio';
    return 'Sistema';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <button
          id="btn-header-home"
          onClick={() => onNavigateTab('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group tap-highlight"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                Caratteri Speciali
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                App
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Font, Simboli & Testi Social
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Search button */}
          <button
            id="btn-header-search"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors tap-highlight"
            title="Cerca caratteri e font"
          >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden md:inline">Cerca</span>
          </button>

          {/* Quick Favorites Shortcut */}
          <button
            id="btn-header-favorites"
            onClick={() => onNavigateTab('favorites')}
            className={`relative p-2 rounded-lg transition-colors tap-highlight ${
              currentTab === 'favorites'
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="I tuoi Preferiti"
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            id="btn-header-theme"
            onClick={() => onThemeChange(nextTheme)}
            className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors tap-highlight"
            title={`Tema attuale: ${getThemeLabel()}. Clicca per cambiare`}
          >
            {getThemeIcon()}
            <span className="hidden lg:inline text-xs font-medium text-slate-600 dark:text-slate-300">
              {getThemeLabel()}
            </span>
          </button>

          {/* Viewport Frame Toggle (Desktop only) */}
          <button
            id="btn-header-frame-toggle"
            onClick={onToggleMobileFrame}
            className="hidden sm:flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors tap-highlight text-xs"
            title={isMobileFrame ? 'Passa a schermo intero' : 'Mostra cornice mobile'}
          >
            <Smartphone className={`w-4 h-4 ${isMobileFrame ? 'text-blue-600 dark:text-blue-400' : ''}`} />
          </button>

          {/* Official Website Link */}
          <a
            id="btn-header-website"
            href="https://caratterspeciali.it/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors tap-highlight"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">caratterspeciali.it</span>
            <span className="sm:hidden">Sito</span>
          </a>
        </div>
      </div>
    </header>
  );
};
