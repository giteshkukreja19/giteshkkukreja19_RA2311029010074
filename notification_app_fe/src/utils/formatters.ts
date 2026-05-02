/**
 * Formatter Utilities
 * ───────────────────
 * Pure functions for data presentation.
 */

import type { NotificationType } from '../types';

/**
 * Formats a raw timestamp string into a human-readable format.
 * Input: "2026-04-22 17:51:30"
 * Output: "Apr 22, 2026 · 5:51 PM"
 */
export function formatTimestamp(timestamp: string): string {
  try {
    // Replace space separator with T for proper ISO parsing
    const normalized = timestamp.replace(' ', 'T');
    const date = new Date(normalized);

    if (isNaN(date.getTime())) return timestamp;

    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timestamp;
  }
}

/**
 * Returns relative time string like "2 hours ago"
 */
export function getRelativeTime(timestamp: string): string {
  try {
    const normalized = timestamp.replace(' ', 'T');
    const date = new Date(normalized);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  } catch {
    return '';
  }
}

/**
 * Returns MUI color string for each notification type.
 */
export function getTypeColor(type: NotificationType): 'success' | 'warning' | 'info' {
  const map: Record<NotificationType, 'success' | 'warning' | 'info'> = {
    Placement: 'success',
    Result: 'warning',
    Event: 'info',
  };
  return map[type] ?? 'info';
}

/**
 * Returns hex color for chip background based on type.
 */
export function getTypeHex(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    Placement: '#1B5E20',
    Result: '#E65100',
    Event: '#0D47A1',
  };
  return map[type] ?? '#37474F';
}

/**
 * Returns icon label for notification type.
 */
export function getTypeLabel(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    Placement: '💼 Placement',
    Result: '📊 Result',
    Event: '🎓 Event',
  };
  return map[type] ?? type;
}

/**
 * Truncates a message string with ellipsis.
 */
export function truncate(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}
