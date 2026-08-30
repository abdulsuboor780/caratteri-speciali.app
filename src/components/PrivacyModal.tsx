import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Database, Globe } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Privacy & Protezione Dati
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nessuna registrazione, 100% offline sul tuo dispositivo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Funzionamento Locale e Riservato
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                L'applicazione <strong>Caratteri Speciali</strong> opera interamente sul tuo dispositivo. Nessun testo digitato, generato o composto viene mai inviato a server esterni.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <EyeOff className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Nessun Tracciamento o Profilazione:</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Non utilizziamo tracker pubblicitari invasivi, cookie di terze parti o identificatori biometrici.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Preferiti & Cronologia:</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  I tuoi preferiti e la cronologia rimangono salvati esclusivamente nella memoria locale del tuo smartphone o browser. Puoi azzerarli in qualsiasi momento dalla schermata Impostazioni.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Sito Web Ufficiale:</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  L'app è la versione mobile ufficiale del portale italiano <a href="https://caratterspeciali.it/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">caratterspeciali.it</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs tap-highlight"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
