import { addToHistory, getSettings } from '../services/storage';

export type CopyCallback = (text: string, title?: string) => void;

let globalCopyListeners: CopyCallback[] = [];

export function registerCopyListener(listener: CopyCallback): () => void {
  globalCopyListeners.push(listener);
  return () => {
    globalCopyListeners = globalCopyListeners.filter((l) => l !== listener);
  };
}

export async function copyToClipboard(
  text: string,
  options?: {
    title?: string;
    type?: 'copy' | 'font' | 'symbol' | 'social' | 'composer';
    showToast?: boolean;
  }
): Promise<boolean> {
  if (!text) return false;

  const { title = 'Carattere Speciale', type = 'copy' } = options || {};
  let copied = false;

  // 1. Try modern navigator.clipboard
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = false;
    }
  }

  // 2. Fallback to textarea execCommand for legacy webviews / iframe constraints
  if (!copied) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      copied = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (err) {
      console.warn('Fallback copy failed:', err);
      copied = false;
    }
  }

  if (copied) {
    // Haptic vibration feedback if enabled
    const settings = getSettings();
    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {
        // Ignore haptic errors on restricted environments
      }
    }

    // Add to persistent local history
    addToHistory({
      content: text,
      title: title || 'Testo speciale',
      type,
    });

    // Notify listeners for UI toast feedback
    globalCopyListeners.forEach((fn) => fn(text, title));
  }

  return copied;
}
