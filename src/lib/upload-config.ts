export const MAX_FILES = 20;
export const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300 Mo par fichier
export const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1 Go au total

const ALLOWED_EXACT = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip',
]);

export const ACCEPT_ATTRIBUTE = 'image/*,video/*,.pdf,.doc,.docx,.txt,.zip';

export function isAllowedType(type: string): boolean {
  return type.startsWith('image/') || type.startsWith('video/') || ALLOWED_EXACT.has(type);
}

export function safeFileName(name: string): string {
  const cleaned = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+/, '');
  if (!cleaned) return 'fichier';
  if (cleaned.length <= 80) return cleaned;
  const dot = cleaned.lastIndexOf('.');
  const ext = dot > 0 ? cleaned.slice(dot).slice(0, 10) : '';
  return cleaned.slice(0, 80 - ext.length) + ext;
}

export function slugify(value: string): string {
  const slug = value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  return slug || 'client';
}

export const FOLDER_PATTERN = /^\d{8}-[a-z0-9-]{1,30}-[a-f0-9]{6}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  const trim = (n: number, digits: number) => n.toFixed(digits).replace(/\.?0+$/, '');
  if (bytes < 1024 * 1024 * 1024) return `${trim(bytes / (1024 * 1024), 1)} Mo`;
  return `${trim(bytes / (1024 * 1024 * 1024), 2)} Go`;
}
