import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Type, AtSign, Check, Copy } from 'lucide-react';
import { SPECIAL_SYMBOLS } from '../data/symbolsData';
import { FONT_STYLES } from '../services/fontEngine';
import { SOCIAL_PRESETS, applySocialPreset } from '../data/socialPresets';
import { copyToClipboard } from '../utils/clipboard';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol?: (char: string) => void;
  onSelectStyle?: (styleId: string) => void;
}

type SearchFilter = 'tutti' | 'simboli' | 'font' | 'social';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
  onSelectStyle,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('tutti');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const trimmed = query.trim().toLowerCase();

  // Search Results
  const symbolResults = useMemo(() => {
    if (!trimmed) return SPECIAL_SYMBOLS.slice(0, 18);
    return SPECIAL_SYMBOLS.filter(
      (s) =>
        s.char.includes(trimmed) ||
        s.name.toLowerCase().includes(trimmed) ||
        s.tags.some((t) => t.toLowerCase().includes(trimmed))
    ).slice(0, 36);
  }, [trimmed]);

  const fontResults = useMemo(() => {
    if (!trimmed) return FONT_STYLES.slice(0, 6);
    return FONT_STYLES.filter(
      (f) =>
        f.name.toLowerCase().includes(trimmed) ||
        f.description.toLowerCase().includes(trimmed) ||
        f.id.includes(trimmed)
    );
  }, [trimmed]);

  const socialResults = useMemo(() => {
    if (!trimmed) return SOCIAL_PRESETS.slice(0, 6);
    return SOCIAL_PRESETS.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.description.toLowerCase().includes(trimmed) ||
        p.tags.some((t) => t.toLowerCase().includes(trimmed))
    );
  }, [trimmed]);

  const handleCopy = async (text: string, title: string, id: string) => {
    const success = await copyToClipboard(text, { title, type: 'copy' });
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca simboli, font, cuori, stelle, bio..."
            autoFocus
            className="w-full bg-transparent text-base sm:text-lg font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              Esc
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['tutti', 'simboli', 'font', 'social'] as SearchFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full font-semibold capitalize whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'tutti' ? 'Tutti i risultati' : f}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Symbols Section */}
          {(filter === 'tutti' || filter === 'simboli') && symbolResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Simboli ({symbolResults.length})
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {symbolResults.map((sym, idx) => {
                  const id = `sym_${sym.char}_${idx}`;
                  const isCopied = copiedId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        handleCopy(sym.char, sym.name, id);
                        if (onSelectSymbol) onSelectSymbol(sym.char);
                      }}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                        isCopied
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-blue-400 text-slate-800 dark:text-slate-100'
                      }`}
                      title={sym.name}
                    >
                      <span className="text-2xl">{sym.char}</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                        {isCopied ? 'Copiato!' : sym.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Font Styles Section */}
          {(filter === 'tutti' || filter === 'font') && fontResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-indigo-500" /> Stili di Font ({fontResults.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {fontResults.map((style) => {
                  const sample = style.transform(query.trim() || 'Caratteri Speciali');
                  const isCopied = copiedId === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => handleCopy(sample, style.name, style.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isCopied
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-blue-400'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {style.name}
                        </div>
                        <div className="text-base font-normal text-slate-900 dark:text-slate-100 truncate mt-0.5">
                          {sample}
                        </div>
                      </div>
                      <button
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Templates Section */}
          {(filter === 'tutti' || filter === 'social') && socialResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5 text-rose-500" /> Preset per Social ({socialResults.length})
                </span>
              </div>
              <div className="space-y-2">
                {socialResults.map((preset) => {
                  const applied = applySocialPreset(preset.template, query.trim() || 'Caratteri Speciali');
                  const isCopied = copiedId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleCopy(applied, preset.name, preset.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCopied
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-blue-400'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {preset.name}
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line break-words mt-1">
                          {applied}
                        </div>
                      </div>
                      <button
                        className={`p-2 rounded-xl shrink-0 ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {symbolResults.length === 0 && fontResults.length === 0 && socialResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Nessun risultato trovato per "{query}"
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Prova a cercare parole come "cuore", "stella", "gotico", "freccia" o "bio".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
