import React, { useState, useRef } from 'react';
import { PenTool, Copy, Share2, Heart, Trash2, Check, Sparkles, Plus, ArrowLeftRight, Space } from 'lucide-react';
import { SPECIAL_SYMBOLS } from '../data/symbolsData';
import { FONT_STYLES } from '../services/fontEngine';
import { copyToClipboard } from '../utils/clipboard';
import { shareText } from '../utils/share';

interface ComposerScreenProps {
  composerText: string;
  setComposerText: (text: string) => void;
  isFav: (content: string, type?: string) => boolean;
  onToggleFav: (content: string, type: 'font' | 'symbol' | 'social', label: string) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

export const ComposerScreen: React.FC<ComposerScreenProps> = ({
  composerText,
  setComposerText,
  isFav,
  onToggleFav,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [activePaletteCategory, setActivePaletteCategory] = useState<'cuori' | 'stelle' | 'frecce' | 'fiori' | 'cornici' | 'kaomoji'>('cuori');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Quick symbol palettes for the composer keyboard
  const paletteSymbols = {
    cuori: ['♡', '♥', '❥', '❦', '❧', 'ʚ♡⃛ɞ', '𓆩♡𓆪', 'ᰔ', 'ෆ', 'ღ', '❣', '💗', '💖', '💘', '❤️', '🖤'],
    stelle: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⋆', '⭒', '🌟', '✨'],
    frecce: ['➔', '➜', '➤', '➥', '➳', '➸', '🏹', '➶', '➷', '↬', '↫', '↳', '↵', '⇄', '⇌', '⇶'],
    fiori: ['✿', '❀', '❁', '❃', '✾', '✽', '✼', '✻', '✺', '𓇚', '𓆸', '🌸', '🌺', '🌼', '🍀', '🌿'],
    cornici: ['【', '】', '『', '』', '「', '」', '《', '》', '꒰', '꒱', '⁅', '⁆', '亗', '父', '꧁', '꧂'],
    kaomoji: ['(◕‿◕)', '(づ｡◕‿‿◕｡)づ', 'ʕ•ᴥ•ʔ', '(╯°□°)╯', '¯\\_(ツ)_/¯', '(｡♥‿♥｡)', '(¬‿¬)', '✧(>o<)✧'],
  };

  const quickDividers = [
    '⋆┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⋆',
    '─── ⋆⋅☆⋅⋆ ───',
    '♡━━━━━━ ʚ♡⃛ɞ ━━━━━━♡',
    '🌿 ───────── ⋆⋅🍃⋅⋆ ───────── 🌿',
    '✦ ──────── ✦ ──────── ✦',
  ];

  // Insert character or string at current cursor position
  const handleInsert = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setComposerText(composerText + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = composerText.substring(0, start) + textToInsert + composerText.substring(end);
    setComposerText(newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 10);
  };

  // Apply font style to entire text or current selection
  const handleApplyFont = (styleId: string) => {
    const style = FONT_STYLES.find((f) => f.id === styleId);
    if (!style) return;

    const textarea = textareaRef.current;
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = composerText.substring(start, end);
      const transformed = style.transform(selected);
      const newText = composerText.substring(0, start) + transformed + composerText.substring(end);
      setComposerText(newText);
    } else {
      // Apply to all
      const transformed = style.transform(composerText || 'Caratteri Speciali');
      setComposerText(transformed);
    }
    onToast('Stile applicato!', style.name, 'info');
  };

  const handleCopy = async () => {
    if (!composerText.trim()) return;
    const ok = await copyToClipboard(composerText, {
      title: 'Composizione Testo',
      type: 'composer',
    });
    if (ok) {
      setCopied(true);
      onToast('Copiato negli appunti!', 'Testo composto pronto all’uso');
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = async () => {
    if (!composerText.trim()) return;
    await shareText(composerText, {
      title: 'Testo Caratteri Speciali',
    });
  };

  const charCount = composerText.length;
  const wordCount = composerText.trim() ? composerText.trim().split(/\s+/).length : 0;
  const lineCount = composerText ? composerText.split('\n').length : 0;

  return (
    <div className="space-y-4 pb-14 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <PenTool className="w-6 h-6 text-indigo-500" />
          Compositore di Testo & Bio
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Combina testo, font diversi, simboli, divisori e decorazioni in un unico messaggio personalizzato.
        </p>
      </div>

      {/* Main Editing Canvas */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col">
        {/* Editor Toolbar */}
        <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{charCount} caratteri</span>
            <span>•</span>
            <span>{wordCount} parole</span>
            <span>•</span>
            <span>{lineCount} righe</span>
          </div>

          <div className="flex items-center gap-1">
            {composerText && (
              <button
                onClick={() => setComposerText('')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="Cancella tutto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancella</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          id="composer-textarea"
          rows={6}
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          placeholder="Inizia a scrivere o clicca sui simboli e stili sotto per comporre il tuo testo speciale..."
          className="w-full p-4 bg-transparent text-base sm:text-lg font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-y min-h-[160px] leading-relaxed"
        />

        {/* Action Bar */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Save to Favorites */}
            <button
              onClick={() => onToggleFav(composerText, 'font', 'Testo Composto')}
              disabled={!composerText.trim()}
              className={`p-2.5 rounded-xl transition-all tap-highlight ${
                isFav(composerText)
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                  : 'text-slate-500 hover:text-rose-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40'
              }`}
              title="Salva nei Preferiti"
            >
              <Heart className={`w-4 h-4 ${isFav(composerText) ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              disabled={!composerText.trim()}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 tap-highlight"
              title="Condividi"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Copy */}
          <button
            id="btn-composer-copy"
            onClick={handleCopy}
            disabled={!composerText.trim()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-md tap-highlight disabled:opacity-40 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-95'
            }`}
          >
            {copied ? <Check className="w-4 h-4 stroke-[3px]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiato!' : 'Copia Testo Composto'}</span>
          </button>
        </div>
      </div>

      {/* Quick Font Transform Row */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Applica Font al Testo / Selezione
          </span>
          <span className="text-[11px] text-slate-400">Clicca per convertire</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs">
          {FONT_STYLES.slice(0, 10).map((style) => (
            <button
              key={style.id}
              onClick={() => handleApplyFont(style.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap transition-colors tap-highlight"
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Symbol Insertion Palette */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tastiera Simboli Rapidi
          </span>
          <span className="text-[11px] text-slate-400">Tocca per inserire</span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['cuori', 'stelle', 'frecce', 'fiori', 'cornici', 'kaomoji'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActivePaletteCategory(cat)}
              className={`px-3 py-1 rounded-full font-bold capitalize transition-colors ${
                activePaletteCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Character Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {paletteSymbols[activePaletteCategory].map((sym, i) => (
            <button
              key={`${sym}_${i}`}
              onClick={() => handleInsert(sym)}
              className="h-10 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-lg font-medium transition-transform active:scale-95"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Dividers & Line Breaks */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Inserisci Divisori & Linee
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickDividers.map((div, i) => (
            <button
              key={i}
              onClick={() => handleInsert(`\n${div}\n`)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700 text-left truncate transition-colors"
            >
              {div}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
