import React, { useState } from 'react';
import { Copy, Check, Share2, Heart, PenTool, Sparkles } from 'lucide-react';
import { FontStyle } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { shareText } from '../utils/share';

interface FontCardProps {
  styleItem: FontStyle;
  originalText: string;
  transformedText: string;
  isFav: boolean;
  onToggleFav: (text: string, styleName: string) => void;
  onSendToComposer?: (text: string) => void;
  onCopied?: (text: string, styleName: string) => void;
}

export const FontCard: React.FC<FontCardProps> = ({
  styleItem,
  originalText,
  transformedText,
  isFav,
  onToggleFav,
  onSendToComposer,
  onCopied,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(transformedText, {
      title: styleItem.name,
      type: 'font',
    });
    if (success) {
      setCopied(true);
      if (onCopied) onCopied(transformedText, styleItem.name);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = async () => {
    await shareText(transformedText, {
      title: `Font: ${styleItem.name}`,
    });
  };

  return (
    <div
      id={`font-card-${styleItem.id}`}
      className={`rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
        copied
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      {/* Header with Style name and badges */}
      <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
            {styleItem.name}
          </span>
          {styleItem.isPopular && (
            <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-2.5 h-2.5" /> Top
            </span>
          )}
        </div>

        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
          {transformedText.length} car.
        </span>
      </div>

      {/* Transformed Result Preview */}
      <div
        onClick={handleCopy}
        className="p-4 cursor-pointer group relative bg-slate-50/20 dark:bg-transparent min-h-[68px] flex items-center"
      >
        <p
          data-selectable="true"
          className="text-lg sm:text-xl font-normal text-slate-900 dark:text-slate-100 break-words leading-relaxed select-all"
        >
          {transformedText || originalText || 'Caratteri Speciali'}
        </p>
      </div>

      {/* Action Footer */}
      <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
        {/* Left quick actions */}
        <div className="flex items-center gap-1">
          {/* Favorite button */}
          <button
            type="button"
            onClick={() => onToggleFav(transformedText, styleItem.name)}
            className={`p-2 rounded-xl transition-colors tap-highlight ${
              isFav
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/50'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFav ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors tap-highlight"
            title="Condividi sui social o app"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Send to composer */}
          {onSendToComposer && (
            <button
              type="button"
              onClick={() => onSendToComposer(transformedText)}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors tap-highlight"
              title="Modifica nel Compositore"
            >
              <PenTool className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Copy Action Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 tap-highlight shadow-xs ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3px]" />
              <span>Copiato!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copia</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
