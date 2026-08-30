import React, { useState, useMemo } from 'react';
import { Type, Search, Trash2, SlidersHorizontal, Sparkles, Copy, Check, Share2, Plus } from 'lucide-react';
import { FontCategory, FontStyle } from '../types';
import { FONT_STYLES } from '../services/fontEngine';
import { FontCard } from '../components/FontCard';
import { copyToClipboard } from '../utils/clipboard';

interface FontGeneratorScreenProps {
  inputText: string;
  setInputText: (text: string) => void;
  isFav: (content: string, type?: string) => boolean;
  onToggleFav: (content: string, type: 'font' | 'symbol' | 'social', label: string) => void;
  onSendToComposer: (text: string) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

interface CategoryFilterOption {
  id: FontCategory;
  name: string;
  count: number;
}

export const FontGeneratorScreen: React.FC<FontGeneratorScreenProps> = ({
  inputText,
  setInputText,
  isFav,
  onToggleFav,
  onSendToComposer,
  onToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FontCategory>('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [showDecorOptions, setShowDecorOptions] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const categories: CategoryFilterOption[] = useMemo(() => {
    return [
      { id: 'tutti', name: 'Tutti i Font', count: FONT_STYLES.length },
      { id: 'serif_sans', name: 'Grassetto & Sans', count: FONT_STYLES.filter((f) => f.category === 'serif_sans').length },
      { id: 'calligrafici', name: 'Corsivi & Calligrafia', count: FONT_STYLES.filter((f) => f.category === 'calligrafici').length },
      { id: 'gotici', name: 'Gotici & Storici', count: FONT_STYLES.filter((f) => f.category === 'gotici').length },
      { id: 'cerchi_quadrati', name: 'Cerchiati & Quadrati', count: FONT_STYLES.filter((f) => f.category === 'cerchi_quadrati').length },
      { id: 'invertiti', name: 'Invertiti & Sottosopra', count: FONT_STYLES.filter((f) => f.category === 'invertiti').length },
      { id: 'strutturali', name: 'Barrati & Sottolineati', count: FONT_STYLES.filter((f) => f.category === 'strutturali').length },
      { id: 'decorativi', name: 'Decorativi & Bordati', count: FONT_STYLES.filter((f) => f.category === 'decorativi').length },
    ];
  }, []);

  const filteredStyles = useMemo(() => {
    return FONT_STYLES.filter((style) => {
      const matchesCategory = selectedCategory === 'tutti' || style.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || style.name.toLowerCase().includes(q) || style.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const effectiveText = (inputText || 'Caratteri Speciali').trim();

  const handleCopyAll = async () => {
    const allFormatted = filteredStyles
      .map((s) => {
        const trans = s.transform(effectiveText);
        return `${s.name}:\n${customPrefix}${trans}${customSuffix}`;
      })
      .join('\n\n');

    const ok = await copyToClipboard(allFormatted, {
      title: 'Tutti gli stili di font',
      type: 'font',
    });
    if (ok) {
      setCopiedAll(true);
      onToast('Tutti gli stili copiati!', `${filteredStyles.length} varianti copiate`);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const quickPrefixes = [
    { label: 'Nessuno', p: '', s: '' },
    { label: '✨ Scintille', p: '✨ ', s: ' ✨' },
    { label: '♡ Cuori', p: '♡ ', s: ' ♡' },
    { label: '★ Stelle', p: '★ ', s: ' ★' },
    { label: '⚔️ Gaming', p: '⚔️『 ', s: ' 』⚔️' },
    { label: '【】 Quadre', p: '【 ', s: ' 】' },
  ];

  return (
    <div className="space-y-5 pb-14 animate-in fade-in duration-200">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Type className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Generatore di Font Speciali
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Inserisci il testo per generare 35+ varianti Unicode compatibili con qualsiasi social network.
          </p>
        </div>

        {/* Copy all button */}
        <button
          id="btn-copy-all-fonts"
          onClick={handleCopyAll}
          className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all tap-highlight shadow-xs ${
            copiedAll
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900'
          }`}
        >
          {copiedAll ? <Check className="w-4 h-4 stroke-[3px]" /> : <Copy className="w-4 h-4" />}
          <span>{copiedAll ? 'Copiati tutti!' : 'Copia tutti i font'}</span>
        </button>
      </div>

      {/* Main Sticky Input Container */}
      <div className="sticky top-[53px] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div className="relative">
          <input
            id="font-generator-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Scrivi qui il tuo testo (es. ciao mondo)..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Cancella testo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Custom Prefixes and Decor toggle */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-slate-400 font-medium shrink-0">Cornici:</span>
            {quickPrefixes.map((qp) => {
              const active = customPrefix === qp.p && customSuffix === qp.s;
              return (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => {
                    setCustomPrefix(qp.p);
                    setCustomSuffix(qp.s);
                  }}
                  className={`px-2 py-0.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {qp.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowDecorOptions(!showDecorOptions)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showDecorOptions ? 'Nascondi avanzate' : 'Personalizza bordi'}</span>
          </button>
        </div>

        {/* Advanced Prefix/Suffix Row */}
        {showDecorOptions && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-slate-500 font-medium block mb-1">Prefisso personalizzato</label>
              <input
                type="text"
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                placeholder="es. ✨ "
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-slate-500 font-medium block mb-1">Suffisso personalizzato</label>
              <input
                type="text"
                value={customSuffix}
                onChange={(e) => setCustomSuffix(e.target.value)}
                placeholder="es.  ✨"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Search and Category Filter Tabs */}
      <div className="space-y-2">
        {/* Style Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca stile di font (es. gotico, corsivo, cerchiati)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-highlight flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredStyles.map((styleItem) => {
          const transformed = `${customPrefix}${styleItem.transform(effectiveText)}${customSuffix}`;
          return (
            <FontCard
              key={styleItem.id}
              styleItem={styleItem}
              originalText={effectiveText}
              transformedText={transformed}
              isFav={isFav(transformed, 'font')}
              onToggleFav={(text, name) => onToggleFav(text, 'font', name)}
              onSendToComposer={onSendToComposer}
              onCopied={(text, name) => onToast('Copiato!', name)}
            />
          );
        })}
      </div>

      {filteredStyles.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Nessun font trovato per "{searchQuery}"
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Prova a selezionare "Tutti i Font" o a modificare i termini di ricerca.
          </p>
        </div>
      )}
    </div>
  );
};
