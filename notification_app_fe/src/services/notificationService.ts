/**
 * Notification Service
 * ────────────────────
 * Wraps all notification API calls.
 * Handles auth headers, error handling, and response parsing.
 */

import { CONFIG } from '../config';
import { logger } from '../middleware/logger';
import { ensureAuthenticated } from './authService';
import type { Notification, NotificationsResponse, NotificationType } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  notification_type?: NotificationType | 'All';
}

export interface FetchNotificationsResult {
  notifications: Notification[];
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await ensureAuthenticated();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/**
 * Fetches paginated notifications with optional type filter.
 */
export async function fetchNotifications(
  params: FetchNotificationsParams = {}
): Promise<FetchNotificationsResult> {
  const { page = CONFIG.DEFAULT_PAGE, limit = CONFIG.DEFAULT_LIMIT, notification_type } = params;

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));

  if (notification_type && notification_type !== 'All') {
    queryParams.set('notification_type', notification_type);
  }

  const url = `${CONFIG.BASE_URL}/notifications?${queryParams.toString()}`;

  logger.info('api', `GET /notifications — page=${page}, limit=${limit}, type=${notification_type ?? 'All'}`);

  const headers = await getAuthHeaders();
  const response = await fetch(url, { method: 'GET', headers });

  if (!response.ok) {
    const errText = await response.text();
    logger.error('api', `GET /notifications failed: ${response.status} — ${errText}`);
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  const data: NotificationsResponse = await response.json();
  const notifications = data.notifications ?? [];

  logger.info('api', `GET /notifications success — received ${notifications.length} items`);

  return {
    notifications,
    page,
    limit,
    hasMore: notifications.length === limit,
  };
}

/**
 * Fetches a large batch of notifications to compute priority inbox.
 * Priority: Placement (3) > Result (2) > Event (1), then by newer timestamp.
 */
export async function fetchPriorityNotifications(topN: number = CONFIG.TOP_N_PRIORITY): Promise<Notification[]> {
  logger.info('api', `Fetching priority notifications — requesting top ${topN}`);

  // Fetch a large batch to have enough data to sort from
  const result = await fetchNotifications({ page: 1, limit: CONFIG.PRIORITY_LIMIT });
  const all = result.notifications;

  const sorted = [...all].sort((a, b) => {
    const weightA = CONFIG.PRIORITY_WEIGHTS[a.Type] ?? 0;
    const weightB = CONFIG.PRIORITY_WEIGHTS[b.Type] ?? 0;

    if (weightB !== weightA) return weightB - weightA;

    // Same weight → newer timestamp wins
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });

  const top = sorted.slice(0, topN);
  logger.info('api', `Priority sort complete — returning top ${top.length} notifications`);
  return top;
}
