// service.ts (almacenamiento local por ahora; reemplazable por API)
import { Notif, NotifAction, Result } from './types';
const KEY = 'app:notif:v1';
const load = (): Notif[] => JSON.parse(localStorage.getItem(KEY) || '[]');
const save = (xs: Notif[]) => localStorage.setItem(KEY, JSON.stringify(xs.slice(0,200)));
export function reduce(state: Notif[], act: NotifAction): Notif[] {
  switch (act.type) {
    case 'ADD': return [act.notif, ...state];
    case 'DISMISS': return state.filter(n => n.id !== act.id);
    case 'MARK_READ': return state.map(n => n.id===act.id? {...n, read:true }: n);
    case 'MARK_UNREAD': return state.map(n => n.id===act.id? {...n, read:false}: n);
    case 'CLEAR_ALL': return [];
    default: return state;
  }
}
export function repo() {
  return {
    list(): Result<Notif[]> { try { return { ok:true, value: load() }; } catch(e:any){ return {ok:false, error: e?.message||'load fail'}; } },
    write(xs: Notif[]): Result<void> { try { save(xs); return {ok:true, value: undefined}; } catch(e:any){ return {ok:false, error:e?.message||'save fail'}; } }
  };
}
