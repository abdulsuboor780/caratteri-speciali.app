import React, { useState, useMemo } from 'react';
import { Heart, Trash2, Copy, Share2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { FavoriteItem, TabType } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { shareText } from '../utils/share';

interface FavoritesScreenProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onNavigateTab: (tab: TabType) => void;
  onSendToComposer: (text: string) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

type FavFilter = 'tutti' | 'symbol' | 'font' | 'social';

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onNavigateTab,
  onSendToComposer,
  onToast,
}) => {
  const [activeFilter, setActiveFilter] = useState<FavFilter>('tutti');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredFavorites = useMemo(() => {
    if (activeFilter === 'tutti') return favorites;
    return favorites.filter((f) => f.type === activeFilter);
  }, [favorites, activeFilter]);

  const handleCopy = async (fav: FavoriteItem) => {
    const ok = await copyToClipboard(fav.content, {
      title: fav.title,
      type: fav.type as any,
    });
    if (ok) {
      setCopiedId(fav.id);
      onToast('Copiato!', fav.title);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleShare = async (fav: FavoriteItem) => {
    await shareText(fav.content, {
      title: fav.title,
    });
  };

  return (
    <div className="space-y-5 pb-14 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            I tuoi Preferiti ({favorites.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tutti i tuoi caratteri, font e modelli salvati in memoria sul dispositivo.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Svuota preferiti</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'tutti', label: 'Tutti', count: favorites.length },
            { id: 'symbol', label: 'Simboli', count: favorites.filter((f) => f.type === 'symbol').length },
            { id: 'font', label: 'Font', count: favorites.filter((f) => f.type === 'font').length },
            { id: 'social', label: 'Social', count: favorites.filter((f) => f.type === 'social').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FavFilter)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === tab.id ? 'bg-rose-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Favorites List / Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredFavorites.map((fav) => {
            const isCopied = copiedId === fav.id;
            return (
              <div
                key={fav.id}
                className={`rounded-2xl p-4 bg-white dark:bg-slate-900 border transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isCopied
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {fav.title || fav.type}
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      title="Rimuovi dai preferiti"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    onClick={() => handleCopy(fav)}
                    className="py-3 px-2 cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 rounded-xl my-1.5"
                  >
                    <p
                      data-selectable="true"
                      className="text-lg font-medium text-slate-900 dark:text-slate-100 break-words whitespace-pre-line"
                    >
                      {fav.content}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShare(fav)}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Condividi"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSendToComposer(fav.content)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline px-2"
                    >
                      Componi
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(fav)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all tap-highlight ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copiato!' : 'Copia'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Nessun preferito salvato
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Salva i tuoi font e simboli preferiti toccando l'icona del cuoricino ♡ su qualsiasi elemento per ritrovarli rapidamente qui.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => onNavigateTab('symbols')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              <span>Esplora Simboli</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Svuotare tutti i preferiti?
            </h4>
            <p className="text-xs text-slate-500">
              Questa azione cancellerà permanentemente tutti gli elementi salvati nei tuoi preferiti su questo dispositivo.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  onClearFavorites();
                  setShowClearConfirm(false);
                  onToast('Preferiti svuotati', '', 'info');
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Sì, svuota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
