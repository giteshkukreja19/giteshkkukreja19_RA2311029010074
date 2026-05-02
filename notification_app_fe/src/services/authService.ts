/**
 * Auth Service
 * ────────────
 * Handles registration (one-time) and token acquisition.
 * Tokens are stored in localStorage and refreshed on expiry.
 */

import { CONFIG } from '../config';
import { logger, registerTokenGetter } from '../middleware/logger';
import type { AuthResponse } from '../types';

// Register token getter with logger to avoid circular imports
registerTokenGetter(() => localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isTokenValid(): boolean {
  const token = localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  const expiry = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
  if (!token || !expiry) return false;
  return Date.now() < parseInt(expiry, 10) * 1000;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
}

function storeToken(token: string, expiresIn: number): void {
  localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, String(expiresIn));
}

// ─── Auth Flow ────────────────────────────────────────────────────────────────

async function fetchAuthToken(clientID: string, clientSecret: string): Promise<string> {
  logger.info('auth', `Requesting auth token for client ${clientID.slice(0, 8)}...`);

  const body = {
    email: CONFIG.AUTH.EMAIL,
    name: CONFIG.AUTH.NAME,
    rollNo: CONFIG.AUTH.ROLL_NO,
    accessCode: CONFIG.AUTH.ACCESS_CODE,
    clientID,
    clientSecret,
  };

  const response = await fetch(`${CONFIG.BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    logger.error('auth', `Auth token request failed: ${response.status} - ${errText}`);
    throw new Error(`Authentication failed: ${response.status}`);
  }

  const data: AuthResponse = await response.json();
  storeToken(data.access_token, data.expires_in);
  logger.info('auth', 'Auth token acquired and stored successfully');
  return data.access_token;
}

async function registerAndGetCredentials(): Promise<{ clientID: string; clientSecret: string }> {
  // Check if credentials already stored
  const existingID = localStorage.getItem(CONFIG.STORAGE_KEYS.CLIENT_ID);
  const existingSecret = localStorage.getItem(CONFIG.STORAGE_KEYS.CLIENT_SECRET);

  if (existingID && existingSecret) {
    logger.debug('auth', 'Using cached client credentials');
    return { clientID: existingID, clientSecret: existingSecret };
  }

  logger.info('auth', 'Registering with evaluation service');

  const body = {
    email: CONFIG.AUTH.EMAIL,
    name: CONFIG.AUTH.NAME,
    mobileNo: CONFIG.AUTH.MOBILE,
    githubUsername: CONFIG.AUTH.GITHUB_USERNAME,
    rollNo: CONFIG.AUTH.ROLL_NO,
    accessCode: CONFIG.AUTH.ACCESS_CODE,
  };

  const response = await fetch(`${CONFIG.BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    // If already registered, try to use env-stored credentials
    logger.warn('auth', `Registration response ${response.status}: ${errText}`);
    throw new Error(`Registration failed: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const { clientID, clientSecret } = data;

  localStorage.setItem(CONFIG.STORAGE_KEYS.CLIENT_ID, clientID);
  localStorage.setItem(CONFIG.STORAGE_KEYS.CLIENT_SECRET, clientSecret);

  logger.info('auth', `Registration successful. ClientID: ${clientID.slice(0, 8)}...`);
  return { clientID, clientSecret };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Ensures a valid token is available.
 * Handles registration + auth in sequence if needed.
 */
export async function ensureAuthenticated(): Promise<string> {
  if (isTokenValid()) {
    logger.debug('auth', 'Existing token is valid — skipping re-auth');
    return getAccessToken()!;
  }

  logger.info('auth', 'Token missing or expired — initiating auth flow');

  // Try with stored credentials first
  const storedID = localStorage.getItem(CONFIG.STORAGE_KEYS.CLIENT_ID);
  const storedSecret = localStorage.getItem(CONFIG.STORAGE_KEYS.CLIENT_SECRET);

  if (storedID && storedSecret) {
    try {
      return await fetchAuthToken(storedID, storedSecret);
    } catch {
      logger.warn('auth', 'Stored credentials failed — attempting re-registration');
      localStorage.removeItem(CONFIG.STORAGE_KEYS.CLIENT_ID);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.CLIENT_SECRET);
    }
  }

  // Register fresh
  const { clientID, clientSecret } = await registerAndGetCredentials();
  return await fetchAuthToken(clientID, clientSecret);
}
