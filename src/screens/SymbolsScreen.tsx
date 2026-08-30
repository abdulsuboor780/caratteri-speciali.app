import React, { useState, useMemo } from 'react';
import { Sparkles, Search, X, Heart, Plus, Flame, Check } from 'lucide-react';
import { SpecialSymbol, SymbolCategory } from '../types';
import { SPECIAL_SYMBOLS, SYMBOL_CATEGORIES, getSymbolsByCategory } from '../data/symbolsData';
import { SymbolItem } from '../components/SymbolItem';
import { copyToClipboard } from '../utils/clipboard';

interface SymbolsScreenProps {
  isFav: (content: string, type?: string) => boolean;
  onToggleFav: (content: string, type: 'font' | 'symbol' | 'social', label: string) => void;
  onSendToComposer: (char: string) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

export const SymbolsScreen: React.FC<SymbolsScreenProps> = ({
  isFav,
  onToggleFav,
  onSendToComposer,
  onToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SymbolCategory>('popolari');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedBatchAll, setCopiedBatchAll] = useState(false);

  const filteredSymbols = useMemo(() => {
    let list = getSymbolsByCategory(selectedCategory);
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = SPECIAL_SYMBOLS.filter(
        (s) =>
          s.char.includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const currentCategoryInfo = SYMBOL_CATEGORIES.find((c) => c.id === selectedCategory);

  const handleCopyCategoryAll = async () => {
    const allChars = filteredSymbols.map((s) => s.char).join(' ');
    const ok = await copyToClipboard(allChars, {
      title: currentCategoryInfo?.name || 'Simboli',
      type: 'symbol',
    });
    if (ok) {
      setCopiedBatchAll(true);
      onToast('Tutti i caratteri copiati!', `${filteredSymbols.length} simboli copiati negli appunti`);
      setTimeout(() => setCopiedBatchAll(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-14 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Libreria Caratteri & Simboli
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Oltre 800+ simboli, cuori, stelle, frecce ed emoticon da copiare con un tocco.
          </p>
        </div>

        {/* Copy All in Category */}
        {filteredSymbols.length > 0 && (
          <button
            onClick={handleCopyCategoryAll}
            className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all tap-highlight shadow-xs ${
              copiedBatchAll
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            {copiedBatchAll ? <Check className="w-3.5 h-3.5" /> : <span>Copia tutti ({filteredSymbols.length})</span>}
          </button>
        )}
      </div>

      {/* Live Search Input Bar */}
      <div className="sticky top-[53px] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pt-1 pb-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="symbol-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca un simbolo (es. cuore, stella, freccia, gotico)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      {!searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
          {SYMBOL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-pill-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold whitespace-nowrap transition-all tap-highlight ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-102'
                    : 'bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Current Category Header Info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          {searchQuery ? (
            <>Risultati per "{searchQuery}" ({filteredSymbols.length})</>
          ) : (
            <>
              <span>{currentCategoryInfo?.icon}</span>
              <span>{currentCategoryInfo?.name} ({filteredSymbols.length})</span>
            </>
          )}
        </span>
        <span className="text-[11px] text-slate-400">Tocca = Copia rapida</span>
      </div>

      {/* Responsive Symbol Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2.5">
        {filteredSymbols.map((symbol, idx) => (
          <SymbolItem
            key={`${symbol.char}_${idx}`}
            symbol={symbol}
            isFav={isFav(symbol.char, 'symbol')}
            onToggleFav={(s) => onToggleFav(s.char, 'symbol', s.name)}
            onAddToComposer={onSendToComposer}
            onCopied={(char, name) => onToast('Copiato!', name)}
          />
        ))}
      </div>

      {filteredSymbols.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nessun simbolo trovato
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Prova a cercare parole più generali come "fiore", "sole", "croce", "frecce".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('tutti');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold tap-highlight"
          >
            Mostra tutti i simboli
          </button>
        </div>
      )}
    </div>
  );
};
