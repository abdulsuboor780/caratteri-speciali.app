import React, { useEffect } from 'react';
import { CheckCircle2, Heart, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    if (toast.type === 'favorite') {
      return <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />;
    }
    if (toast.type === 'info') {
      return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
  };

  return (
    <div
      className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 shadow-xl backdrop-blur-md text-sm font-semibold animate-in fade-in slide-in-from-top-3 duration-200"
      role="alert"
    >
      {getIcon()}
      <span className="truncate max-w-[220px]">{toast.title}</span>
      {toast.message && (
        <span className="text-xs text-slate-300 dark:text-slate-600 font-normal truncate max-w-[120px]">
          {toast.message}
        </span>
      )}
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-900 p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
