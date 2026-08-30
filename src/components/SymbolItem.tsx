import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { SpecialSymbol } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface SymbolItemProps {
  symbol: SpecialSymbol;
  isFav: boolean;
  onToggleFav: (symbol: SpecialSymbol) => void;
  onAddToComposer?: (char: string) => void;
  onCopied?: (char: string, name: string) => void;
}

export const SymbolItem: React.FC<SymbolItemProps> = ({
  symbol,
  isFav,
  onToggleFav,
  onAddToComposer,
  onCopied,
}) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(symbol.char, {
      title: symbol.name,
      type: 'symbol',
    });
    if (success) {
      setJustCopied(true);
      if (onCopied) onCopied(symbol.char, symbol.name);
      setTimeout(() => setJustCopied(false), 1200);
    }
  };

  return (
    <div
      id={`symbol-card-${symbol.char}`}
      onClick={handleCopy}
      className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-150 cursor-pointer tap-highlight select-none ${
        justCopied
          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 scale-95 shadow-xs'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
      }`}
    >
      {/* Symbol Display */}
      <div className="h-10 sm:h-12 flex items-center justify-center w-full">
        <span className="text-2xl sm:text-3xl tracking-normal text-slate-800 dark:text-slate-100 group-hover:scale-110 transition-transform">
          {symbol.char}
        </span>
      </div>

      {/* Symbol Name */}
      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center mt-1">
        {justCopied ? 'Copiato!' : symbol.name}
      </span>

      {/* Hover/Touch Action Pills */}
      <div className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Favorite toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(symbol);
          }}
          className={`p-1 rounded-full backdrop-blur-xs transition-colors ${
            isFav
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/80'
              : 'text-slate-400 hover:text-rose-500 bg-slate-100/90 dark:bg-slate-800/90'
          }`}
          title={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
          <Heart className={`w-3 h-3 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Add to composer */}
        {onAddToComposer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToComposer(symbol.char);
            }}
            className="p-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-400 hover:text-blue-500 backdrop-blur-xs transition-colors"
            title="Inserisci nel compositore"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Copied Overlay Badge */}
      {justCopied && (
        <div className="absolute inset-0 rounded-2xl bg-emerald-600/90 text-white flex flex-col items-center justify-center gap-0.5 animate-in fade-in zoom-in-90 duration-150">
          <Check className="w-4 h-4 stroke-[3px]" />
          <span className="text-[10px] font-bold">Copiato!</span>
        </div>
      )}
    </div>
  );
};
