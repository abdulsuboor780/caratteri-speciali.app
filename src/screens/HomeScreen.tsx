import React, { useState } from 'react';
import { Sparkles, Copy, Trash2, ArrowRight, Flame, Heart, AtSign, Type, Share2, Check } from 'lucide-react';
import { FontStyle, SpecialSymbol, TabType } from '../types';
import { FONT_STYLES } from '../services/fontEngine';
import { SPECIAL_SYMBOLS } from '../data/symbolsData';
import { SOCIAL_PRESETS, applySocialPreset } from '../data/socialPresets';
import { FontCard } from '../components/FontCard';
import { SymbolItem } from '../components/SymbolItem';
import { copyToClipboard } from '../utils/clipboard';
import { shareText } from '../utils/share';

interface HomeScreenProps {
  inputText: string;
  setInputText: (text: string) => void;
  onNavigateTab: (tab: TabType) => void;
  isFav: (content: string, type?: string) => boolean;
  onToggleFav: (content: string, type: 'font' | 'symbol' | 'social', label: string) => void;
  onSendToComposer: (text: string) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  inputText,
  setInputText,
  onNavigateTab,
  isFav,
  onToggleFav,
  onSendToComposer,
  onToast,
}) => {
  const [quickCopiedSocialId, setQuickCopiedSocialId] = useState<string | null>(null);

  // Top popular font styles to show in Home
  const popularFontStyles = FONT_STYLES.filter((f) => f.isPopular).slice(0, 8);

  // Top popular symbols for horizontal ribbon
  const popularSymbols = SPECIAL_SYMBOLS.filter((s) => s.isPopular).slice(0, 16);

  // Top social presets
  const popularSocialPresets = SOCIAL_PRESETS.slice(0, 4);

  const sampleChips = [
    'Ciao a tutti 🌟',
    'Instagram Bio ✨',
    'Gamer Pro ⚔️',
    'Amore Mio ♡',
    'Buona Giornata ☕',
  ];

  const handleClear = () => {
    setInputText('');
  };

  const handleCopySocial = async (preset: typeof SOCIAL_PRESETS[0]) => {
    const text = applySocialPreset(preset.template, inputText || 'Caratteri Speciali');
    const ok = await copyToClipboard(text, { title: preset.name, type: 'social' });
    if (ok) {
      setQuickCopiedSocialId(preset.id);
      onToast('Copiato!', preset.name);
      setTimeout(() => setQuickCopiedSocialId(null), 1500);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Hero Header & Main Input Box */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white p-5 sm:p-7 shadow-xl shadow-blue-500/10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generatore di Testo & Simboli</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Crea il tuo testo speciale
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mt-1 leading-relaxed">
            Trasforma il tuo testo con caratteri, font e simboli speciali da copiare e condividere su Instagram, TikTok, WhatsApp e giochi.
          </p>
        </div>

        {/* Large Text Input */}
        <div className="mt-5 bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-lg border border-white/20 dark:border-slate-800 text-slate-900 dark:text-white">
          <div className="relative">
            <textarea
              id="main-text-input"
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Scrivi o incolla qui il tuo testo..."
              className="w-full bg-transparent text-base sm:text-lg font-medium placeholder-slate-400 focus:outline-none resize-none px-2 py-1 leading-normal"
            />
            {inputText && (
              <button
                id="btn-clear-main-input"
                onClick={handleClear}
                className="absolute top-1 right-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 tap-highlight transition-colors"
                title="Cancella testo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Input Samples & Action row */}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              <span className="text-[11px] text-slate-400 font-medium shrink-0">Esempi:</span>
              {sampleChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setInputText(chip)}
                  className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors tap-highlight"
                >
                  {chip}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400 font-medium ml-auto">
              {inputText.length} caratteri
            </span>
          </div>
        </div>
      </section>

      {/* Trending Symbols Ribbon */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                Simboli di Tendenza
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tocca per copiare istantaneamente
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('symbols')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline tap-highlight"
          >
            <span>Vedi tutti (800+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {popularSymbols.map((sym) => (
            <SymbolItem
              key={sym.char}
              symbol={sym}
              isFav={isFav(sym.char, 'symbol')}
              onToggleFav={(s) => onToggleFav(s.char, 'symbol', s.name)}
              onAddToComposer={onSendToComposer}
              onCopied={(char, name) => onToast('Copiato!', name)}
            />
          ))}
        </div>
      </section>

      {/* Font Generator Live Results Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                Stili di Font Generati
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Stili Unicode compatibili con Instagram, TikTok e WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('fonts')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline tap-highlight"
          >
            <span>Tutti i 35+ Font</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid of font cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularFontStyles.map((styleItem) => {
            const transformed = styleItem.transform(inputText || 'Caratteri Speciali');
            return (
              <FontCard
                key={styleItem.id}
                styleItem={styleItem}
                originalText={inputText}
                transformedText={transformed}
                isFav={isFav(transformed, 'font')}
                onToggleFav={(text, name) => onToggleFav(text, 'font', name)}
                onSendToComposer={onSendToComposer}
                onCopied={(text, name) => onToast('Copiato!', name)}
              />
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigateTab('fonts')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md tap-highlight transition-all"
          >
            <span>Esplora tutti gli stili di font disponibili</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Social Presets & Bio Quick Picks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AtSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                Idee per Bio & Nickname
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Formati pronti all'uso per i tuoi profili social
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('social')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline tap-highlight"
          >
            <span>Altri modelli</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularSocialPresets.map((preset) => {
            const formatted = applySocialPreset(preset.template, inputText || 'Caratteri Speciali');
            const isCopied = quickCopiedSocialId === preset.id;
            return (
              <div
                key={preset.id}
                className="rounded-2xl p-4 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {preset.name}
                  </span>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100 whitespace-pre-line mt-1">
                    {formatted}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSendToComposer(formatted)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Modifica
                  </button>

                  <button
                    onClick={() => handleCopySocial(preset)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-highlight ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200'
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
      </section>
    </div>
  );
};
