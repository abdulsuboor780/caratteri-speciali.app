import React, { useState } from 'react';
import { Settings, Sun, Moon, Monitor, Vibrate, History, Trash2, Cloud, ShieldCheck, Globe, Smartphone, Heart, Info, Check } from 'lucide-react';
import { AppSettings, ThemeMode, TabType } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;
  onOpenCloudBuildModal: () => void;
  onOpenPrivacyModal: () => void;
  onNavigateTab: (tab: TabType) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info' | 'favorite') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory,
  onClearFavorites,
  onOpenCloudBuildModal,
  onOpenPrivacyModal,
  onToast,
}) => {
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showClearFavConfirm, setShowClearFavConfirm] = useState(false);

  const themeOptions: { id: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: 'Chiaro', icon: Sun },
    { id: 'dark', label: 'Scuro', icon: Moon },
    { id: 'system', label: 'Sistema', icon: Monitor },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          Impostazioni & Info
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Personalizza l'aspetto grafico, le preferenze di tocco e visualizza le istruzioni di build per store Android.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          Tema & Aspetto Visivo
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Scegli la modalità grafica più adatta al tuo comfort visivo.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = settings.theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onUpdateSettings({ theme: opt.id });
                  onToast('Tema aggiornato', `Impostato su ${opt.label}`, 'info');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all tap-highlight ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience & Feedback Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Comportamento & Feedback
        </h3>

        {/* Haptic feedback switch */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Vibrate className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Vibrazione Aptica al Tocco
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Piccola vibrazione fisica alla copia di un simbolo o font (su smartphone supportati).
              </div>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ hapticFeedback: !settings.hapticFeedback })}
            className={`w-12 h-6 rounded-full transition-colors relative tap-highlight ${
              settings.hapticFeedback ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                settings.hapticFeedback ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Record history switch */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Salvataggio Automatico Cronologia
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Memorizza gli ultimi testi copiati per ritrovarli al volo nella scheda Cronologia.
              </div>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ enableHistory: !settings.enableHistory })}
            className={`w-12 h-6 rounded-full transition-colors relative tap-highlight ${
              settings.enableHistory ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                settings.enableHistory ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cloud Build & Export Center (Crucial User Requirement) */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              Guida Build APK / AAB nel Cloud
            </h3>
            <span className="text-[11px] text-indigo-200">
              Per Google Play, Samsung Galaxy Store & Huawei AppGallery
            </span>
          </div>
        </div>

        <p className="text-xs text-indigo-100 leading-relaxed">
          Puoi compilare questa applicazione in formato <strong>APK</strong> e <strong>AAB</strong> direttamente nel cloud tramite GitHub Actions o EAS Build, senza dover installare Android Studio sul tuo computer.
        </p>

        <button
          onClick={onOpenCloudBuildModal}
          className="w-full py-2.5 px-4 rounded-2xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-md tap-highlight"
        >
          <Smartphone className="w-4 h-4" />
          <span>Apri Istruzioni di Compilazione Cloud</span>
        </button>
      </div>

      {/* Memory & Storage Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Gestione Dati Locali
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setShowClearHistoryConfirm(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors tap-highlight"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Azzera Cronologia</span>
          </button>

          <button
            onClick={() => setShowClearFavConfirm(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors tap-highlight"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Svuota Preferiti</span>
          </button>
        </div>
      </div>

      {/* Privacy & Legal */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Trasparenza & Informazioni
        </h3>

        <div className="space-y-2">
          <button
            onClick={onOpenPrivacyModal}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Informativa sulla Privacy (100% Offline)</span>
            </div>
            <span className="text-slate-400">Leggi ›</span>
          </button>

          <a
            href="https://caratterspeciali.it/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Visita il sito web ufficiale (caratterspeciali.it)</span>
            </div>
            <span className="text-blue-600">Apri ↗</span>
          </a>
        </div>

        {/* App Version Info */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 space-y-1">
          <div className="font-bold text-slate-600 dark:text-slate-300">
            Caratteri Speciali Mobile v1.0.0
          </div>
          <div>ID Pacchetto: <code className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">it.caratterspeciali.app</code></div>
          <div className="text-[11px]">Sviluppato in lingua italiana per tutti i dispositivi Android</div>
        </div>
      </div>

      {/* Clear History Confirmation Modal */}
      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Cancellare la cronologia?
            </h4>
            <p className="text-xs text-slate-500">
              Tutti i testi copiati recentemente verranno rimossi da questo dispositivo.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearHistoryConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearHistoryConfirm(false);
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

      {/* Clear Favorites Confirmation Modal */}
      {showClearFavConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Svuotare tutti i preferiti?
            </h4>
            <p className="text-xs text-slate-500">
              Tutti i caratteri e font preferiti salvati verranno cancellati.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearFavConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  onClearFavorites();
                  setShowClearFavConfirm(false);
                  onToast('Preferiti svuotati', '', 'info');
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Svuota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
