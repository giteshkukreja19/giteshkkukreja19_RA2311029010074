/**
 * useAuth Hook
 * ────────────
 * Manages authentication state across the application.
 * Triggers ensureAuthenticated on mount and exposes token status.
 */

import { useState, useEffect, useCallback } from 'react';
import { ensureAuthenticated, getAccessToken } from '../services/authService';
import { logger } from '../middleware/logger';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    logger.info('hook', 'useAuth: initiating authentication');

    try {
      await ensureAuthenticated();
      setIsAuthenticated(true);
      logger.info('hook', 'useAuth: authentication successful');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
      setIsAuthenticated(false);
      logger.error('hook', `useAuth: authentication failed — ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if already authenticated before making network call
    const existingToken = getAccessToken();
    if (existingToken) {
      setIsAuthenticated(true);
      setIsLoading(false);
      logger.debug('hook', 'useAuth: found existing token — skipping re-auth');
    } else {
      authenticate();
    }
  }, [authenticate]);

  return { isAuthenticated, isLoading, error, retry: authenticate };
}
