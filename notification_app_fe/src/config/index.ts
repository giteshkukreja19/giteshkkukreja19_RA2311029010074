// ─── Application Configuration ────────────────────────────────────────────────

export const CONFIG = {
  BASE_URL: '/evaluation-service',

  // Auth credentials (Gitesh Kukreja)
  AUTH: {
    EMAIL: 'gk7145+test8@srmist.edu.in',
    NAME: 'Gitesh Kukreja',
    ROLL_NO: 'ra231102901074',
    MOBILE: '7898137027',
    GITHUB_USERNAME: 'giteshkukreja19@',
    ACCESS_CODE: 'QkbpxH',
  },

  // Stored credentials keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'cns_access_token',
    TOKEN_EXPIRY: 'cns_token_expiry',
    CLIENT_ID: 'cns_client_id',
    CLIENT_SECRET: 'cns_client_secret',
    READ_NOTIFICATIONS: 'cns_read_notifications',
  },

  // Pagination defaults
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PRIORITY_LIMIT: 10, // fetch enough to get top 10 priority

  // Priority weights for notification types
  PRIORITY_WEIGHTS: {
    Placement: 3,
    Result: 2,
    Event: 1,
  } as Record<string, number>,

  TOP_N_PRIORITY: 10,
} as const;
