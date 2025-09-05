import { useCallback, useEffect, useReducer } from 'react';
import { Notif, NotifKind } from './types';
import { repo, reduce } from './service';
import { config } from '../../shared/env';
import { toast as showToast } from './toasts';

export function useNotifications() {
  const r = repo();
  const initial = r.list().ok ? r.list().value as Notif[] : [];
  const [state, dispatch] = useReducer(reduce, initial);
  
  useEffect(() => { r.write(state); }, [state]);

  const safe = <T,>(fn: () => T) => { 
    try { 
      return { ok:true as const, value: fn() }; 
    } catch(e:any){ 
      return {ok:false as const, error:e?.message||'op fail'}; 
    } 
  };

  const toast = useCallback((message: string, kind: NotifKind = 'info') => {
    // Corrected from `config.notif` to `config.notifications` for consistency
    if (config.notifications.toastsEnabled) {
      showToast(message, kind);
    }
  }, []);

  const add = useCallback((n: Omit<Notif,'id'|'createdAt'|'read'>) => {
    const id = crypto.randomUUID?.() || String(Date.now());
    const notif: Notif = { id, createdAt: new Date().toISOString(), read:false, ...n };
    return safe(() => dispatch({ type:'ADD', notif }));
  }, []);

  const markRead = useCallback((id:string) => safe(() => dispatch({type:'MARK_READ', id})),[]);
  const markUnread = useCallback((id:string) => safe(() => dispatch({type:'MARK_UNREAD', id})),[]);
  const dismiss = useCallback((id:string) => safe(() => dispatch({type:'DISMISS', id})),[]);
  const clearAll = useCallback(() => safe(() => dispatch({type:'CLEAR_ALL'})),[]);

  return { items: state, add, markRead, markUnread, dismiss, clearAll, toast };
}
