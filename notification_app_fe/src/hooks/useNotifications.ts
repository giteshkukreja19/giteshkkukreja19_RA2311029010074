/**
 * useNotifications Hook
 * ─────────────────────
 * Manages fetching, pagination, filtering, and read state
 * for the main notifications dashboard.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchNotifications } from '../services/notificationService';
import { logger } from '../middleware/logger';
import { isRead, markAsRead, getReadIds } from '../utils/readStore';
import type { Notification, NotificationType, FilterState } from '../types';
import { CONFIG } from '../config';

export interface UseNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  filter: FilterState;
  readIds: Set<string>;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setFilter: (update: Partial<FilterState>) => void;
  handleMarkRead: (id: string) => void;
  refresh: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds());
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const [filter, setFilterState] = useState<FilterState>({
    notificationType: 'All',
    page: CONFIG.DEFAULT_PAGE,
    limit: CONFIG.DEFAULT_LIMIT,
  });

  // Ref to track if a fetch is already in progress (prevents double-fetch)
  const fetchingRef = useRef(false);

  const load = useCallback(async (currentFilter: FilterState) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    logger.info(
      'hook',
      `useNotifications: fetching page=${currentFilter.page}, type=${currentFilter.notificationType}`
    );

    try {
      const result = await fetchNotifications({
        page: currentFilter.page,
        limit: currentFilter.limit,
        notification_type: currentFilter.notificationType,
      });

      // Merge in isRead state from local store
      const enriched = result.notifications.map((n) => ({
        ...n,
        isRead: isRead(n.ID),
      }));

      setNotifications(enriched);
      setHasNextPage(result.hasMore);
      logger.info('hook', `useNotifications: loaded ${enriched.length} notifications`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load notifications';
      setError(msg);
      setNotifications([]);
      logger.error('hook', `useNotifications: fetch failed — ${msg}`);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const setFilter = useCallback((update: Partial<FilterState>) => {
    logger.debug('state', `useNotifications: filter update — ${JSON.stringify(update)}`);
    setFilterState((prev) => {
      // Reset to page 1 when type filter changes
      const newFilter = { ...prev, ...update };
      if (update.notificationType !== undefined) {
        newFilter.page = 1;
      }
      return newFilter;
    });
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    markAsRead(id);
    const newReadIds = getReadIds();
    setReadIds(new Set(newReadIds));
    setNotifications((prev) =>
      prev.map((n) => (n.ID === id ? { ...n, isRead: true } : n))
    );
    logger.info('component', `Notification ${id.slice(0, 8)}... marked as read by user`);
  }, []);

  const refresh = useCallback(() => {
    logger.info('hook', 'useNotifications: manual refresh triggered');
    load(filter);
  }, [filter, load]);

  return {
    notifications,
    isLoading,
    error,
    filter,
    readIds,
    hasNextPage,
    hasPrevPage: filter.page > 1,
    setFilter,
    handleMarkRead,
    refresh,
  };
}
