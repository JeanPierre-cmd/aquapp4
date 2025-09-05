// types.ts
export type NotifKind = 'info'|'success'|'warning'|'error';
export type Notif = {
  id: string;
  title: string;
  message?: string;
  kind: NotifKind;
  createdAt: string; // ISO
  read: boolean;
  data?: Record<string, unknown>; // para deep-link o acciones
};
export type NotifAction =
  | { type: 'MARK_READ'; id: string }
  | { type: 'MARK_UNREAD'; id: string }
  | { type: 'DISMISS'; id: string }
  | { type: 'ADD'; notif: Notif }
  | { type: 'CLEAR_ALL' };
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
