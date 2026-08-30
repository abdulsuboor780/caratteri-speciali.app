import { copyToClipboard } from './clipboard';

export async function shareText(
  text: string,
  options?: {
    title?: string;
    dialogTitle?: string;
    onSuccess?: () => void;
    onFallbackCopy?: () => void;
  }
): Promise<boolean> {
  if (!text) return false;

  const { title = 'Caratteri Speciali', dialogTitle = 'Condividi testo speciale', onSuccess, onFallbackCopy } = options || {};

  if (navigator.share && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
      });
      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      // User cancelled or share aborted
      if (err.name === 'AbortError') {
        return false;
      }
      // If error, proceed to fallback copy
    }
  }

  // Fallback: Copy to clipboard and inform user
  const copied = await copyToClipboard(text, { title, type: 'social' });
  if (copied && onFallbackCopy) {
    onFallbackCopy();
  }
  return copied;
}
