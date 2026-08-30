import React, { useState, useEffect } from 'react';
import { TabType, ToastMessage, FavoriteItem, HistoryItem, ThemeMode, AppSettings } from './types';
import {
  getFavorites,
  saveFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites as clearFavStorage,
  getHistory,
  saveHistory,
  deleteHistoryItem as deleteHistStorage,
  clearHistory as clearHistStorage,
  getSettings,
  updateSettings as updateSettingsStorage,
} from './services/storage';
import { registerCopyListener } from './utils/clipboard';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { CloudBuildModal } from './components/CloudBuildModal';
import { PrivacyModal } from './components/PrivacyModal';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { FontGeneratorScreen } from './screens/FontGeneratorScreen';
import { SymbolsScreen } from './screens/SymbolsScreen';
import { SocialScreen } from './screens/SocialScreen';
import { ComposerScreen } from './screens/ComposerScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [inputText, setInputText] = useState('Caratteri Speciali');
  const [composerText, setComposerText] = useState('');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCloudBuildModalOpen, setIsCloudBuildModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Load initial persistent storage
  useEffect(() => {
    setFavorites(getFavorites());
    setHistory(getHistory());
    setSettings(getSettings());
  }, []);

  // Apply Theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (theme: ThemeMode) => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(settings.theme);

    // Listen for system theme changes if set to system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (settings.theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [settings.theme]);

  // Subscribe to global clipboard copy events
  useEffect(() => {
    const unsubscribe = registerCopyListener((text, title) => {
      setHistory(getHistory());
    });
    return unsubscribe;
  }, []);

  // Toast Helper
  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'favorite' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Favorites Handlers
  const isFav = (content: string, type?: string): boolean => {
    return favorites.some((f) => f.content === content && (!type || f.type === type));
  };

  const handleToggleFav = (content: string, type: 'font' | 'symbol' | 'social', label: string) => {
    if (!content) return;
    if (isFav(content, type)) {
      removeFavorite(content);
      const updated = getFavorites();
      setFavorites(updated);
      showToast('Rimosso dai preferiti', label, 'info');
    } else {
      addFavorite({
        content,
        title: label || 'Elemento speciale',
        type,
      });
      const updated = getFavorites();
      setFavorites(updated);
      showToast('Salvato nei preferiti ❤️', label, 'favorite');
    }
  };

  const handleRemoveFavoriteById = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
    showToast('Elemento rimosso dai preferiti', '', 'info');
  };

  const handleClearFavorites = () => {
    clearFavStorage();
    setFavorites([]);
  };

  // History Handlers
  const handleDeleteHistoryItem = (id: string) => {
    deleteHistStorage(id);
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    clearHistStorage();
    setHistory([]);
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = updateSettingsStorage(newSettings);
    setSettings(updated);
  };

  // Navigation and Action routing
  const handleSendToComposer = (text: string) => {
    setComposerText((prev) => (prev ? `${prev}\n${text}` : text));
    setCurrentTab('composer');
    showToast('Inviato al compositore', 'Puoi continuare a modificarlo qui', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={(char) => {
          setIsSearchOpen(false);
          showToast('Copiato!', char);
        }}
      />

      {/* Cloud Build Android APK / AAB Modal */}
      <CloudBuildModal
        isOpen={isCloudBuildModalOpen}
        onClose={() => setIsCloudBuildModalOpen(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Responsive Viewport Wrapper */}
      <div
        className={`w-full mx-auto flex-1 flex flex-col transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-md my-4 shadow-2xl rounded-3xl border-8 border-slate-800 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden min-h-[90vh]'
            : 'max-w-4xl'
        }`}
      >
        {/* App Bar Header */}
        <Header
          currentTab={currentTab}
          theme={settings.theme}
          onThemeChange={(newTheme) => handleUpdateSettings({ theme: newTheme })}
          onOpenSearch={() => setIsSearchOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          favoritesCount={favorites.length}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />

        {/* Main Screen Router */}
        <main className="flex-1 px-4 sm:px-6 pt-4 pb-20">
          {currentTab === 'home' && (
            <HomeScreen
              inputText={inputText}
              setInputText={setInputText}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              isFav={isFav}
              onToggleFav={handleToggleFav}
              onSendToComposer={handleSendToComposer}
              onToast={showToast}
            />
          )}

          {currentTab === 'fonts' && (
            <FontGeneratorScreen
              inputText={inputText}
              setInputText={setInputText}
              isFav={isFav}
              onToggleFav={handleToggleFav}
              onSendToComposer={handleSendToComposer}
              onToast={showToast}
            />
          )}

          {currentTab === 'symbols' && (
            <SymbolsScreen
              isFav={isFav}
              onToggleFav={handleToggleFav}
              onSendToComposer={handleSendToComposer}
              onToast={showToast}
            />
          )}

          {currentTab === 'social' && (
            <SocialScreen
              inputText={inputText}
              setInputText={setInputText}
              isFav={isFav}
              onToggleFav={handleToggleFav}
              onSendToComposer={handleSendToComposer}
              onToast={showToast}
            />
          )}

          {currentTab === 'composer' && (
            <ComposerScreen
              composerText={composerText}
              setComposerText={setComposerText}
              isFav={isFav}
              onToggleFav={handleToggleFav}
              onToast={showToast}
            />
          )}

          {currentTab === 'favorites' && (
            <FavoritesScreen
              favorites={favorites}
              onRemoveFavorite={handleRemoveFavoriteById}
              onClearFavorites={handleClearFavorites}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSendToComposer={handleSendToComposer}
              onToast={showToast}
            />
          )}

          {currentTab === 'history' && (
            <HistoryScreen
              history={history}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSendToComposer={handleSendToComposer}
              onToast={showToast}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearHistory={handleClearHistory}
              onClearFavorites={handleClearFavorites}
              onOpenCloudBuildModal={() => setIsCloudBuildModalOpen(true)}
              onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onToast={showToast}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          favoritesCount={favorites.length}
          historyCount={history.length}
        />
      </div>
    </div>
  );
}

export default App;
