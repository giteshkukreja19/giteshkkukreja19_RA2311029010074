/**
 * Logging Middleware — Reusable Package
 * ══════════════════════════════════════
 * Standalone logging utility for the Campus Notification System.
 * Can be imported by any frontend module.
 *
 * Usage:
 *   import { Log, logger } from './logging_middleware';
 *   Log("frontend", "info", "api", "Fetching notifications page 1");
 *   logger.error("component", "Failed to render notification card");
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type LogStack = 'frontend' | 'backend';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogPackage =
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'   // frontend
  | 'auth' | 'config' | 'middleware' | 'utils'                    // shared
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain'        // backend only
  | 'handler' | 'repository' | 'route' | 'service';              // backend only

export interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = 'http://20.207.122.201/evaluation-service';
const TOKEN_KEY = 'cns_access_token';

// ─── Token resolver ───────────────────────────────────────────────────────────

let _customTokenGetter: (() => string | null) | null = null;

/**
 * Register a custom token getter function.
 * Called before each log request. Fallback: sessionStorage.
 */
export function registerTokenGetter(fn: () => string | null): void {
  _customTokenGetter = fn;
}

function resolveToken(): string | null {
  if (_customTokenGetter) return _customTokenGetter();
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// ─── Core Function ────────────────────────────────────────────────────────────

/**
 * Log(stack, level, package, message)
 *
 * Sends a structured log to POST /evaluation-service/logs.
 * Requires a valid Bearer token in sessionStorage or via registerTokenGetter().
 *
 * This function NEVER throws — logging must be side-effect-safe.
 *
 * @param stack   - "frontend" or "backend"
 * @param level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param pkg     - Package label (see LogPackage type)
 * @param message - Human-readable log message
 */
export async function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): Promise<void> {
  const token = resolveToken();
  if (!token) return; // Cannot log without auth — silently skip

  const payload: LogPayload = { stack, level, package: pkg, message };

  try {
    const response = await fetch(`${BASE_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && process.env.NODE_ENV === 'development') {
      // Dev-only silent signal — no console.log allowed
      const el = document.createElement('meta');
      el.setAttribute('name', 'log-warn');
      el.setAttribute('content', `${response.status}: ${level}/${pkg} — ${message}`);
    }
  } catch {
    // Intentional swallow — log failures must never affect UX
  }
}

// ─── Convenience Logger Object ────────────────────────────────────────────────

/**
 * Shorthand logger with level presets.
 *
 * @example
 * logger.debug('api', 'Request sent to /notifications');
 * logger.error('component', 'NotificationCard render failed');
 */
export const logger = {
  debug: (pkg: LogPackage, message: string) => Log('frontend', 'debug', pkg, message),
  info:  (pkg: LogPackage, message: string) => Log('frontend', 'info',  pkg, message),
  warn:  (pkg: LogPackage, message: string) => Log('frontend', 'warn',  pkg, message),
  error: (pkg: LogPackage, message: string) => Log('frontend', 'error', pkg, message),
  fatal: (pkg: LogPackage, message: string) => Log('frontend', 'fatal', pkg, message),
};

export default Log;
