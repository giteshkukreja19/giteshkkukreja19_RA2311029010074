/**
 * Read Store Utility
 * ──────────────────
 * Persists read/unread state in localStorage so it survives page refresh.
 */

import { CONFIG } from '../config';
import { logger } from '../middleware/logger';

function getStore(): Set<string> {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.READ_NOTIFICATIONS);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    logger.warn('utils', 'Failed to parse read notifications store — resetting');
    return new Set();
  }
}

function saveStore(store: Set<string>): void {
  try {
    localStorage.setItem(
      CONFIG.STORAGE_KEYS.READ_NOTIFICATIONS,
      JSON.stringify(Array.from(store))
    );
  } catch {
    logger.error('utils', 'Failed to persist read notifications store');
  }
}

export function isRead(id: string): boolean {
  return getStore().has(id);
}

export function markAsRead(id: string): void {
  const store = getStore();
  if (!store.has(id)) {
    store.add(id);
    saveStore(store);
    logger.debug('state', `Notification ${id.slice(0, 8)}... marked as read`);
  }
}

export function getReadIds(): Set<string> {
  return getStore();
}

export function clearReadStore(): void {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.READ_NOTIFICATIONS);
  logger.info('utils', 'Read notifications store cleared');
}
