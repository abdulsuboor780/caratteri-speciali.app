import React, { useState, useMemo } from 'react';
import { AtSign, Copy, Check, Share2, Heart, PenTool, Sparkles, User, Scissors } from 'lucide-react';
import { SocialCategory, SocialPreset } from '../types';
import { SOCIAL_CATEGORIES, SOCIAL_PRESETS, applySocialPreset, getSocialPresetsByCategory } from '../data/socialPresets';
import { copyToClipboard } from '../utils/clipboard';
import { shareText } from '../utils/share';

interface SocialScreenProps {
  inputText: string;
  setInputText: (text: string) => void;
  isFav: (content: string, type?: string) => boolean;
  onToggleFav: (content: string, type: 'font' | 'symbol' | 'social', label: string) => void;
  onSendToComposer: (text: string) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

export const SocialScreen: React.FC<SocialScreenProps> = ({
  inputText,
  setInputText,
  isFav,
  onToggleFav,
  onSendToComposer,
  onToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SocialCategory>('tutti');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeName = (inputText || 'Il tuo nome').trim();

  const presets = useMemo(() => {
    return getSocialPresetsByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCopy = async (preset: SocialPreset) => {
    const formatted = applySocialPreset(preset.template, activeName);
    const ok = await copyToClipboard(formatted, {
      title: preset.name,
      type: 'social',
    });
    if (ok) {
      setCopiedId(preset.id);
      onToast('Copiato!', preset.name);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleShare = async (preset: SocialPreset) => {
    const formatted = applySocialPreset(preset.template, activeName);
    await shareText(formatted, {
      title: preset.name,
    });
  };

  return (
    <div className="space-y-5 pb-14 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <AtSign className="w-6 h-6 text-rose-500" />
          Simboli & Template per Social
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Modelli pronti per Bio Instagram, TikTok, Nickname Gaming (Free Fire, PUBG), Discord e WhatsApp.
        </p>
      </div>

      {/* Interactive Name Customizer Box */}
      <div className="sticky top-[53px] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <input
              id="social-name-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inserisci il tuo nome, username o testo..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              Resetta
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
        {SOCIAL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold whitespace-nowrap transition-all tap-highlight ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {presets.map((preset) => {
          const formatted = applySocialPreset(preset.template, activeName);
          const isCopied = copiedId === preset.id;
          const isFavorite = isFav(formatted, 'social');

          return (
            <div
              key={preset.id}
              className={`rounded-2xl p-4 bg-white dark:bg-slate-900/90 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
                isCopied
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-600'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  {preset.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {preset.tags.slice(0, 2).join(' • ')}
                </span>
              </div>

              {/* Formatted Content */}
              <div
                onClick={() => handleCopy(preset)}
                className="py-4 cursor-pointer min-h-[72px] flex items-center justify-center text-center bg-slate-50/40 dark:bg-slate-800/20 rounded-xl my-2 px-3 group"
              >
                <p
                  data-selectable="true"
                  className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed group-hover:scale-101 transition-transform"
                >
                  {formatted}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* Favorite */}
                  <button
                    onClick={() => onToggleFav(formatted, 'social', preset.name)}
                    className={`p-2 rounded-xl transition-colors tap-highlight ${
                      isFavorite
                        ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/50'
                        : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => handleShare(preset)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors tap-highlight"
                    title="Condividi"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Send to composer */}
                  <button
                    onClick={() => onSendToComposer(formatted)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors tap-highlight"
                    title="Modifica nel Compositore"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Copy Button */}
                <button
                  onClick={() => handleCopy(preset)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all tap-highlight shadow-xs ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copiato!' : 'Copia'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
