/**
 * usePriorityNotifications Hook
 * ──────────────────────────────
 * Fetches and sorts notifications by priority.
 * Priority: Placement > Result > Event, then newer timestamp first.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchPriorityNotifications } from '../services/notificationService';
import { logger } from '../middleware/logger';
import { isRead, markAsRead, getReadIds } from '../utils/readStore';
import type { Notification } from '../types';
import { CONFIG } from '../config';

export interface UsePriorityNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  readIds: Set<string>;
  topN: number;
  setTopN: (n: number) => void;
  handleMarkRead: (id: string) => void;
  refresh: () => void;
}

export function usePriorityNotifications(): UsePriorityNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds());
  const [topN, setTopNState] = useState<number>(CONFIG.TOP_N_PRIORITY);

  const load = useCallback(async (n: number) => {
    setIsLoading(true);
    setError(null);
    logger.info('hook', `usePriorityNotifications: loading top ${n} priority notifications`);

    try {
      const data = await fetchPriorityNotifications(n);
      const enriched = data.map((notif) => ({ ...notif, isRead: isRead(notif.ID) }));
      setNotifications(enriched);
      logger.info('hook', `usePriorityNotifications: loaded ${enriched.length} priority items`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load priority notifications';
      setError(msg);
      setNotifications([]);
      logger.error('hook', `usePriorityNotifications: fetch failed — ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(topN);
  }, [topN, load]);

  const setTopN = useCallback((n: number) => {
    logger.debug('state', `usePriorityNotifications: topN changed to ${n}`);
    setTopNState(n);
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    markAsRead(id);
    setReadIds(getReadIds());
    setNotifications((prev) =>
      prev.map((n) => (n.ID === id ? { ...n, isRead: true } : n))
    );
    logger.info('component', `Priority notification ${id.slice(0, 8)}... marked as read`);
  }, []);

  const refresh = useCallback(() => {
    logger.info('hook', 'usePriorityNotifications: manual refresh triggered');
    load(topN);
  }, [topN, load]);

  return {
    notifications,
    isLoading,
    error,
    readIds,
    topN,
    setTopN,
    handleMarkRead,
    refresh,
  };
}
