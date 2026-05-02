/**
 * Logging Middleware
 * ─────────────────
 * Sends structured logs to the evaluation server.
 * Replaces all console.log usage throughout the application.
 *
 * Usage: Log("frontend", "info", "api", "Fetching notifications page 1")
 */

import { CONFIG } from '../config';
import type { LogLevel, LogPackage, LogStack } from '../types';

// ─── Token accessor (lazy import to avoid circular dep) ────────────────────────
let _tokenGetter: (() => string | null) | null = null;

export function registerTokenGetter(fn: () => string | null): void {
  _tokenGetter = fn;
}

function getToken(): string | null {
  if (_tokenGetter) return _tokenGetter();
  return sessionStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
}

// ─── Core Log Function ─────────────────────────────────────────────────────────

/**
 * Log(stack, level, package, message)
 * Sends a log entry to POST /logs endpoint.
 * Falls back silently if the request fails — logging must never crash the app.
 */
export async function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): Promise<void> {
  const token = getToken();
  if (!token) {
    // Cannot log without auth token — silently skip
    return;
  }

  const payload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    await fetch(`${CONFIG.BASE_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Intentional: logging failures must never propagate to the UI
    // Using native Error object for debugging during development only
    if (process.env.NODE_ENV === 'development') {
      // Minimal dev-only output without console.log
      const devErr = document.createElement('span');
      devErr.setAttribute('data-log-error', 'true');
      devErr.style.display = 'none';
      devErr.textContent = `[LOG_FAIL] ${level.toUpperCase()} [${pkg}] ${message}`;
      document.body.appendChild(devErr);
    }
  }
}

// ─── Convenience Wrappers ──────────────────────────────────────────────────────

export const logger = {
  debug: (pkg: LogPackage, message: string) => Log('frontend', 'debug', pkg, message),
  info:  (pkg: LogPackage, message: string) => Log('frontend', 'info',  pkg, message),
  warn:  (pkg: LogPackage, message: string) => Log('frontend', 'warn',  pkg, message),
  error: (pkg: LogPackage, message: string) => Log('frontend', 'error', pkg, message),
  fatal: (pkg: LogPackage, message: string) => Log('frontend', 'fatal', pkg, message),
};
