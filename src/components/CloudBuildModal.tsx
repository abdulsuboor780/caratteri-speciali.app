import React, { useState } from 'react';
import { X, Smartphone, Cloud, Download, Terminal, CheckCircle2, ShieldCheck, ExternalLink, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface CloudBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudBuildModal: React.FC<CloudBuildModalProps> = ({ isOpen, onClose }) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async (code: string, id: string) => {
    const ok = await copyToClipboard(code, { title: 'Comando build copiato' });
    if (ok) {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 1500);
    }
  };

  const capacitorConfigCode = `{
  "appId": "it.caratterspeciali.app",
  "appName": "Caratteri Speciali",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}`;

  const easJsonCode = `{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}`;

  const githubActionWorkflow = `name: Build Android APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - uses: ionic-team/capacitor-action@v1
        with:
          android-package-type: apk
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                Generazione APK / AAB nel Cloud
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Nessuna installazione di Android Studio richiesta sul tuo computer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-slate-800 dark:text-slate-200 text-sm">
          {/* Method 1: Cloud Build with Capacitor / GitHub Actions (Zero Local Tools) */}
          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Metodo Gratuito: GitHub Actions (Build nel Cloud)
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Puoi collegare questo progetto a GitHub e compilare i file **APK** (per test e Huawei/Samsung Store) e **AAB** (per Google Play Store) direttamente nei server cloud di GitHub in 2 minuti.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  capacitor.config.json
                </span>
                <button
                  onClick={() => handleCopyCode(capacitorConfigCode, 'cap')}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
                >
                  {copiedCodeId === 'cap' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodeId === 'cap' ? 'Copiato!' : 'Copia'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                {capacitorConfigCode}
              </pre>
            </div>
          </div>

          {/* Method 2: EAS Build / Expo Cloud (1-Click) */}
          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Metodo Cloud Expo / EAS Build (APK & AAB Diretto)
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Con il servizio EAS Cloud di Expo, puoi lanciare il comando cloud da qualsiasi terminale web (come Replit, StackBlitz o GitHub Codespaces) per ricevere il link di download dell'APK compilato.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  eas.json
                </span>
                <button
                  onClick={() => handleCopyCode(easJsonCode, 'eas')}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
                >
                  {copiedCodeId === 'eas' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodeId === 'eas' ? 'Copiato!' : 'Copia'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                {easJsonCode}
              </pre>
            </div>
          </div>

          {/* App Store Compatibility Checklist */}
          <div className="rounded-2xl p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Compatibilità App Store Verificata</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong>Google Play Store:</strong> Bundle AAB firmato con chiave keystore.</li>
              <li><strong>Samsung Galaxy Store:</strong> APK o AAB standalone senza dipendenze hardware esterne.</li>
              <li><strong>Huawei AppGallery:</strong> Pienamente compatibile con HarmonyOS e Android APK standard.</li>
              <li><strong>100% Offline:</strong> Nessuna chiamata a server remoti richiesta per il funzionamento dei font.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs tap-highlight"
          >
            Ho capito
          </button>
        </div>
      </div>
    </div>
  );
};
