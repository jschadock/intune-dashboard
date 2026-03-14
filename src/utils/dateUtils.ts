import { format, parseISO, isValid } from 'date-fns';
import { de } from 'date-fns/locale';

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  } catch {
    return dateStr;
  }
}

export function formatRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
    if (hours > 0) return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
    return 'gerade eben';
  } catch {
    return dateStr;
  }
}
