import React, { useState } from 'react';
import { History, Trash2, Copy, Share2, Check, Clock, Sparkles } from 'lucide-react';
import { HistoryItem, TabType } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { shareText } from '../utils/share';

interface HistoryScreenProps {
  history: HistoryItem[];
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onNavigateTab: (tab: TabType) => void;
  onSendToComposer: (text: string) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onDeleteHistoryItem,
  onClearHistory,
  onNavigateTab,
  onSendToComposer,
  onToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);

    if (diffSec < 45) return 'Pochi istanti fa';
    if (diffMin < 60) return `${diffMin} min fa`;
    if (diffHours < 24) return `${diffHours} ore fa`;

    const date = new Date(timestamp);
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = async (item: HistoryItem) => {
    const ok = await copyToClipboard(item.content, {
      title: item.title,
      type: item.type as any,
    });
    if (ok) {
      setCopiedId(item.id);
      onToast('Copiato di nuovo!', item.title);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleShare = async (item: HistoryItem) => {
    await shareText(item.content, {
      title: item.title,
    });
  };

  return (
    <div className="space-y-5 pb-14 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-500" />
            Cronologia Recente ({history.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Elenco degli ultimi caratteri e testi copiati sul tuo dispositivo.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Cancella cronologia</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length > 0 ? (
        <div className="space-y-2.5">
          {history.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:shadow-md ${
                  isCopied
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {item.title || 'Testo speciale'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>

                  <div
                    onClick={() => handleCopy(item)}
                    className="cursor-pointer text-base sm:text-lg font-medium text-slate-900 dark:text-white mt-1 break-words line-clamp-2"
                  >
                    {item.content}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onSendToComposer(item.content)}
                    className="px-2 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Componi
                  </button>

                  <button
                    onClick={() => handleShare(item)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Condividi"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    title="Elimina elemento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopy(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-highlight ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copiato!' : 'Ricopia'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Nessuna cronologia presente
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ogni volta che copi un carattere, un font o un preset social, apparirà qui automaticamente per essere ricopiato al volo.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Cancellare la cronologia?
            </h4>
            <p className="text-xs text-slate-500">
              L'elenco degli elementi copiati di recente verrà azzerato.
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
                  onClearHistory();
                  setShowClearConfirm(false);
                  onToast('Cronologia azzerata', '', 'info');
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Cancella
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
