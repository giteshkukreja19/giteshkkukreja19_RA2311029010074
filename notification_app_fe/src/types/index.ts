// ─── Notification Types ────────────────────────────────────────────────────────

export type NotificationType = 'Event' | 'Result' | 'Placement';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogStack = 'frontend';

export type LogPackage =
  | 'api'
  | 'component'
  | 'hook'
  | 'page'
  | 'state'
  | 'style'
  | 'auth'
  | 'config'
  | 'middleware'
  | 'utils';

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  isRead?: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

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

export interface AuthPayload {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export interface FilterState {
  notificationType: NotificationType | 'All';
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
